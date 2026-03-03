import React from 'react';
import { motion } from 'motion/react';
import { MoreHorizontal, Play } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const upNext = [
    { title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', image: 'https://picsum.photos/seed/blinding/100/100' },
    { title: 'Levitating', artist: 'Dua Lipa', duration: '3:23', image: 'https://picsum.photos/seed/levitating/100/100' },
    { title: 'Save Your Tears', artist: 'The Weeknd', duration: '3:35', image: 'https://picsum.photos/seed/tears/100/100' },
    { title: 'One Kiss', artist: 'Dua Lipa', duration: '3:34', image: 'https://picsum.photos/seed/kiss/100/100' },
    { title: 'After Hours', artist: 'The Weeknd', duration: '6:01', image: 'https://picsum.photos/seed/after/100/100' },
  ];

  return (
    <aside className="w-80 flex-shrink-0 flex flex-col h-full glass border-l border-white/5 p-6 hidden xl:flex">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Up Next</h2>
        <button className="text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Clear</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
        {upNext.map((track, i) => (
          <motion.div
            key={`${track.title}-${i}`}
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
              <img src={track.image} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={16} fill="white" className="text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold truncate group-hover:text-[var(--color-accent)] transition-colors">{track.title}</h4>
              <p className="text-xs text-white/50 truncate">{track.artist}</p>
            </div>
            <span className="text-xs text-white/30 font-mono">{track.duration}</span>
            <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white">
              <MoreHorizontal size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Lyrics</h2>
        </div>
        <p className="text-sm text-white/40 italic line-clamp-4">
          "I'm tryna put you in the worst mood, ah
          P1 cleaner than your church shoes, ah
          Milli point two just to hurt you, ah
          All red Lamb' just to tease you, ah..."
        </p>
        <button className="mt-2 text-xs font-bold text-[var(--color-accent)] hover:underline">Show more</button>
      </div>
    </aside>
  );
};
