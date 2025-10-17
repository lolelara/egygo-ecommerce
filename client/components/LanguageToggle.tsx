import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useI18n, type Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  const toggleLanguage = (lang: Locale) => {
    setLocale(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 h-8 px-2"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">
            {locale === 'ar' ? 'عربي' : 'English'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          onClick={() => toggleLanguage('ar')}
          className={locale === 'ar' ? 'bg-primary/10 font-bold' : ''}
        >
          <span className="mr-2">🇪🇬</span>
          العربية
          {locale === 'ar' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => toggleLanguage('en')}
          className={locale === 'en' ? 'bg-primary/10 font-bold' : ''}
        >
          <span className="mr-2">🇬🇧</span>
          English
          {locale === 'en' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
