import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const allReviews = [
  { name: "Markus K.", text: "Seit ich das SmartHelm Rücklicht nutze, fühle ich mich auf dem Motorrad deutlich sicherer. Die automatische Bremserkennung funktioniert einwandfrei.", rating: 5, type: "motorcycle" as const },
  { name: "Lisa M.", text: "Perfekt für die Piste! Die Erschütterungserkennung hat mich nach einem Sturz sofort alarmiert. Großartige Technologie.", rating: 5, type: "ski" as const },
  { name: "Thomas R.", text: "Super einfache Montage und die App zeigt mir genau, wo ich gebremst habe. Klasse Produkt!", rating: 4, type: "motorcycle" as const },
  { name: "Anna S.", text: "Nutze es beim Skifahren – die GPS-Aufzeichnung ist richtig cool. Kann ich jedem empfehlen.", rating: 5, type: "ski" as const },
  { name: "Peter W.", text: "Das Bremslicht reagiert blitzschnell. Meine Mitfahrer sehen sofort, wenn ich bremse.", rating: 5, type: "motorcycle" as const },
  { name: "Julia H.", text: "Nach einem leichten Sturz hat das System sofort reagiert. Gibt mir ein sicheres Gefühl auf der Piste.", rating: 4, type: "ski" as const },
  { name: "Stefan B.", text: "Qualitativ hochwertig und zuverlässig. Sehr zufrieden mit dem Kauf.", rating: 5, type: "motorcycle" as const },
  { name: "Maria F.", text: "Tolles Produkt, aber ich würde mir noch mehr Farboptionen wünschen. Funktion ist top!", rating: 4, type: "ski" as const },
];

export default function ReviewsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"all" | "motorcycle" | "ski">("all");

  const filtered = filter === "all" ? allReviews : allReviews.filter(r => r.type === filter);
  const avg = (filtered.reduce((s, r) => s + r.rating, 0) / filtered.length).toFixed(1);

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t("reviews.title")}</h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-heading font-bold text-gradient-accent">{avg}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(Number(avg)) ? "fill-primary text-primary" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({filtered.length} {t("reviews.count")})</span>
          </div>
        </motion.div>

        <div className="flex justify-center gap-2 mb-10">
          {[
            { key: "all" as const, label: t("reviews.filter.all") },
            { key: "motorcycle" as const, label: t("reviews.filter.motorcycle") },
            { key: "ski" as const, label: t("reviews.filter.ski") },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-primary text-primary-foreground glow-red"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {filtered.map((r, i) => (
            <motion.div
              key={r.name}
              className="rounded-xl border border-border bg-card-gradient p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground capitalize rounded-full bg-muted px-2 py-0.5">
                  {r.type === "motorcycle" ? t("mode.motorcycle") : t("mode.ski")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">"{r.text}"</p>
              <div className="text-sm font-medium text-foreground">{r.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
