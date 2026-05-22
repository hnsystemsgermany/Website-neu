import { motion } from "framer-motion";

export default function AGBPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-8">AGB</h1>
          <div className="space-y-6 text-muted-foreground rounded-xl border border-border bg-card-gradient p-8 text-sm leading-relaxed">
            <div>
              <h3 className="text-foreground font-semibold mb-2 text-base">§ 1 Geltungsbereich</h3>
              <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Geschäftsbeziehungen zwischen der SmartHelm GmbH und dem Kunden.</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2 text-base">§ 2 Vertragsschluss</h3>
              <p>Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar, sondern eine unverbindliche Aufforderung an den Kunden, Waren zu bestellen.</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2 text-base">§ 3 Widerrufsrecht</h3>
              <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
