import { motion } from "framer-motion";

export default function DatenschutzPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-8">Datenschutz</h1>
          <div className="space-y-6 text-muted-foreground rounded-xl border border-border bg-card-gradient p-8 text-sm leading-relaxed">
            <div>
              <h3 className="text-foreground font-semibold mb-2 text-base">1. Datenschutz auf einen Blick</h3>
              <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2 text-base">2. Datenerfassung auf dieser Website</h3>
              <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum entnehmen.</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2 text-base">3. Ihre Rechte</h3>
              <p>Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
