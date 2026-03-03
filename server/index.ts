import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import musicRouter from './routes/music.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(express.json());

// CORS – allow the Vite dev server and any configured APP_URL
const allowedOrigins = new Set<string>(
  [process.env.APP_URL, 'http://localhost:3000', 'http://localhost:5173']
    .filter(Boolean) as string[],
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// API routes
app.use('/api', musicRouter);

// Serve frontend static files in production
const distDir = path.join(__dirname, '..', 'dist');
app.use(express.static(distDir));
app.get('*', (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) res.status(404).send('Not found');
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎵 Aura Music server running on http://0.0.0.0:${PORT}`);
});
