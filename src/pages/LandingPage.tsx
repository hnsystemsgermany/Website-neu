import { motion } from "framer-motion";
import { useMode } from "@/contexts/ModeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Cpu, MapPin, Star, ArrowRight, Activity, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroMotorcycle from "@/assets/hero-motorcycle.jpg";
import heroSki from "@/assets/hero-ski.jpg";
import productVideo from "../../hn-product-video 5.mp4";

export default function LandingPage() {
  const { mode } = useMode();
  const { t } = useLanguage();
  const isMotorcycle = mode === "motorcycle";

  const features = [
    { icon: Shield, titleKey: "feature.brake.title", descKey: "feature.brake.desc" },
    { icon: AlertTriangle, titleKey: "feature.shock.title", descKey: "feature.shock.desc" },
    { icon: MapPin, titleKey: "feature.gps.title", descKey: "feature.gps.desc" },
    { icon: Cpu, titleKey: "feature.smart.title", descKey: "feature.smart.desc" },
  ];

  const stats = [
    { value: "100", label: t("landing.stats.users") },
    { value: "570", label: t("landing.stats.rides") },
    { value: "99.8%", label: t("landing.stats.detection") },
    { value: "< 50ms", label: t("landing.stats.reaction") },
  ];

  const reviews = [
    { name: "Markus K.", text: "Seit ich das SmartHelm RÃ¼cklicht nutze, fÃ¼hle ich mich auf dem Motorrad deutlich sicherer.", rating: 5 },
    { name: "Lisa M.", text: "Perfekt fÃ¼r die Piste! Die ErschÃ¼tterungserkennung hat mich nach einem Sturz sofort alarmiert.", rating: 5 },
    { name: "Thomas R.", text: "Super einfache Montage und die App zeigt mir genau, wo ich gebremst habe. Klasse Produkt!", rating: 4 },
  ];

  const steps = [
    { step: "01", titleKey: "landing.step1.title", descKey: "landing.step1.desc" },
    { step: "02", titleKey: "landing.step2.title", descKey: "landing.step2.desc" },
    { step: "03", titleKey: "landing.step3.title", descKey: "landing.step3.desc" },
  ];

  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            key={mode}
            src={isMotorcycle ? heroMotorcycle : heroSki}
            alt="hero"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
              <Activity className="h-3.5 w-3.5" />
              {isMotorcycle ? t("landing.badge.motorcycle") : t("landing.badge.ski")}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
              {t("landing.hero.title1")}{" "}
              <span className="text-gradient-accent glow-red-text">{t("landing.hero.title2")}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg font-light">
              {isMotorcycle ? t("landing.hero.desc.motorcycle") : t("landing.hero.desc.ski")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-red font-heading text-base tracking-wide">
                <Link to="/shop">{t("landing.cta.buy")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-muted font-heading text-base tracking-wide">
                <Link to="/about">{t("landing.cta.more")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} className="text-center"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-3xl font-heading font-bold text-gradient-accent">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("landing.features.title1")} <span className="text-gradient-accent">SmartHelm</span> {t("landing.features.title2")}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">{t("landing.features.subtitle")}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.titleKey}
                className="group rounded-xl border border-border bg-card-gradient p-6 hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-red transition-shadow">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{t(f.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(f.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("landing.how.title")}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {isMotorcycle ? t("landing.how.desc.motorcycle") : t("landing.how.desc.ski")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {steps.map((s, i) => (
              <motion.div key={s.step} className="text-center"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="text-5xl font-heading font-bold text-primary/20 mb-3">{s.step}</div>
                <h3 className="font-heading text-xl font-semibold mb-2">{t(s.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(s.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-border bg-card-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <video
              className="aspect-video w-full bg-black object-cover"
              src={productVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("landing.reviews.title")}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {reviews.map((r, i) => (
              <motion.div key={r.name} className="rounded-xl border border-border bg-card-gradient p-6"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => (<Star key={j} className="h-4 w-4 fill-primary text-primary" />))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">"{r.text}"</p>
                <div className="text-sm font-medium text-foreground">{r.name}</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-border text-foreground hover:bg-muted">
              <Link to="/reviews">{t("landing.reviews.all")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("landing.cta.title")}</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("landing.cta.desc")}</p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-red font-heading text-base tracking-wide">
              <Link to="/shop">{t("landing.cta.order")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
