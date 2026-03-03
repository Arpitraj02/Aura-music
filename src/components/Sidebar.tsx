import React from 'react';
import { Home, Compass, Library, Plus, Heart, Music2, MoreVertical, User } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: 'home' | 'profile';
  setActiveTab: (tab: 'home' | 'profile') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { icon: Home, label: 'Home', id: 'home' },
    { icon: Compass, label: 'Explore', id: 'explore' },
    { icon: Library, label: 'Library', id: 'library' },
  ];

  const playlists = [
    'Chill Vibes',
    'Morning Coffee',
    'Focus Flow',
    'Workout Mix',
    'Late Night Jazz',
    'Techno Essentials',
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full glass border-r border-white/5 p-6 hidden md:flex">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-[var(--color-accent)] rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Music2 className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">Aura</span>
      </div>

      <nav className="space-y-8 flex-1 overflow-y-auto pr-2 no-scrollbar">
        <div className="space-y-1">
          {menuItems.map((item, i) => (
            <motion.button
              key={`${item.label}-${i}`}
              whileHover={{ x: 4 }}
              onClick={() => {
                if (item.id === 'home') setActiveTab('home');
              }}
              className={`flex items-center gap-4 w-full px-3 py-2.5 rounded-lg transition-colors ${
                (item.id === 'home' && activeTab === 'home') ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-4 w-full px-3 py-2.5 rounded-lg transition-colors ${
              activeTab === 'profile' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <User size={20} />
            <span className="font-medium">Profile</span>
          </motion.button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs font-bold uppercase tracking-widest text-white/30">Playlists</span>
            <button className="p-1 rounded-full hover:bg-white/10 transition-colors">
              <Plus size={16} className="text-white/30 hover:text-white cursor-pointer" />
            </button>
          </div>
          <div className="space-y-1">
            <button className="flex items-center gap-4 w-full px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded flex items-center justify-center">
                <Heart size={16} className="text-white" />
              </div>
              <span className="font-medium text-sm flex-1 text-left">Liked Songs</span>
            </button>
            {playlists.map((playlist, i) => (
              <div key={`${playlist}-${i}`} className="flex items-center group">
                <button className="flex-1 text-left px-3 py-2 text-sm text-white/50 hover:text-white transition-colors truncate">
                  {playlist}
                </button>
                <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white">
                  <MoreVertical size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};
