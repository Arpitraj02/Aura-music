import React from 'react';
import {
  Play, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Maximize2,
  Pause, MoreHorizontal, Heart, MessageSquare, ChevronDown, ListMusic,
  Share2, Clock, Mic2, Cast, Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../contexts/MusicContext.js';
import { getDownloadUrl } from '../api/client.js';

interface PlayerProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const Player: React.FC<PlayerProps> = ({ isExpanded, setIsExpanded }) => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    skipNext,
    skipPrev,
    seek,
    setVolume,
    isAutoplay,
    toggleAutoplay,
  } = useMusic();

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(1, fraction)));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value) / 100);
  };

  const thumbnail = currentTrack?.thumbnail ?? 'https://picsum.photos/seed/music/600/600';
  const title = currentTrack?.title ?? 'Nothing playing';
  const artist = currentTrack?.artist ?? '–';
  const elapsed = formatTime(progress * duration);
  const total = formatTime(duration);

  return (
    <AnimatePresence>
      <motion.div
        drag={window.innerWidth < 768 ? 'y' : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        animate={{
          height: isExpanded ? '100%' : (window.innerWidth < 768 ? '64px' : '96px'),
          bottom: isExpanded ? 0 : (window.innerWidth < 768 ? '72px' : '0px'),
          borderRadius: isExpanded ? '0px' : (window.innerWidth < 768 ? '12px' : '0px'),
          margin: isExpanded ? '0px' : (window.innerWidth < 768 ? '8px' : '0px'),
          width: isExpanded ? '100%' : (window.innerWidth < 768 ? 'calc(100% - 16px)' : '100%'),
          left: isExpanded ? 0 : (window.innerWidth < 768 ? '8px' : '0px'),
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={`fixed z-[100] bg-[var(--color-bg)]/95 backdrop-blur-3xl border-t border-white/5 overflow-hidden flex flex-col shadow-2xl ${
          isExpanded ? 'p-6 md:p-8' : 'px-4 md:px-6'
        }`}
      >
        {isExpanded && <div className="atmosphere opacity-40" />}

        {/* FULL PLAYER */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full w-full max-w-lg mx-auto"
          >
            <header className="flex items-center justify-between mb-6">
              <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ChevronDown size={28} />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Now Playing</span>
                <span className="text-sm font-bold truncate max-w-[150px]">{artist}</span>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <MoreHorizontal size={24} />
              </button>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-4">
              <motion.div
                layoutId="album-art"
                className="w-full aspect-square max-w-[320px] md:max-w-sm rounded-2xl overflow-hidden shadow-2xl shadow-[var(--color-accent)]/20"
              >
                <img src={thumbnail} alt="Album Art" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </motion.div>
            </div>

            <div className="w-full space-y-6 md:space-y-8 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight truncate">{title}</h2>
                  <p className="text-lg text-white/60 truncate">{artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-white/40 hover:text-white transition-colors">
                    <Cast size={20} />
                  </button>
                  <button className="p-2 text-white/40 hover:text-rose-500 transition-colors">
                    <Heart size={28} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div
                  role="slider"
                  aria-label="seek"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                  className="w-full h-1.5 bg-white/10 rounded-full relative group cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div className="absolute top-0 left-0 h-full bg-white rounded-full" style={{ width: `${progress * 100}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" style={{ left: `calc(${progress * 100}% - 8px)` }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/40">
                  <span>{elapsed}</span>
                  <span>{total}</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between px-2">
                <button className="p-2 text-white/40 hover:text-white transition-colors">
                  <Shuffle size={22} />
                </button>
                <div className="flex items-center gap-6 md:gap-10">
                  <button onClick={skipPrev} className="p-2 text-white hover:scale-110 transition-transform">
                    <SkipBack size={36} fill="white" />
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
                  </motion.button>
                  <button onClick={skipNext} className="p-2 text-white hover:scale-110 transition-transform">
                    <SkipForward size={36} fill="white" />
                  </button>
                </div>
                <button
                  onClick={toggleAutoplay}
                  className={`p-2 transition-colors ${isAutoplay ? 'text-[var(--color-accent)]' : 'text-white/40'}`}
                  title={isAutoplay ? 'Autoplay on' : 'Autoplay off'}
                >
                  <Repeat size={22} />
                </button>
              </div>

              {/* Advanced Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors">
                  <Clock size={16} className="text-[var(--color-accent)]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Sleep Timer</span>
                </button>
                <div className="flex items-center gap-4">
                  <button className="p-2 text-white/40 hover:text-white transition-colors flex flex-col items-center gap-1">
                    <Mic2 size={18} />
                    <span className="text-[8px] font-bold uppercase">Lyrics</span>
                  </button>
                  <button className="p-2 text-white/40 hover:text-white transition-colors flex flex-col items-center gap-1">
                    <ListMusic size={18} />
                    <span className="text-[8px] font-bold uppercase">Queue</span>
                  </button>
                  {currentTrack && (
                    <a
                      href={getDownloadUrl(currentTrack.videoId)}
                      download
                      className="p-2 text-white/40 hover:text-white transition-colors flex flex-col items-center gap-1"
                    >
                      <Download size={18} />
                      <span className="text-[8px] font-bold uppercase">Save</span>
                    </a>
                  )}
                  <button className="p-2 text-white/40 hover:text-white transition-colors flex flex-col items-center gap-1">
                    <Share2 size={18} />
                    <span className="text-[8px] font-bold uppercase">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MINI / DESKTOP PLAYER */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full w-full relative"
            onClick={() => { if (window.innerWidth < 768) setIsExpanded(true); }}
          >
            <div className="md:hidden absolute top-0 left-0 right-0 h-0.5 bg-white/10">
              <div className="h-full bg-white" style={{ width: `${progress * 100}%` }} />
            </div>

            <div className="flex items-center justify-between flex-1 px-1">
              {/* Current Track */}
              <div className="flex items-center gap-3 md:gap-4 w-1/2 md:w-1/3 min-w-0">
                <motion.div layoutId="album-art" className="rounded-lg overflow-hidden shadow-lg bg-white/5 flex-shrink-0 w-10 h-10 md:w-14 md:h-14">
                  <img src={thumbnail} alt="Album Art" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </motion.div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm hover:underline cursor-pointer truncate">{title}</span>
                  <span className="text-xs text-white/50 hover:underline cursor-pointer truncate">{artist}</span>
                </div>
                <button className="text-white/40 hover:text-rose-500 transition-colors ml-2 hidden sm:block">
                  <Heart size={18} />
                </button>
              </div>

              {/* Desktop Controls */}
              <div className="hidden md:flex flex-col items-center gap-2 flex-1 max-w-xl">
                <div className="flex items-center gap-6">
                  <Shuffle size={16} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                  <button onClick={skipPrev}>
                    <SkipBack size={20} className="text-white/80 hover:text-white cursor-pointer transition-colors" />
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </motion.button>
                  <button onClick={skipNext}>
                    <SkipForward size={20} className="text-white/80 hover:text-white cursor-pointer transition-colors" />
                  </button>
                  <button onClick={toggleAutoplay}>
                    <Repeat size={16} className={`cursor-pointer transition-colors ${isAutoplay ? 'text-[var(--color-accent)]' : 'text-white/40 hover:text-white'}`} />
                  </button>
                </div>
                <div
                  role="slider"
                  aria-label="seek"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                  className="w-full flex items-center gap-3 cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <span className="text-[10px] text-white/40 font-mono">{elapsed}</span>
                  <div className="flex-1 h-1 bg-white/10 rounded-full relative group">
                    <div className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-[var(--color-accent)] transition-colors" style={{ width: `${progress * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">{total}</span>
                </div>
              </div>

              {/* Volume & Extras */}
              <div className="flex items-center justify-end gap-2 md:gap-4 w-1/2 md:w-1/3">
                <div className="md:hidden flex items-center gap-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg"
                  >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </motion.button>
                  <button onClick={(e) => { e.stopPropagation(); skipNext(); }} className="p-1 text-white/80">
                    <SkipForward size={22} fill="currentColor" />
                  </button>
                </div>

                <div className="hidden md:flex items-center gap-4">
                  {currentTrack && (
                    <a href={getDownloadUrl(currentTrack.videoId)} download onClick={(e) => e.stopPropagation()}>
                      <Download size={16} className="text-white/60 hover:text-white cursor-pointer" />
                    </a>
                  )}
                  <MessageSquare size={16} className="text-white/60 hover:text-white cursor-pointer hidden lg:block" />
                  <Volume2 size={16} className="text-white/60 hover:text-white cursor-pointer" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(volume * 100)}
                    onChange={handleVolumeChange}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 accent-white cursor-pointer"
                  />
                  <Maximize2
                    size={16}
                    className="text-white/60 hover:text-white cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
