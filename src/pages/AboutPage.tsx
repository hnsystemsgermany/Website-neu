import { motion } from "framer-motion";
import { Users, Lightbulb, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const team = [
    { name: "JONAS MENG", roleKey: "about.role.tech", motivationKey: "about.motivation.tech", icon: Lightbulb },
    { name: "TIM MARQUART", roleKey: "about.role.design", motivationKey: "about.motivation.design", icon: Rocket },
    { name: "MORITZ KELLER", roleKey: "about.role.business", motivationKey: "about.motivation.business", icon: Users },
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t("about.title1")} <span className="text-gradient-accent"> HN SYSTEMS</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("about.subtitle")}</p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto mb-20 rounded-xl border border-border bg-card-gradient p-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">{t("about.story.title")}</h2>
          <p className="text-muted-foreground mb-4">{t("about.story.p1")}</p>
          <p className="text-muted-foreground mb-4">{t("about.story.p2")}</p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">{t("about.vision.label")}</strong> {t("about.vision.text")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="rounded-xl border border-border bg-card-gradient p-6 text-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <member.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-sm text-primary font-medium mb-3">{t(member.roleKey)}</p>
              <p className="text-sm text-muted-foreground italic">"{t(member.motivationKey)}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
