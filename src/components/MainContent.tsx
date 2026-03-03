import React, { useState, useEffect, useCallback } from 'react';
import { TrackCard } from './TrackCard';
import { Bell, User, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { Profile } from './Profile';
import { useUser } from '../contexts/UserContext';
import { useMusic } from '../contexts/MusicContext';
import { searchTracks } from '../api/client';
import type { Track } from '../api/types';

interface MainContentProps {
  activeTab: 'home' | 'profile';
}

export const MainContent: React.FC<MainContentProps> = ({ activeTab }) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { userData } = useUser();
  const { play } = useMusic();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setSearchLoading(true);
      searchTracks(searchQuery)
        .then((tracks) => {
          setSearchResults(tracks);
          setSearchLoading(false);
        })
        .catch(() => setSearchLoading(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePlayTrack = useCallback((track: Track, queue: Track[]) => {
    play(track, queue);
  }, [play]);

  if (activeTab === 'profile') {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative no-scrollbar">
        <Profile />
      </main>
    );
  }

  const staticSections: Array<{ title: string; type: 'album' | 'artist'; tracks: Track[] }> = [
    {
      title: 'Listen Again',
      type: 'album',
      tracks: [
        { id: 'a', videoId: 'a', title: 'Starboy', artist: 'The Weeknd', duration: 230, thumbnail: 'https://picsum.photos/seed/starboy/400/400' },
        { id: 'b', videoId: 'b', title: 'Blinding Lights', artist: 'The Weeknd', duration: 200, thumbnail: 'https://picsum.photos/seed/blinding/400/400' },
        { id: 'c', videoId: 'c', title: 'Levitating', artist: 'Dua Lipa', duration: 203, thumbnail: 'https://picsum.photos/seed/levitating/400/400' },
        { id: 'd', videoId: 'd', title: 'Save Your Tears', artist: 'The Weeknd', duration: 215, thumbnail: 'https://picsum.photos/seed/tears/400/400' },
        { id: 'e', videoId: 'e', title: 'After Hours', artist: 'The Weeknd', duration: 361, thumbnail: 'https://picsum.photos/seed/after/400/400' },
        { id: 'f', videoId: 'f', title: 'One Kiss', artist: 'Dua Lipa', duration: 214, thumbnail: 'https://picsum.photos/seed/kiss/400/400' },
      ],
    },
    {
      title: 'Your Favorites',
      type: 'artist',
      tracks: [
        { id: 'g', videoId: 'g', title: 'The Weeknd', artist: 'Artist', duration: 0, thumbnail: 'https://picsum.photos/seed/wknd/400/400' },
        { id: 'h', videoId: 'h', title: 'Dua Lipa', artist: 'Artist', duration: 0, thumbnail: 'https://picsum.photos/seed/dua/400/400' },
        { id: 'i', videoId: 'i', title: 'Post Malone', artist: 'Artist', duration: 0, thumbnail: 'https://picsum.photos/seed/post/400/400' },
        { id: 'j', videoId: 'j', title: 'Drake', artist: 'Artist', duration: 0, thumbnail: 'https://picsum.photos/seed/drake/400/400' },
        { id: 'k', videoId: 'k', title: 'Taylor Swift', artist: 'Artist', duration: 0, thumbnail: 'https://picsum.photos/seed/taylor/400/400' },
        { id: 'l', videoId: 'l', title: 'Ed Sheeran', artist: 'Artist', duration: 0, thumbnail: 'https://picsum.photos/seed/ed/400/400' },
      ],
    },
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, artists..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-10 text-xs md:text-sm focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
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

      {/* Search Results */}
      {searchQuery.trim() && (
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-black tracking-tighter mb-4">
            {searchLoading ? 'Searching…' : `Results for "${searchQuery}"`}
          </h2>
          {searchLoading ? (
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar">
              {Array(6).fill(0).map((_, i) => (
                <TrackCard key={`sl-${i}`} loading title="" artist="" image="" type="album" />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar">
              {searchResults.map((track, i) => (
                <TrackCard
                  key={`${track.videoId}-${i}`}
                  title={track.title}
                  artist={track.artist}
                  image={track.thumbnail}
                  type="album"
                  onPlay={() => handlePlayTrack(track, searchResults.slice(i + 1))}
                />
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm">No results found.</p>
          )}
        </section>
      )}

      {/* Show home content when not searching */}
      {!searchQuery.trim() && (
        <>
          {/* Moods Filter Bar */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto no-scrollbar pb-2">
            {['Relax', 'Workout', 'Focus', 'Energize', 'Commute', 'Party', 'Sleep', 'Romance'].map((mood, i) => (
              <button
                key={`${mood}-${i}`}
                onClick={() => setSearchQuery(mood)}
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
                <p className="text-white/60 text-xs md:text-lg mb-4 md:mb-6 line-clamp-2 hidden sm:block">The perfect blend of lo-fi, chillhop, and atmospheric beats.</p>
                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={() => setSearchQuery('midnight lo-fi chill')}
                    className="px-4 md:px-8 py-2 md:py-3 bg-white text-black rounded-full text-xs md:text-base font-bold hover:scale-105 transition-transform"
                  >
                    Play
                  </button>
                  <button className="px-4 md:px-8 py-2 md:py-3 glass rounded-full text-xs md:text-base font-bold hover:bg-white/10 transition-colors">Save</button>
                </div>
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="space-y-12 pb-12">
            {staticSections.map((section, idx) => (
              <section key={`${section.title}-${idx}`} className="relative">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    {section.type === 'artist' && (
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/10">
                        <img src={section.tracks[0].thumbnail} alt="Artist" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-0.5 md:mb-1">More of what you like</span>
                      <h2 className="text-xl md:text-3xl font-black tracking-tighter">{section.title}</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (section.tracks.length > 0) {
                        play(section.tracks[0], section.tracks.slice(1));
                      }
                    }}
                    className="px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-white/10 text-[10px] md:text-xs font-bold hover:bg-white/5 transition-colors"
                  >
                    Play all
                  </button>
                </div>

                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide no-scrollbar">
                  {loading
                    ? Array(6).fill(0).map((_, i) => <TrackCard key={`loading-${i}`} loading title="" artist="" image="" type={section.type} />)
                    : section.tracks.map((track, i) => (
                        <TrackCard
                          key={`${track.title}-${i}`}
                          title={track.title}
                          artist={track.artist}
                          image={track.thumbnail}
                          type={section.type}
                          onPlay={() => handlePlayTrack(track, section.tracks.slice(i + 1))}
                        />
                      ))
                  }
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {/* Spacer for player and nav */}
      <div className="h-40 md:h-24" />
    </main>
  );
};
