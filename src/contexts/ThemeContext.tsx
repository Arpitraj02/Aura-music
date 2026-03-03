import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AccentColor = 'orange' | 'purple' | 'emerald';

interface ThemeSettings {
  darkMode: boolean;
  accentColor: AccentColor;
  glassIntensity: number; // 0 to 100
}

interface ThemeContextType {
  theme: ThemeSettings;
  toggleDarkMode: () => void;
  setAccentColor: (color: AccentColor) => void;
  setGlassIntensity: (intensity: number) => void;
}

const defaultTheme: ThemeSettings = {
  darkMode: true,
  accentColor: 'orange',
  glassIntensity: 60,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);

  const toggleDarkMode = () => {
    setTheme((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const setAccentColor = (color: AccentColor) => {
    setTheme((prev) => ({ ...prev, accentColor: color }));
  };

  const setGlassIntensity = (intensity: number) => {
    setTheme((prev) => ({ ...prev, glassIntensity: intensity }));
  };

  useEffect(() => {
    // Apply theme settings to the document root
    const root = document.documentElement;
    if (theme.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set CSS variables for accent color
    const colors = {
      orange: '#f97316',
      purple: '#a855f7',
      emerald: '#10b981',
    };
    root.style.setProperty('--accent-color', colors[theme.accentColor]);
    root.style.setProperty('--glass-intensity', `${theme.glassIntensity / 100}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleDarkMode, setAccentColor, setGlassIntensity }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
