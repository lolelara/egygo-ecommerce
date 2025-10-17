import { useState } from "react";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function LanguageToggle() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const toggleLanguage = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    // Update document direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Store preference
    localStorage.setItem('language', lang);
    
    // Reload page to apply changes (في المستقبل يمكن استخدام i18n)
    window.location.reload();
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
            {language === 'ar' ? 'عربي' : 'English'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          onClick={() => toggleLanguage('ar')}
          className={language === 'ar' ? 'bg-primary/10 font-bold' : ''}
        >
          <span className="mr-2">🇪🇬</span>
          العربية
          {language === 'ar' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => toggleLanguage('en')}
          className={language === 'en' ? 'bg-primary/10 font-bold' : ''}
        >
          <span className="mr-2">🇬🇧</span>
          English
          {language === 'en' && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
