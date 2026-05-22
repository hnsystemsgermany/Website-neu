import { useLanguage, Language } from "@/contexts/LanguageContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const options: { code: Language; label: string; short: string }[] = [
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const current = options.find((o) => o.code === lang)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
        <Globe className="h-3.5 w-3.5" />
        {current.short}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        {options.map((o) => (
          <DropdownMenuItem
            key={o.code}
            onClick={() => setLang(o.code)}
            className={o.code === lang ? "text-primary font-medium" : ""}
          >
            <span className="w-8 text-xs text-muted-foreground">{o.short}</span>
            {o.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
