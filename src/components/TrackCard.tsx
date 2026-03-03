import React from 'react';
import { Play, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';

interface TrackCardProps {
  title: string;
  artist: string;
  image: string;
  type?: 'album' | 'artist';
  loading?: boolean;
}

export const TrackCard: React.FC<TrackCardProps> = ({ title, artist, image, type = 'album', loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-2 md:gap-3 min-w-[120px] md:min-w-[160px]">
        <div className={`aspect-square w-full skeleton ${type === 'artist' ? 'rounded-full' : 'rounded-lg'}`} />
        <div className="space-y-1 md:space-y-2">
          <div className="h-3 md:h-4 w-3/4 skeleton rounded" />
          <div className="h-2 md:h-3 w-1/2 skeleton rounded opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="flex flex-col group cursor-pointer min-w-[120px] md:min-w-[160px]"
    >
      <div className={`relative aspect-square w-full mb-2 md:mb-3 overflow-hidden shadow-lg ${type === 'artist' ? 'rounded-full' : 'rounded-lg'}`}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-white/30 transition-colors"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <Play fill="white" className="text-white ml-0.5 md:ml-1" size={16} />
          </motion.div>
        </div>
      </div>
      <div className="flex justify-between items-start gap-1 md:gap-2">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-xs md:text-sm truncate ${type === 'artist' ? 'text-center' : ''}`}>{title}</h3>
          <p className={`text-[10px] md:text-xs text-white/50 truncate ${type === 'artist' ? 'text-center' : ''}`}>{artist}</p>
        </div>
        {type === 'album' && (
          <button className="p-0.5 md:p-1 opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-white">
            <MoreVertical size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
};
