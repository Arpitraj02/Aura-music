import YTMusic from 'ytmusic-api';
import type { Track } from '../../shared/types.js';

let ytmusic: YTMusic | null = null;

async function getClient(): Promise<YTMusic> {
  if (!ytmusic) {
    ytmusic = new YTMusic();
    await ytmusic.initialize();
  }
  return ytmusic;
}

function durationToSeconds(duration?: string | null): number {
  if (!duration) return 0;
  const parts = String(duration).split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

export async function searchTracks(query: string): Promise<Track[]> {
  const client = await getClient();
  const results = await client.searchSongs(query);
  return results.slice(0, 20).map((item: any) => {
    const videoId: string = item.videoId ?? item.id ?? '';
    const thumbnail: string =
      item.thumbnails?.[0]?.url ??
      item.album?.thumbnails?.[0]?.url ??
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const artist: string =
      item.artists?.[0]?.name ?? item.artist ?? 'Unknown Artist';
    const album: string = item.album?.name ?? '';
    const durationSeconds: number =
      typeof item.duration === 'number'
        ? item.duration
        : durationToSeconds(item.duration);
    return {
      id: videoId,
      videoId,
      title: item.name ?? item.title ?? 'Unknown',
      artist,
      album,
      duration: durationSeconds,
      thumbnail,
    };
  });
}

export async function getRelated(videoId: string): Promise<Track[]> {
  try {
    // Get video info to extract title+artist for a similarity search
    const client = await getClient();
    const info = await client.getSong(videoId).catch(() => null);
    if (info) {
      const query = [
        (info as any).name ?? '',
        (info as any).artists?.[0]?.name ?? '',
      ].filter(Boolean).join(' ');
      if (query) return searchTracks(query);
    }
  } catch {
    // fall through
  }
  return [];
}
