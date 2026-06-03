import { type FormEvent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bike, CheckCircle, Loader2, Mail, Mountain, Menu, X, User, UserPlus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import { requestRegistrationCode, verifyRegistrationCode } from "@/lib/registration";

const navKeys = [
  { to: "/", key: "nav.home" },
  { to: "/dashboard", key: "nav.dashboard" },
  { to: "/shop", key: "nav.shop" },
  { to: "/reviews", key: "nav.reviews" },
  { to: "/about", key: "nav.about" },
  { to: "/surveys", key: "nav.surveys" },
  { to: "/contact", key: "nav.contact" },
];

export default function Header() {
  const { mode, setMode } = useMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState<"email" | "code" | "done">("email");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const location = useLocation();
  const { totalCount, setOpen } = useCart();
  const { t } = useLanguage();

  const openRegisterDialog = () => {
    setRegisterOpen(true);
    setMenuOpen(false);
  };

  const resetRegistration = () => {
    setRegisterStep("email");
    setFullName("");
    setEmail("");
    setCode("");
    setRegistrationMessage("");
    setRegistrationError("");
    setRegistrationLoading(false);
  };

  const handleSendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegistrationError("");
    setRegistrationMessage("");

    if (!fullName.trim() || !email.trim()) {
      setRegistrationError("Bitte gib deinen Namen und deine E-Mail-Adresse ein.");
      return;
    }

    setRegistrationLoading(true);
    try {
      await requestRegistrationCode(email, fullName);
      setRegisterStep("code");
      setRegistrationMessage("Der Bestaetigungscode wurde per E-Mail verschickt.");
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : "Der Code konnte nicht gesendet werden.");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegistrationError("");
    setRegistrationMessage("");

    if (!code.trim()) {
      setRegistrationError("Bitte gib den Bestaetigungscode ein.");
      return;
    }

    setRegistrationLoading(true);
    try {
      await verifyRegistrationCode(email, fullName, code);
      setRegisterStep("done");
      setRegistrationMessage("Deine E-Mail wurde bestaetigt und dein Account wurde gespeichert.");
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : "Der Code konnte nicht bestaetigt werden.");
    } finally {
      setRegistrationLoading(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo + Mode Toggle */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary glow-red flex items-center justify-center">
              <span className="text-primary-foreground font-heading text-sm font-bold">HN</span>
            </div>
            <span className="font-heading text-lg font-bold tracking-wider text-foreground">
              HN <span className="text-gradient-accent">Systems</span>
            </span>
          </Link>

          {/* Mode Toggle */}
          <div className="hidden sm:flex items-center rounded-full border border-border bg-muted p-0.5 gap-0.5">
            <button
              onClick={() => setMode("motorcycle")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                mode === "motorcycle"
                  ? "bg-primary text-primary-foreground glow-red"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bike className="h-3.5 w-3.5" />
              {t("mode.motorcycle")}
            </button>
            <button
              onClick={() => setMode("ski")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                mode === "ski"
                  ? "bg-secondary text-secondary-foreground glow-blue"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mountain className="h-3.5 w-3.5" />
              {t("mode.ski")}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navKeys.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Auth + Cart + Lang + Mobile */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground">
            <User className="h-4 w-4 mr-1.5" />
            {t("auth.login")}
          </Button>
          <Button
            size="sm"
            onClick={openRegisterDialog}
            className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground glow-red"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            {t("auth.register")}
          </Button>
          <button
            onClick={() => setOpen(true)}
            aria-label="Cart"
            className="relative rounded-md border border-border bg-muted p-2 text-foreground hover:bg-accent transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                {totalCount}
              </span>
            )}
          </button>
          <LanguageSwitcher />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-foreground p-2"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {/* Mobile Mode Toggle */}
              <div className="flex items-center gap-2 pb-3 border-b border-border sm:hidden">
                <button
                  onClick={() => setMode("motorcycle")}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    mode === "motorcycle" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Bike className="h-4 w-4" /> {t("mode.motorcycle")}
                </button>
                <button
                  onClick={() => setMode("ski")}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    mode === "ski" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Mountain className="h-4 w-4" /> {t("mode.ski")}
                </button>
              </div>
              {navKeys.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(link.key)}
                </Link>
              ))}
              <div className="flex gap-2 pt-3 border-t border-border sm:hidden">
                <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                  <User className="h-4 w-4 mr-1.5" /> {t("auth.login")}
                </Button>
                <Button
                  size="sm"
                  onClick={openRegisterDialog}
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  <UserPlus className="h-4 w-4 mr-1.5" /> {t("auth.register")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        open={registerOpen}
        onOpenChange={(open) => {
          setRegisterOpen(open);
          if (!open) resetRegistration();
        }}
      >
        <DialogContent className="max-w-md border-border bg-background">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Registrieren</DialogTitle>
            <DialogDescription>
              {registerStep === "email"
                ? "Du erhaeltst einen Bestaetigungscode per E-Mail."
                : registerStep === "code"
                  ? "Gib den Code aus deiner E-Mail ein, um deinen Account zu bestaetigen."
                  : "Deine Registrierung ist abgeschlossen."}
            </DialogDescription>
          </DialogHeader>

          {registerStep === "email" && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-full-name">Name</Label>
                <Input
                  id="register-full-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Max Mustermann"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">E-Mail-Adresse</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={registrationLoading}>
                {registrationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                Code senden
              </Button>
            </form>
          )}

          {registerStep === "code" && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                Der Code wurde an <span className="font-medium text-foreground">{email}</span> gesendet.
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-code">Bestaetigungscode</Label>
                <Input
                  id="register-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="text-center font-heading text-xl tracking-[0.35em]"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setRegisterStep("email")}>
                  E-Mail aendern
                </Button>
                <Button type="submit" className="flex-1 bg-primary text-primary-foreground" disabled={registrationLoading}>
                  {registrationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                  Bestaetigen
                </Button>
              </div>
            </form>
          )}

          {registerStep === "done" && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-md border border-primary/30 bg-primary/10 p-4 text-sm">
                <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">E-Mail bestaetigt</p>
                  <p className="text-muted-foreground">{registrationMessage}</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => setRegisterOpen(false)}>
                Schliessen
              </Button>
            </div>
          )}

          {registrationMessage && registerStep !== "done" && (
            <p className="rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-foreground">
              {registrationMessage}
            </p>
          )}
          {registrationError && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {registrationError}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
}
