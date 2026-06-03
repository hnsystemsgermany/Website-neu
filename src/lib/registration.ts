const REGISTRATION_ENDPOINT =
  "https://kbogyoyjsehbcxpicqax.supabase.co/functions/v1/register-email";

type RegistrationAction = "send_code" | "verify_code";

type RegistrationPayload = {
  action: RegistrationAction;
  email: string;
  fullName: string;
  code?: string;
};

type RegistrationResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
};

async function callRegistrationFunction(payload: RegistrationPayload) {
  const response = await fetch(REGISTRATION_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as RegistrationResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "Registrierung konnte nicht verarbeitet werden.");
  }

  return data;
}

export function requestRegistrationCode(email: string, fullName: string) {
  return callRegistrationFunction({
    action: "send_code",
    email,
    fullName,
  });
}

export function verifyRegistrationCode(email: string, fullName: string, code: string) {
  return callRegistrationFunction({
    action: "verify_code",
    email,
    fullName,
    code,
  });
}
