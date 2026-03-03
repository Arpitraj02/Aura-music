import { Router } from 'express';
import type { Request, Response } from 'express';
import { searchTracks, getRelated } from '../services/ytmusic.js';
import { streamAudio, getAudioUrl, getVideoInfo, downloadAudio } from '../services/ytdlp.js';
import path from 'path';
import fs from 'fs';
import os from 'os';

const router = Router();

// GET /api/health  – lightweight health check
router.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/search?q=<query>
router.get('/search', async (req: Request, res: Response): Promise<void> => {
  const query = String(req.query.q ?? '').trim();
  if (!query) {
    res.status(400).json({ error: 'bad_request', message: 'Missing query parameter "q"' });
    return;
  }
  try {
    const tracks = await searchTracks(query);
    res.json({ tracks, query });
  } catch (err: unknown) {
    console.error('[search]', err);
    res.status(500).json({ error: 'search_failed', message: String(err) });
  }
});

// GET /api/stream/:videoId  – streams audio in real time via yt-dlp
router.get('/stream/:videoId', (req: Request, res: Response): void => {
  const { videoId } = req.params;
  if (!isValidVideoId(videoId)) {
    res.status(400).json({ error: 'invalid_id', message: 'Invalid video ID' });
    return;
  }
  streamAudio(videoId, req as any, res as any);
});

// GET /api/audio-url/:videoId  – returns a direct CDN audio URL (short-lived)
router.get('/audio-url/:videoId', async (req: Request, res: Response): Promise<void> => {
  const { videoId } = req.params;
  if (!isValidVideoId(videoId)) {
    res.status(400).json({ error: 'invalid_id', message: 'Invalid video ID' });
    return;
  }
  try {
    const url = await getAudioUrl(videoId);
    res.json({ url, videoId });
  } catch (err: unknown) {
    console.error('[audio-url]', err);
    res.status(500).json({ error: 'audio_url_failed', message: String(err) });
  }
});

// GET /api/info/:videoId  – returns track metadata
router.get('/info/:videoId', async (req: Request, res: Response): Promise<void> => {
  const { videoId } = req.params;
  if (!isValidVideoId(videoId)) {
    res.status(400).json({ error: 'invalid_id', message: 'Invalid video ID' });
    return;
  }
  try {
    const info = await getVideoInfo(videoId);
    res.json({
      id: videoId,
      videoId,
      title: info.title,
      artist: info.uploader ?? info.channel,
      album: '',
      duration: info.duration,
      thumbnail: info.thumbnail,
    });
  } catch (err: unknown) {
    console.error('[info]', err);
    res.status(500).json({ error: 'info_failed', message: String(err) });
  }
});

// GET /api/suggestions/:videoId  – returns autoplay suggestions
router.get('/suggestions/:videoId', async (req: Request, res: Response): Promise<void> => {
  const { videoId } = req.params;
  if (!isValidVideoId(videoId)) {
    res.status(400).json({ error: 'invalid_id', message: 'Invalid video ID' });
    return;
  }
  try {
    // First try to get related tracks via ytmusic; fall back to a generic search
    let tracks = await getRelated(videoId);
    if (!tracks || tracks.length === 0) {
      // Fallback: use yt-dlp info to get title and search related
      const info = await getVideoInfo(videoId).catch(() => null);
      if (info?.title) {
        tracks = await searchTracks(String(info.title));
      }
    }
    // Remove the current track from suggestions
    const filtered = tracks.filter((t) => t.videoId !== videoId);
    res.json({ tracks: filtered, basedOn: videoId });
  } catch (err: unknown) {
    console.error('[suggestions]', err);
    res.status(500).json({ error: 'suggestions_failed', message: String(err) });
  }
});

// GET /api/download/:videoId  – downloads audio and sends as file attachment
router.get('/download/:videoId', async (req: Request, res: Response): Promise<void> => {
  const { videoId } = req.params;
  if (!isValidVideoId(videoId)) {
    res.status(400).json({ error: 'invalid_id', message: 'Invalid video ID' });
    return;
  }
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-'));
  try {
    const filePath = await downloadAudio(videoId, tmpDir);
    const filename = path.basename(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'audio/mp4');
    const stream = fs.createReadStream(filePath);
    stream.pipe(res as unknown as NodeJS.WritableStream);
    stream.on('end', () => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });
    stream.on('error', () => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });
  } catch (err: unknown) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.error('[download]', err);
    res.status(500).json({ error: 'download_failed', message: String(err) });
  }
});

function isValidVideoId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

export default router;
