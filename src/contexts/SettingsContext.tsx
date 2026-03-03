import React, { createContext, useContext, useState, useEffect } from 'react';

type AccentColor = 'orange' | 'purple' | 'emerald' | 'blue' | 'rose';

interface SettingsContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  glassIntensity: number;
  setGlassIntensity: (intensity: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState<AccentColor>('orange');
  const [glassIntensity, setGlassIntensity] = useState(0.1);

  // Apply settings to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Accent colors mapping
    const colors = {
      orange: { primary: '#f97316', secondary: 'rgba(249, 115, 22, 0.1)' },
      purple: { primary: '#a855f7', secondary: 'rgba(168, 85, 247, 0.1)' },
      emerald: { primary: '#10b981', secondary: 'rgba(16, 185, 129, 0.1)' },
      blue: { primary: '#3b82f6', secondary: 'rgba(59, 130, 246, 0.1)' },
      rose: { primary: '#f43f5e', secondary: 'rgba(244, 63, 94, 0.1)' },
    };

    const selected = colors[accentColor];
    root.style.setProperty('--accent-primary', selected.primary);
    root.style.setProperty('--accent-secondary', selected.secondary);
    root.style.setProperty('--glass-intensity', glassIntensity.toString());
    
    if (darkMode) {
      root.classList.add('dark');
      root.style.setProperty('--bg-color', '#0a0a0a');
      root.style.setProperty('--text-color', '#ffffff');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-color', '#f5f5f5');
      root.style.setProperty('--text-color', '#1a1a1a');
    }
  }, [darkMode, accentColor, glassIntensity]);

  return (
    <SettingsContext.Provider value={{ 
      darkMode, setDarkMode, 
      accentColor, setAccentColor, 
      glassIntensity, setGlassIntensity 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
