import { spawn } from 'child_process';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';

const YTDLP_BINARY = process.env.YTDLP_PATH ?? 'yt-dlp';

/**
 * Run yt-dlp and return stdout as a string.
 */
function runYtdlp(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP_BINARY, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    proc.stdout.on('data', (d: Buffer) => { out += d.toString(); });
    proc.stderr.on('data', (d: Buffer) => { err += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(err.trim() || `yt-dlp exited with code ${code}`));
    });
  });
}

/**
 * Get the best audio URL for a YouTube video ID (no download).
 * Returns a direct stream URL valid for a short time.
 */
export async function getAudioUrl(videoId: string): Promise<string> {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const output = await runYtdlp([
    '--get-url',
    '-f', 'bestaudio[ext=webm]/bestaudio[ext=m4a]/bestaudio',
    '--no-playlist',
    url,
  ]);
  const lines = output.split('\n').filter(Boolean);
  return lines[0];
}

/**
 * Stream audio directly to the HTTP response using yt-dlp piping.
 * Supports range requests for seeking.
 */
export function streamAudio(
  videoId: string,
  req: IncomingMessage,
  res: ServerResponse,
): void {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const rangeHeader = (req as any).headers?.range as string | undefined;

  const args = [
    '-f', 'bestaudio[ext=webm]/bestaudio[ext=m4a]/bestaudio',
    '--no-playlist',
    '-o', '-',
    url,
  ];

  res.setHeader('Content-Type', 'audio/webm');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');

  if (rangeHeader) {
    res.statusCode = 206;
  } else {
    res.statusCode = 200;
  }

  const proc = spawn(YTDLP_BINARY, args, { stdio: ['ignore', 'pipe', 'pipe'] });

  proc.stdout.pipe(res as unknown as NodeJS.WritableStream);

  (res as any).on('close', () => {
    try { proc.kill(); } catch { /* ignore */ }
  });
  (res as any).on('error', () => {
    try { proc.kill(); } catch { /* ignore */ }
  });
}

/**
 * Get video info (title, thumbnail, duration, uploader) as JSON from yt-dlp.
 */
export async function getVideoInfo(videoId: string): Promise<Record<string, unknown>> {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const output = await runYtdlp([
    '--dump-json',
    '--no-playlist',
    url,
  ]);
  return JSON.parse(output) as Record<string, unknown>;
}

/**
 * Download audio to a local file.
 * Returns the output file path.
 */
export async function downloadAudio(
  videoId: string,
  outputDir: string,
): Promise<string> {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const outTemplate = path.join(outputDir, `${videoId}.%(ext)s`);
  await runYtdlp([
    '-f', 'bestaudio[ext=m4a]/bestaudio',
    '--no-playlist',
    '-o', outTemplate,
    url,
  ]);
  // Return the expected filename (m4a preferred)
  return path.join(outputDir, `${videoId}.m4a`);
}
