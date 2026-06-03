import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type RequestBody = {
  action?: "send_code" | "verify_code";
  email?: string;
  fullName?: string;
  code?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeFullName(fullName: string) {
  return fullName.trim().replace(/\s+/g, " ");
}

function createCode() {
  const random = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return random.toString().padStart(6, "0");
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashCode(email: string, code: string) {
  const pepper = Deno.env.get("CODE_PEPPER") ?? "";
  return sha256(`${email}:${code}:${pepper}`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Nur POST-Anfragen sind erlaubt." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const resendFrom = Deno.env.get("RESEND_FROM") ?? "HN Systems <onboarding@resend.dev>";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ ok: false, error: "Supabase-Serverkonfiguration fehlt." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "Ungueltige Anfrage." }, 400);
  }

  const email = normalizeEmail(body.email ?? "");
  const fullName = normalizeFullName(body.fullName ?? "");

  if (!emailPattern.test(email)) {
    return jsonResponse({ ok: false, error: "Bitte gib eine gueltige E-Mail-Adresse ein." }, 400);
  }

  if (!fullName) {
    return jsonResponse({ ok: false, error: "Bitte gib deinen Namen ein." }, 400);
  }

  if (body.action === "send_code") {
    if (!resendApiKey) {
      return jsonResponse({ ok: false, error: "RESEND_API_KEY ist in Supabase noch nicht gesetzt." }, 500);
    }

    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
    const { data: recentCode } = await supabase
      .from("email_verification_codes")
      .select("id")
      .eq("email", email)
      .is("consumed_at", null)
      .gt("created_at", oneMinuteAgo)
      .maybeSingle();

    if (recentCode) {
      return jsonResponse({ ok: false, error: "Bitte warte kurz, bevor du einen neuen Code anforderst." }, 429);
    }

    await supabase
      .from("email_verification_codes")
      .delete()
      .eq("email", email)
      .is("consumed_at", null);

    const code = createCode();
    const codeHash = await hashCode(email, code);
    const expiresAt = new Date(Date.now() + 10 * 60_000).toISOString();

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFrom,
        to: email,
        subject: "Dein HN Systems Bestaetigungscode",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
            <h2>HN Systems Registrierung</h2>
            <p>Dein Bestaetigungscode lautet:</p>
            <p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p>
            <p>Der Code ist 10 Minuten gueltig.</p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error("Resend error", resendError);
      return jsonResponse({ ok: false, error: "Die Bestaetigungs-Mail konnte nicht gesendet werden." }, 502);
    }

    const { error: insertCodeError } = await supabase.from("email_verification_codes").insert({
      email,
      full_name: fullName,
      code_hash: codeHash,
      expires_at: expiresAt,
    });

    if (insertCodeError) {
      console.error("Code insert error", insertCodeError);
      return jsonResponse({ ok: false, error: "Der Bestaetigungscode konnte nicht gespeichert werden." }, 500);
    }

    return jsonResponse({ ok: true, message: "Bestaetigungscode gesendet." });
  }

  if (body.action === "verify_code") {
    const code = (body.code ?? "").trim();

    if (!/^\d{6}$/.test(code)) {
      return jsonResponse({ ok: false, error: "Bitte gib den sechsstelligen Code ein." }, 400);
    }

    const { data: codeRow, error: codeError } = await supabase
      .from("email_verification_codes")
      .select("id, code_hash, expires_at")
      .eq("email", email)
      .is("consumed_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (codeError || !codeRow) {
      return jsonResponse({ ok: false, error: "Der Code ist ungueltig oder abgelaufen." }, 400);
    }

    const submittedHash = await hashCode(email, code);
    if (submittedHash !== codeRow.code_hash) {
      return jsonResponse({ ok: false, error: "Der Code ist ungueltig." }, 400);
    }

    const { data: existingAccount } = await supabase
      .from("accounts")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingAccount) {
      await supabase
        .from("email_verification_codes")
        .update({ consumed_at: new Date().toISOString() })
        .eq("id", codeRow.id);

      return jsonResponse({ ok: true, message: "E-Mail wurde bestaetigt." });
    }

    const { data: createdUser, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (createUserError || !createdUser.user) {
      console.error("Auth create user error", createUserError);
      return jsonResponse({ ok: false, error: "Der Account konnte nicht angelegt werden." }, 500);
    }

    const { error: accountError } = await supabase.from("accounts").insert({
      id: createdUser.user.id,
      email,
      full_name: fullName,
      preferred_mode: "motorcycle",
    });

    if (accountError) {
      console.error("Account insert error", accountError);
      return jsonResponse({ ok: false, error: "Die E-Mail konnte nicht in accounts gespeichert werden." }, 500);
    }

    await supabase
      .from("email_verification_codes")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", codeRow.id);

    return jsonResponse({ ok: true, message: "Account wurde registriert." });
  }

  return jsonResponse({ ok: false, error: "Unbekannte Registrierungsaktion." }, 400);
});
