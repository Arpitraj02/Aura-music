import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { Track } from '../api/types.js';
import { getSuggestions, getStreamUrl } from '../api/client.js';

interface MusicContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  progress: number;       // 0–1
  duration: number;       // seconds
  volume: number;         // 0–1
  isAutoplay: boolean;
  play: (track: Track, newQueue?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  skipNext: () => void;
  skipPrev: () => void;
  seek: (fraction: number) => void;
  setVolume: (vol: number) => void;
  setQueue: (tracks: Track[]) => void;
  toggleAutoplay: () => void;
  addToQueue: (track: Track) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const historyRef = useRef<Track[]>([]);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });
    audio.addEventListener('durationchange', () => {
      setDuration(audio.duration ?? 0);
    });
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnded = useCallback(() => {
    setQueue((q) => {
      if (q.length > 0) {
        const [next, ...rest] = q;
        playTrackRef.current(next, rest);
        return rest;
      }
      if (isAutoplay && currentTrack) {
        getSuggestions(currentTrack.videoId)
          .then((suggestions) => {
            if (suggestions.length > 0) {
              const [first, ...rest] = suggestions;
              playTrackRef.current(first, rest);
            }
          })
          .catch(console.error);
      }
      setIsPlaying(false);
      return q;
    });
  }, [isAutoplay, currentTrack]);

  // Re-attach ended handler when autoplay/currentTrack changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.removeEventListener('ended', handleEnded);
    audio.addEventListener('ended', handleEnded);
  }, [handleEnded]);

  const playTrackRef = useRef<(track: Track, nextQueue: Track[]) => void>(() => undefined);

  // Keep playTrackRef.current up-to-date without causing stale closures
  playTrackRef.current = (track: Track, nextQueue: Track[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTrack((cur) => {
      if (cur) historyRef.current.push(cur);
      return track;
    });
    setQueue(nextQueue);
    setProgress(0);
    audio.src = getStreamUrl(track.videoId);
    audio.load();
    audio.play().catch(console.error);
  };

  const play = useCallback((track: Track, newQueue: Track[] = []) => {
    playTrackRef.current(track, newQueue);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play().catch(console.error);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(console.error);
    else audio.pause();
  }, []);

  const skipNext = useCallback(() => {
    setQueue((q) => {
      if (q.length > 0) {
        const [next, ...rest] = q;
        playTrackRef.current(next, rest);
        return rest;
      }
      return q;
    });
  }, []);

  const skipPrev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const prev = historyRef.current.pop();
    if (prev && currentTrack) {
      setQueue((q) => [currentTrack, ...q]);
      playTrackRef.current(prev, []);
    }
  }, [currentTrack]);

  const seek = useCallback((fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = fraction * audio.duration;
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, []);

  const toggleAutoplay = useCallback(() => {
    setIsAutoplay((a) => !a);
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue((q) => [...q, track]);
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        progress,
        duration,
        volume,
        isAutoplay,
        play,
        pause,
        resume,
        togglePlay,
        skipNext,
        skipPrev,
        seek,
        setVolume,
        setQueue,
        toggleAutoplay,
        addToQueue,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within a MusicProvider');
  return ctx;
};
