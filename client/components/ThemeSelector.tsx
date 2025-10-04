import { Palette } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useTheme, themeDefinitions, type ColorTheme } from '@/contexts/ThemeContext';
import { Check } from 'lucide-react';

export function ThemeSelector() {
  const { colorTheme, setColorTheme } = useTheme();

  const themes: ColorTheme[] = [
    'purple-orange',
    'blue-cyan',
    'green-teal',
    'pink-purple',
    'red-orange',
    'indigo-blue',
    'emerald-lime',
    'rose-pink'
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <span className="sr-only">اختر الثيم</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-center text-base font-semibold" dir="rtl">
          اختر ثيم الألوان 🎨
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="grid grid-cols-2 gap-2 p-2" dir="rtl">
          {themes.map((theme) => {
            const themeInfo = themeDefinitions[theme];
            const isActive = colorTheme === theme;
            
            return (
              <DropdownMenuItem
                key={theme}
                onClick={() => setColorTheme(theme)}
                className={`
                  flex flex-col items-start gap-2 p-3 cursor-pointer
                  rounded-lg border-2 transition-all
                  ${isActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-transparent hover:border-primary/30 hover:bg-accent'
                  }
                `}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{themeInfo.icon}</span>
                    <span className="font-semibold text-sm">
                      {themeInfo.nameAr}
                    </span>
                  </div>
                  {isActive && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                
                {/* Color Preview */}
                <div className="flex gap-1 w-full">
                  <div 
                    className="h-6 flex-1 rounded"
                    style={{ 
                      background: `hsl(${themeInfo.primary})` 
                    }}
                  />
                  <div 
                    className="h-6 flex-1 rounded"
                    style={{ 
                      background: `hsl(${themeInfo.secondary})` 
                    }}
                  />
                  <div 
                    className="h-6 flex-1 rounded"
                    style={{ 
                      background: `hsl(${themeInfo.accent})` 
                    }}
                  />
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {themeInfo.descriptionAr}
                </p>
              </DropdownMenuItem>
            );
          })}
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-2 text-xs text-center text-muted-foreground">
          اختر الثيم المفضل لديك من بين 8 تصاميم مختلفة
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
