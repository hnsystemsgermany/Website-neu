import { motion } from "framer-motion";

export default function ImpressumPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-8">Impressum</h1>
          <div className="space-y-6 text-muted-foreground rounded-xl border border-border bg-card-gradient p-8">
            <div>
              <h3 className="text-foreground font-semibold mb-2">Angaben gemäß § 5 TMG</h3>
              <p>SmartHelm GmbH<br />Musterstraße 1<br />12345 Musterstadt</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2">Kontakt</h3>
              <p>Telefon: +49 (0) 123 456789<br />E-Mail: info@smarthelm.de</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2">Vertreten durch</h3>
              <p>Max Müller, Jonas Weber, Felix Braun</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2">Registereintrag</h3>
              <p>Registergericht: Amtsgericht Musterstadt<br />Registernummer: HRB 12345</p>
            </div>
            <div>
              <h3 className="text-foreground font-semibold mb-2">Umsatzsteuer-ID</h3>
              <p>DE123456789</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
