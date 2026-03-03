import React from 'react';
import { motion } from 'motion/react';
import { MoreHorizontal, Play } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const PLACEHOLDER_QUEUE = [
  { videoId: '', title: 'Blinding Lights', artist: 'The Weeknd', duration: 200, thumbnail: 'https://picsum.photos/seed/blinding/100/100', id: '1' },
  { videoId: '', title: 'Levitating', artist: 'Dua Lipa', duration: 203, thumbnail: 'https://picsum.photos/seed/levitating/100/100', id: '2' },
  { videoId: '', title: 'Save Your Tears', artist: 'The Weeknd', duration: 215, thumbnail: 'https://picsum.photos/seed/tears/100/100', id: '3' },
  { videoId: '', title: 'One Kiss', artist: 'Dua Lipa', duration: 214, thumbnail: 'https://picsum.photos/seed/kiss/100/100', id: '4' },
  { videoId: '', title: 'After Hours', artist: 'The Weeknd', duration: 361, thumbnail: 'https://picsum.photos/seed/after/100/100', id: '5' },
];

export const RightSidebar: React.FC = () => {
  const { queue, play, currentTrack } = useMusic();

  const displayQueue = queue.length > 0 ? queue.slice(0, 8) : PLACEHOLDER_QUEUE;

  return (
    <aside className="w-80 flex-shrink-0 flex flex-col h-full glass border-l border-white/5 p-6 hidden xl:flex">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Up Next</h2>
        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
          {queue.length > 0 ? `${queue.length} tracks` : 'Queue empty'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
        {displayQueue.map((track, i) => (
          <motion.div
            key={`${track.videoId || track.title}-${i}`}
            whileHover={{ x: 4 }}
            onClick={() => track.videoId ? play(track, queue.slice(i + 1)) : undefined}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
              <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={16} fill="white" className="text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold truncate group-hover:text-[var(--color-accent)] transition-colors">{track.title}</h4>
              <p className="text-xs text-white/50 truncate">{track.artist}</p>
            </div>
            <span className="text-xs text-white/30 font-mono">{formatTime(track.duration)}</span>
            <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white">
              <MoreHorizontal size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      {currentTrack && (
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Now Playing</h2>
          </div>
          <div className="flex items-center gap-3">
            <img src={currentTrack.thumbnail} alt={currentTrack.title} className="w-12 h-12 rounded object-cover" referrerPolicy="no-referrer" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{currentTrack.title}</p>
              <p className="text-xs text-white/50 truncate">{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
