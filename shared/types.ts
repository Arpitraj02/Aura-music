// Shared types between web (React) and mobile (React Native)
// Import these in both platforms for type safety.

export interface Track {
  id: string;          // YouTube video ID
  title: string;
  artist: string;
  album?: string;
  duration: number;    // seconds
  thumbnail: string;   // URL
  videoId: string;     // YouTube video ID (same as id)
}

export interface SearchResult {
  tracks: Track[];
  query: string;
}

export interface StreamInfo {
  streamUrl: string;   // direct audio URL or /api/stream/:id
  track: Track;
}

export interface SuggestionsResult {
  tracks: Track[];
  basedOn: string;     // video ID the suggestions are based on
}

export interface ApiError {
  error: string;
  message: string;
}
