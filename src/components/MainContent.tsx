import React, { useState, useEffect } from 'react';
import { TrackCard } from './TrackCard';
import { Bell, User, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Profile } from './Profile';
import { useUser } from '../contexts/UserContext';

interface MainContentProps {
  activeTab: 'home' | 'profile';
}

export const MainContent: React.FC<MainContentProps> = ({ activeTab }) => {
  const [loading, setLoading] = useState(true);
  const { userData } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (activeTab === 'profile') {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative no-scrollbar">
        <Profile />
      </main>
    );
  }

  const sections = [
    {
      title: 'Listen Again',
      type: 'album',
      tracks: [
        { title: 'Starboy', artist: 'The Weeknd', image: 'https://picsum.photos/seed/starboy/400/400' },
        { title: 'Blinding Lights', artist: 'The Weeknd', image: 'https://picsum.photos/seed/blinding/400/400' },
        { title: 'Levitating', artist: 'Dua Lipa', image: 'https://picsum.photos/seed/levitating/400/400' },
        { title: 'Save Your Tears', artist: 'The Weeknd', image: 'https://picsum.photos/seed/tears/400/400' },
        { title: 'After Hours', artist: 'The Weeknd', image: 'https://picsum.photos/seed/after/400/400' },
        { title: 'One Kiss', artist: 'Dua Lipa', image: 'https://picsum.photos/seed/kiss/400/400' },
      ]
    },
    {
      title: 'Your Favorites',
      type: 'artist',
      tracks: [
        { title: 'The Weeknd', artist: 'Artist', image: 'https://picsum.photos/seed/wknd/400/400' },
        { title: 'Dua Lipa', artist: 'Artist', image: 'https://picsum.photos/seed/dua/400/400' },
        { title: 'Post Malone', artist: 'Artist', image: 'https://picsum.photos/seed/post/400/400' },
        { title: 'Drake', artist: 'Artist', image: 'https://picsum.photos/seed/drake/400/400' },
        { title: 'Taylor Swift', artist: 'Artist', image: 'https://picsum.photos/seed/taylor/400/400' },
        { title: 'Ed Sheeran', artist: 'Artist', image: 'https://picsum.photos/seed/ed/400/400' },
      ]
    },
    {
      title: 'New Releases',
      type: 'album',
      tracks: [
        { title: 'Daily Mix 1', artist: 'Based on your recent listening', image: 'https://picsum.photos/seed/mix1/400/400' },
        { title: 'Daily Mix 2', artist: 'Based on your recent listening', image: 'https://picsum.photos/seed/mix2/400/400' },
        { title: 'Discover Weekly', artist: 'Your weekly mixtape', image: 'https://picsum.photos/seed/weekly/400/400' },
        { title: 'Release Radar', artist: 'New music from artists you follow', image: 'https://picsum.photos/seed/radar/400/400' },
        { title: 'Fresh Finds', artist: 'New artists to discover', image: 'https://picsum.photos/seed/fresh/400/400' },
      ]
    }
  ];

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 relative no-scrollbar">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 md:mb-10 sticky top-0 z-40 bg-[var(--color-bg)]/60 backdrop-blur-xl -mx-4 md:-mx-8 px-4 md:px-8 py-3 md:py-4 border-b border-white/5">
        <div className="flex items-center gap-4 md:gap-6 flex-1 max-w-2xl">
          <div className="hidden sm:flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search songs, albums..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs md:text-sm focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 ml-4">
          <button className="w-8 h-8 md:w-10 md:h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
            <Bell size={18} className="text-white/70" />
          </button>
          <button className="flex items-center gap-2 pl-1 pr-3 md:pr-4 py-1 rounded-full glass hover:bg-white/10 transition-colors">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 flex items-center justify-center overflow-hidden">
              {userData.avatar ? (
                <img src={userData.avatar} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User size={14} className="text-white" />
              )}
            </div>
            <span className="text-xs md:text-sm font-medium hidden xs:block">{userData.name.split(' ')[0]}</span>
          </button>
        </div>
      </header>

      {/* Moods Filter Bar */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
        {['Relax', 'Workout', 'Focus', 'Energize', 'Commute', 'Party', 'Sleep', 'Romance'].map((mood, i) => (
          <button 
            key={`${mood}-${i}`}
            className="px-4 py-2 rounded-lg glass border border-white/10 text-sm font-semibold whitespace-nowrap hover:bg-white/10 transition-colors"
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <section className="mb-8 md:mb-12">
        <div className="relative h-48 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/hero/1200/600" 
            alt="Hero" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-black/20 to-transparent" />
          <div className="absolute bottom-4 md:bottom-10 left-4 md:left-10 max-w-lg">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-orange-500 mb-1 md:mb-2 block">Featured Playlist</span>
            <h1 className="text-3xl md:text-6xl font-black mb-2 md:mb-4 tracking-tighter">Midnight Vibes</h1>
            <p className="text-white/60 text-xs md:text-lg mb-4 md:mb-6 line-clamp-2 hidden sm:block">The perfect blend of lo-fi, chillhop, and atmospheric beats to keep you company through the night.</p>
            <div className="flex items-center gap-2 md:gap-4">
              <button className="px-4 md:px-8 py-2 md:py-3 bg-white text-black rounded-full text-xs md:text-base font-bold hover:scale-105 transition-transform">Play</button>
              <button className="px-4 md:px-8 py-2 md:py-3 glass rounded-full text-xs md:text-base font-bold hover:bg-white/10 transition-colors">Save</button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="space-y-12 pb-12">
        {sections.map((section, idx) => (
          <section key={`${section.title}-${idx}`} className="relative">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-3 md:gap-4">
                {section.type === 'artist' && (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/10">
                    <img src={section.tracks[0].image} alt="Artist" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-0.5 md:mb-1">More of what you like</span>
                  <h2 className="text-xl md:text-3xl font-black tracking-tighter">{section.title}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-white/10 text-[10px] md:text-xs font-bold hover:bg-white/5 transition-colors">Play all</button>
              </div>
            </div>
            
            {/* Horizontal Scroll Container */}
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide no-scrollbar">
              {loading 
                ? Array(6).fill(0).map((_, i) => <TrackCard key={`loading-${i}`} loading title="" artist="" image="" type={section.type as any} />)
                : section.tracks.map((track, i) => (
                    <TrackCard 
                      key={`${track.title}-${i}`} 
                      title={track.title} 
                      artist={track.artist} 
                      image={track.image} 
                      type={section.type as any}
                    />
                  ))
              }
            </div>
          </section>
        ))}
      </div>
      
      {/* Spacer for player and nav */}
      <div className="h-40 md:h-24" />
    </main>
  );
};
