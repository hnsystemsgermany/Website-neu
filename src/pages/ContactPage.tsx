import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: t("contact.toast.title"), description: t("contact.toast.desc") });
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t("contact.title1")} <span className="text-gradient-accent">{t("contact.title2")}</span>
          </h1>
          <p className="text-muted-foreground">{t("contact.subtitle")}</p>
        </motion.div>

        {submitted ? (
          <motion.div
            className="text-center py-16 rounded-xl border border-border bg-card-gradient"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t("contact.success.title")}</h2>
            <p className="text-muted-foreground">{t("contact.success.desc")}</p>
            <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-6 border-border text-foreground hover:bg-muted">
              {t("contact.success.new")}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-border bg-card-gradient p-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contact.field.name")}</label>
                <Input required placeholder={t("contact.field.namePh")} className="bg-muted border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contact.field.email")}</label>
                <Input required type="email" placeholder="name@email.com" className="bg-muted border-border" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contact.field.category")}</label>
              <Select>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder={t("contact.field.categoryPh")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{t("contact.cat.general")}</SelectItem>
                  <SelectItem value="support">{t("contact.cat.support")}</SelectItem>
                  <SelectItem value="complaint">{t("contact.cat.complaint")}</SelectItem>
                  <SelectItem value="partnership">{t("contact.cat.partnership")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contact.field.message")}</label>
              <Textarea required placeholder={t("contact.field.messagePh")} rows={5} className="bg-muted border-border" />
            </div>
            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-red font-heading text-base tracking-wide">
              <Send className="h-4 w-4 mr-2" /> {t("contact.send")}
            </Button>
          </motion.form>
        )}

        <motion.div
          className="mt-8 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        >
          <Mail className="h-4 w-4 inline mr-1.5" />
          {t("contact.direct")} <a href="mailto:info@smarthelm.de" className="text-primary hover:underline">info@smarthelm.de</a>
        </motion.div>
      </div>
    </div>
  );
}
