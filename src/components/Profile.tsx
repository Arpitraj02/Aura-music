import React, { useRef } from 'react';
import { User, Settings, Moon, Sun, Palette, Bell, Shield, LogOut, ChevronRight, Camera, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

export const Profile: React.FC = () => {
  const { userData, updateUser } = useUser();
  const { theme, toggleDarkMode, setAccentColor, setGlassIntensity } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditName = () => {
    const newName = prompt('Enter your name:', userData.name);
    if (newName && newName.trim()) {
      updateUser({ name: newName.trim() });
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      alert('Logged out successfully!');
      // In a real app, you'd clear session/tokens and redirect
    }
  };

  return (
    <div className="pb-32 pt-8 px-6 max-w-2xl mx-auto space-y-8">
      {/* User Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-500/50 p-1 transition-all group-hover:border-orange-500">
            <img 
              src={userData.avatar} 
              alt="User Avatar" 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <button 
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Camera size={16} className="text-white" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 group">
            <h1 className="text-2xl font-black tracking-tight">{userData.name}</h1>
            <button 
              onClick={handleEditName}
              className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-orange-500"
            >
              <Edit2 size={16} />
            </button>
          </div>
          <p className="text-white/50 text-sm">{userData.membership} • Since {userData.since}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5">
        <div className="text-center">
          <div className="text-xl font-bold">{userData.stats.playlists}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">Playlists</div>
        </div>
        <div className="text-center border-x border-white/5">
          <div className="text-xl font-bold">{userData.stats.followers}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{userData.stats.following}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">Following</div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 px-2">UI Customization</h3>
          <div className="bg-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
            {/* Dark Mode */}
            <div 
              onClick={toggleDarkMode}
              className="flex items-center justify-between p-4 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme.darkMode ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {theme.darkMode ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${theme.darkMode ? 'bg-orange-500' : 'bg-white/20'}`}>
                <motion.div 
                  animate={{ x: theme.darkMode ? 20 : 4 }}
                  className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                  <Palette size={18} />
                </div>
                <span className="text-sm font-medium">Accent Color</span>
              </div>
              <div className="flex gap-3 pl-11">
                {(['orange', 'purple', 'emerald'] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      theme.accentColor === color 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0502] scale-110' 
                        : 'opacity-50 hover:opacity-100'
                    } ${
                      color === 'orange' ? 'bg-orange-500' : 
                      color === 'purple' ? 'bg-purple-500' : 'bg-emerald-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Glassmorphism */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Sun size={18} />
                  </div>
                  <span className="text-sm font-medium">Glassmorphism Intensity</span>
                </div>
                <span className="text-xs font-mono text-white/40">{theme.glassIntensity}%</span>
              </div>
              <div className="pl-11 pr-4">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={theme.glassIntensity}
                  onChange={(e) => setGlassIntensity(parseInt(e.target.value))}
                  className="w-full accent-orange-500 bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 px-2">Account & Security</h3>
          <div className="bg-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
            {[
              { icon: User, label: 'Personal Information', color: 'text-white/60' },
              { icon: Bell, label: 'Notifications', color: 'text-white/60' },
              { icon: Shield, label: 'Privacy & Security', color: 'text-white/60' },
            ].map((item, i) => (
              <div 
                key={i}
                onClick={() => alert(`${item.label} settings coming soon!`)}
                className="flex items-center justify-between p-4 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
        </section>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 text-rose-500 font-bold hover:bg-rose-500/10 rounded-2xl transition-colors"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};
