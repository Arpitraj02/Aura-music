import type { Track, SearchResult, SuggestionsResult } from './types.js';

// The API base URL – in dev the Vite proxy forwards /api to localhost:3001
// In production the server serves both frontend and API from the same origin.
const BASE = '/api';

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function searchTracks(query: string): Promise<Track[]> {
  const data = await apiFetch<SearchResult>(`${BASE}/search?q=${encodeURIComponent(query)}`);
  return data.tracks;
}

export async function getSuggestions(videoId: string): Promise<Track[]> {
  const data = await apiFetch<SuggestionsResult>(`${BASE}/suggestions/${videoId}`);
  return data.tracks;
}

/**
 * Returns a URL that streams audio for the given video ID.
 * The browser <audio> element can use this directly.
 */
export function getStreamUrl(videoId: string): string {
  return `${BASE}/stream/${videoId}`;
}

/**
 * Returns a URL to download audio as a file attachment.
 */
export function getDownloadUrl(videoId: string): string {
  return `${BASE}/download/${videoId}`;
}
