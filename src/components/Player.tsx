import React, { useState } from 'react';
import { Play, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Maximize2, Pause, MoreHorizontal, Heart, MessageSquare, ChevronDown, ListMusic, Share2, Clock, Mic2, Cast, Download } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';

interface PlayerProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export const Player: React.FC<PlayerProps> = ({ isExpanded, setIsExpanded }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const dragY = useMotionValue(0);
  
  // Opacity of full player content based on drag position
  const fullPlayerOpacity = useTransform(dragY, [-300, 0], [1, 0]);
  const miniPlayerOpacity = useTransform(dragY, [-100, 0], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    // If dragged up significantly or high velocity up
    if (info.offset.y < -100 || info.velocity.y < -500) {
      setIsExpanded(true);
    } 
    // If dragged down significantly or high velocity down
    else if (info.offset.y > 100 || info.velocity.y > 500) {
      setIsExpanded(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Mobile Draggable Player Container */}
      <motion.div
        drag={window.innerWidth < 768 ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ y: dragY }}
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
        {/* Atmosphere background only visible when expanded */}
        {isExpanded && <div className="atmosphere opacity-40" />}

        {/* --- FULL PLAYER VIEW --- */}
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full w-full max-w-lg mx-auto"
          >
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
              <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ChevronDown size={28} />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Playing from</span>
                <span className="text-sm font-bold truncate max-w-[150px]">Midnight Vibes</span>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <MoreHorizontal size={24} />
              </button>
            </header>

            {/* Album Art */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-4">
              <motion.div 
                layoutId="album-art"
                className="w-full aspect-square max-w-[320px] md:max-w-sm rounded-2xl overflow-hidden shadow-2xl shadow-[var(--color-accent)]/20"
              >
                <img 
                  src="https://picsum.photos/seed/music/600/600" 
                  alt="Album Art" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            {/* Track Info & Main Controls */}
            <div className="w-full space-y-6 md:space-y-8 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight truncate">Midnight City</h2>
                  <p className="text-lg text-white/60 truncate">M83</p>
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
                <div className="w-full h-1.5 bg-white/10 rounded-full relative group cursor-pointer">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-white rounded-full" />
                  <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/40">
                  <span>2:14</span>
                  <span>4:03</span>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between px-2">
                <button className="p-2 text-white/40 hover:text-white transition-colors">
                  <Shuffle size={22} />
                </button>
                <div className="flex items-center gap-6 md:gap-10">
                  <button className="p-2 text-white hover:scale-110 transition-transform">
                    <SkipBack size={36} fill="white" />
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
                  </motion.button>
                  <button className="p-2 text-white hover:scale-110 transition-transform">
                    <SkipForward size={36} fill="white" />
                  </button>
                </div>
                <button className="p-2 text-white/40 hover:text-white transition-colors">
                  <Repeat size={22} />
                </button>
              </div>

              {/* Advanced Controls Row */}
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
                  <button className="p-2 text-white/40 hover:text-white transition-colors flex flex-col items-center gap-1">
                    <Download size={18} />
                    <span className="text-[8px] font-bold uppercase">Save</span>
                  </button>
                  <button className="p-2 text-white/40 hover:text-white transition-colors flex flex-col items-center gap-1">
                    <Share2 size={18} />
                    <span className="text-[8px] font-bold uppercase">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}


        {/* --- MINI PLAYER / DESKTOP VIEW --- */}
        {!isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full w-full relative"
            onClick={() => { if (window.innerWidth < 768) setIsExpanded(true); }}
          >
            {/* Mini Progress Bar (Mobile only) */}
            <div className="md:hidden absolute top-0 left-0 right-0 h-0.5 bg-white/10">
              <div className="h-full w-1/3 bg-white" />
            </div>

            <div className="flex items-center justify-between flex-1 px-1">
              {/* Current Track */}
              <div className="flex items-center gap-3 md:gap-4 w-1/2 md:w-1/3 min-w-0">
                <motion.div 
                  layoutId="album-art"
                  className="rounded-lg overflow-hidden shadow-lg bg-white/5 flex-shrink-0 w-10 h-10 md:w-14 h-14"
                >
                  <img 
                    src="https://picsum.photos/seed/music/200/200" 
                    alt="Album Art" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm hover:underline cursor-pointer truncate">Midnight City</span>
                  <span className="text-xs text-white/50 hover:underline cursor-pointer truncate">M83</span>
                </div>
                <button className="text-white/40 hover:text-rose-500 transition-colors ml-2 hidden sm:block">
                  <Heart size={18} />
                </button>
              </div>

              {/* Controls (Desktop) */}
              <div className="hidden md:flex flex-col items-center gap-2 flex-1 max-w-xl">
                <div className="flex items-center gap-6">
                  <Shuffle size={16} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                  <SkipBack size={20} className="text-white/80 hover:text-white cursor-pointer transition-colors" />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </motion.button>
                  <SkipForward size={20} className="text-white/80 hover:text-white cursor-pointer transition-colors" />
                  <Repeat size={16} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
                </div>
                <div className="w-full flex items-center gap-3">
                  <span className="text-[10px] text-white/40 font-mono">2:14</span>
                  <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer">
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-white rounded-full group-hover:bg-[var(--color-accent)] transition-colors" />
                    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">4:03</span>
                </div>
              </div>

              {/* Volume & Extras / Mobile Controls */}
              <div className="flex items-center justify-end gap-2 md:gap-4 w-1/2 md:w-1/3">
                <div className="md:hidden flex items-center gap-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg"
                  >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                  </motion.button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="p-1 text-white/80"
                  >
                    <SkipForward size={22} fill="currentColor" />
                  </button>
                </div>
                
                <div className="hidden md:flex items-center gap-4">
                  <Download size={16} className="text-white/60 hover:text-white cursor-pointer" />
                  <MessageSquare size={16} className="text-white/60 hover:text-white cursor-pointer hidden lg:block" />
                  <Volume2 size={16} className="text-white/60 hover:text-white cursor-pointer" />
                  <div className="w-20 h-1 bg-white/10 rounded-full relative group cursor-pointer">
                    <div className="absolute top-0 left-0 h-full w-2/3 bg-white/60 rounded-full group-hover:bg-white transition-colors" />
                  </div>
                  <Maximize2 size={16} className="text-white/60 hover:text-white cursor-pointer" />
                  <button className="text-white/60 hover:text-white cursor-pointer">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
