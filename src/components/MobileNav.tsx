import React from 'react';
import { Home, Compass, Library, Search, User } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileNavProps {
  activeTab: 'home' | 'profile';
  setActiveTab: (tab: 'home' | 'profile') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { icon: Home, label: 'Home', id: 'home' },
    { icon: Compass, label: 'Explore', id: 'explore' },
    { icon: Library, label: 'Library', id: 'library' },
    { icon: Search, label: 'Search', id: 'search' },
    { icon: User, label: 'Profile', id: 'profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 h-16 flex items-center justify-around px-4 z-[60] pb-safe bg-[var(--color-bg)]/80 backdrop-blur-xl">
      {items.map((item, i) => (
        <motion.button
          key={`${item.label}-${i}`}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (item.id === 'home' || item.id === 'profile') {
              setActiveTab(item.id);
            }
          }}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === item.id ? 'text-white' : 'text-white/40'
          }`}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
        </motion.button>
      ))}
    </nav>
  );
};
