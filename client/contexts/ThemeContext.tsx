import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

// Color Theme types
export type ColorTheme = 
  | 'purple-orange'  // Default (current)
  | 'blue-cyan'      // Ocean Blue
  | 'green-teal'     // Nature Green
  | 'pink-purple'    // Candy Pink
  | 'red-orange'     // Fire Red
  | 'indigo-blue'    // Deep Indigo
  | 'emerald-lime'   // Fresh Emerald
  | 'rose-pink';     // Romantic Rose

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (theme: ColorTheme) => void;
  toggleTheme: () => void;
}

// Theme definitions with HSL values
export const themeDefinitions: Record<ColorTheme, {
  name: string;
  nameAr: string;
  primary: string;
  primaryStart: string;
  primaryEnd: string;
  secondary: string;
  secondaryStart: string;
  secondaryEnd: string;
  accent: string;
  description: string;
  descriptionAr: string;
  icon: string;
}> = {
  'purple-orange': {
    name: 'Purple & Orange',
    nameAr: 'بنفسجي وبرتقالي',
    primary: '270 95% 60%',
    primaryStart: '260 100% 65%',
    primaryEnd: '280 90% 55%',
    secondary: '25 95% 58%',
    secondaryStart: '20 100% 60%',
    secondaryEnd: '35 95% 55%',
    accent: '190 95% 55%',
    description: 'Vibrant and energetic',
    descriptionAr: 'نابض بالحياة والطاقة',
    icon: '🟣'
  },
  'blue-cyan': {
    name: 'Blue & Cyan',
    nameAr: 'أزرق وسماوي',
    primary: '210 100% 60%',
    primaryStart: '200 100% 65%',
    primaryEnd: '220 95% 55%',
    secondary: '185 100% 50%',
    secondaryStart: '175 100% 55%',
    secondaryEnd: '195 95% 45%',
    accent: '160 90% 50%',
    description: 'Cool and professional',
    descriptionAr: 'بارد واحترافي',
    icon: '🔵'
  },
  'green-teal': {
    name: 'Green & Teal',
    nameAr: 'أخضر وفيروزي',
    primary: '145 85% 50%',
    primaryStart: '135 90% 55%',
    primaryEnd: '155 80% 45%',
    secondary: '170 100% 45%',
    secondaryStart: '160 100% 50%',
    secondaryEnd: '180 95% 40%',
    accent: '195 85% 50%',
    description: 'Fresh and natural',
    descriptionAr: 'منعش وطبيعي',
    icon: '🟢'
  },
  'pink-purple': {
    name: 'Pink & Purple',
    nameAr: 'وردي وبنفسجي',
    primary: '330 85% 60%',
    primaryStart: '320 90% 65%',
    primaryEnd: '340 80% 55%',
    secondary: '280 85% 60%',
    secondaryStart: '270 90% 65%',
    secondaryEnd: '290 80% 55%',
    accent: '200 90% 60%',
    description: 'Sweet and playful',
    descriptionAr: 'حلو ومرح',
    icon: '🩷'
  },
  'red-orange': {
    name: 'Red & Orange',
    nameAr: 'أحمر وبرتقالي',
    primary: '0 85% 60%',
    primaryStart: '350 90% 65%',
    primaryEnd: '10 80% 55%',
    secondary: '30 100% 55%',
    secondaryStart: '20 100% 60%',
    secondaryEnd: '40 95% 50%',
    accent: '45 100% 55%',
    description: 'Bold and passionate',
    descriptionAr: 'جريء وعاطفي',
    icon: '🔴'
  },
  'indigo-blue': {
    name: 'Indigo & Blue',
    nameAr: 'نيلي وأزرق',
    primary: '240 85% 55%',
    primaryStart: '230 90% 60%',
    primaryEnd: '250 80% 50%',
    secondary: '210 90% 60%',
    secondaryStart: '200 95% 65%',
    secondaryEnd: '220 85% 55%',
    accent: '180 85% 55%',
    description: 'Deep and trustworthy',
    descriptionAr: 'عميق وموثوق',
    icon: '🔷'
  },
  'emerald-lime': {
    name: 'Emerald & Lime',
    nameAr: 'زمردي وليموني',
    primary: '150 90% 45%',
    primaryStart: '140 95% 50%',
    primaryEnd: '160 85% 40%',
    secondary: '80 90% 50%',
    secondaryStart: '70 95% 55%',
    secondaryEnd: '90 85% 45%',
    accent: '50 100% 55%',
    description: 'Bright and lively',
    descriptionAr: 'مشرق وحيوي',
    icon: '💚'
  },
  'rose-pink': {
    name: 'Rose & Pink',
    nameAr: 'وردي فاتح',
    primary: '340 90% 65%',
    primaryStart: '330 95% 70%',
    primaryEnd: '350 85% 60%',
    secondary: '0 85% 70%',
    secondaryStart: '350 90% 75%',
    secondaryEnd: '10 80% 65%',
    accent: '30 90% 60%',
    description: 'Romantic and elegant',
    descriptionAr: 'رومانسي وأنيق',
    icon: '🌸'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('egygo-theme') as Theme;
    return stored || 'system';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem('egygo-color-theme');
    return (stored as ColorTheme) || 'purple-orange';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const getSystemTheme = (): 'light' | 'dark' => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = () => {
      const themeToApply = theme === 'system' ? getSystemTheme() : theme;
      
      root.classList.remove('light', 'dark');
      root.classList.add(themeToApply);
      setActualTheme(themeToApply);
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply color theme colors to CSS variables
  useEffect(() => {
    const themeColors = themeDefinitions[colorTheme];
    const root = document.documentElement;
    
    // Set primary colors
    root.style.setProperty('--primary', themeColors.primary);
    root.style.setProperty('--primary-start', themeColors.primaryStart);
    root.style.setProperty('--primary-end', themeColors.primaryEnd);
    root.style.setProperty('--primary-light', themeColors.primary);
    root.style.setProperty('--primary-dark', themeColors.primaryEnd);
    
    // Set secondary colors
    root.style.setProperty('--secondary', themeColors.secondary);
    root.style.setProperty('--secondary-start', themeColors.secondaryStart);
    root.style.setProperty('--secondary-end', themeColors.secondaryEnd);
    root.style.setProperty('--secondary-light', themeColors.secondary);
    
    // Set accent
    root.style.setProperty('--accent-cyan', themeColors.accent);
    
    // Save to localStorage
    localStorage.setItem('egygo-color-theme', colorTheme);
  }, [colorTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('egygo-theme', newTheme);
  };

  const setColorTheme = (newColorTheme: ColorTheme) => {
    setColorThemeState(newColorTheme);
  };

  const toggleTheme = () => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      actualTheme, 
      colorTheme, 
      setTheme, 
      setColorTheme, 
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
