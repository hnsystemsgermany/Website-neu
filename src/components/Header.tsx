import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bike, Mountain, Menu, X, User, UserPlus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";

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
  const location = useLocation();
  const { totalCount, setOpen } = useCart();
  const { t } = useLanguage();

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
          <Button size="sm" className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground glow-red">
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
                <Button size="sm" className="flex-1 bg-primary text-primary-foreground">
                  <UserPlus className="h-4 w-4 mr-1.5" /> {t("auth.register")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
