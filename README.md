<div align="center">
<img width="1200" height="475" alt="Aura Music Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🎵 Aura Music

**A modern, full-stack music streaming web app powered by yt-dlp and YouTube Music.**

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)](https://typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ed?logo=docker)](https://docker.com)
</div>

---

## ✨ Features

| Feature | Status |
|---|---|
| 🔍 Real-time search via YouTube Music | ✅ |
| 🎧 Audio streaming via yt-dlp (no ads, no limits) | ✅ |
| ⬇️ Song download (M4A) | ✅ |
| 🔁 Autoplay / suggestions | ✅ |
| 🖼️ Covers & metadata from YouTube Music API | ✅ |
| 📱 Mobile-responsive UI | ✅ |
| 🌙 Dark mode & accent color themes | ✅ |
| 🐳 Docker + VPS deployment ready | ✅ |
| 📦 Shared TypeScript types for React Native | ✅ |
| 🎚️ Volume control, seeking, skip prev/next | ✅ |

---

## 🏗️ Project Structure

```
aura-music/
├── server/                 # Express API (Node.js)
│   ├── index.ts            # Server entry point
│   ├── routes/
│   │   └── music.ts        # /api/* route handlers
│   └── services/
│       ├── ytdlp.ts        # yt-dlp streaming, download, info
│       └── ytmusic.ts      # YouTube Music search & suggestions
├── shared/
│   └── types.ts            # ⬅️ Shared types (web + React Native)
├── src/                    # React frontend (Vite)
│   ├── api/
│   │   ├── client.ts       # Typed API calls
│   │   └── types.ts        # Re-exports from shared/
│   ├── components/
│   │   ├── Player.tsx      # Full/mini audio player
│   │   ├── MainContent.tsx # Search + home sections
│   │   ├── RightSidebar.tsx# Queue display
│   │   └── ...
│   └── contexts/
│       ├── MusicContext.tsx # Global player state
│       ├── ThemeContext.tsx
│       └── UserContext.tsx
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 🚀 Quick Start (Local Dev)

### Prerequisites

- **Node.js** ≥ 20
- **yt-dlp** installed and on `$PATH`  
  Install: `pip install yt-dlp` or `brew install yt-dlp` or download from [yt-dlp releases](https://github.com/yt-dlp/yt-dlp/releases)
- **ffmpeg** (required by yt-dlp for audio conversion)  
  Install: `sudo apt install ffmpeg` / `brew install ffmpeg`

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Arpitraj02/Aura-music
cd Aura-music

# 2. Install dependencies
npm install

# 3. Copy and configure env
cp .env.example .env
# Edit .env – most defaults work out of the box

# 4. Start both frontend and backend in watch mode
npm run dev:all

# Frontend: http://localhost:3000
# API:      http://localhost:3001/api
```

> **Note:** The Vite dev server automatically proxies `/api` requests to the Express backend, so you don't need to worry about CORS in development.

---

## 🐳 VPS / Docker Deployment

### Option A – Docker Compose (recommended)

```bash
# 1. Clone on your VPS
git clone https://github.com/Arpitraj02/Aura-music
cd Aura-music

# 2. Set your public URL
echo 'APP_URL=https://music.yourdomain.com' > .env
echo 'PORT=3001' >> .env

# 3. Build and start
docker compose up -d --build

# App is now live on port 3001
```

To update:
```bash
git pull && docker compose up -d --build
```

### Option B – Nginx reverse proxy (HTTPS)

Add to your Nginx config:
```nginx
server {
    listen 443 ssl;
    server_name music.yourdomain.com;

    # SSL certs via Certbot
    ssl_certificate     /etc/letsencrypt/live/music.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/music.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        # Allow audio streaming (no buffering)
        proxy_buffering off;
        proxy_read_timeout 3600s;
    }
}
```

### Option C – Manual (no Docker)

```bash
# Install system deps
sudo apt update && sudo apt install -y nodejs npm ffmpeg python3-pip
pip3 install yt-dlp

# Install app deps
npm install

# Build frontend
npm run build

# Build server
npm run build:server

# Start production server
NODE_ENV=production PORT=3001 npm start
```

Use **PM2** to keep it running:
```bash
npm install -g pm2
pm2 start "npm start" --name aura-music
pm2 save && pm2 startup
```

---

## 📡 API Reference

All endpoints are under `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search?q=<query>` | Search YouTube Music |
| `GET` | `/api/stream/:videoId` | Stream audio (chunked) |
| `GET` | `/api/audio-url/:videoId` | Get direct CDN audio URL |
| `GET` | `/api/info/:videoId` | Get track metadata |
| `GET` | `/api/suggestions/:videoId` | Get autoplay suggestions |
| `GET` | `/api/download/:videoId` | Download audio as M4A |

### Example

```bash
# Search
curl "http://localhost:3001/api/search?q=blinding+lights"

# Get stream URL
curl "http://localhost:3001/api/audio-url/XXXXXX"

# Stream directly in browser
<audio src="http://localhost:3001/api/stream/XXXXXX" controls></audio>
```

---

## 📱 React Native – Building the Mobile App

The `shared/types.ts` file exports all core TypeScript types (`Track`, `SearchResult`, etc.) that are designed to be used in both the web app and a React Native app.

### Recommended setup

```bash
# Create a new RN app alongside this repo
npx create-expo-app AuraMusicMobile
cd AuraMusicMobile

# Point the API_URL to your hosted backend
# e.g. https://music.yourdomain.com/api
```

In your React Native code:
```typescript
import type { Track } from '../aura-music/shared/types';

const API = 'https://music.yourdomain.com/api';

async function search(query: string): Promise<Track[]> {
  const res = await fetch(`${API}/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.tracks;
}

// Stream audio
<Audio source={{ uri: `${API}/stream/${track.videoId}` }} />
```

All the same API endpoints work identically for the mobile client. Use [expo-av](https://docs.expo.dev/versions/latest/sdk/av/) for audio playback.

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `APP_URL` | `http://localhost:3001` | Public URL (for CORS) |
| `YTDLP_PATH` | `yt-dlp` | Absolute path to yt-dlp binary |
| `API_PORT` | `3001` | Port used by Vite proxy in dev |
| `GEMINI_API_KEY` | – | Optional Gemini AI key |

---

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite frontend only |
| `npm run dev:server` | Start Express server (watch mode) |
| `npm run dev:all` | Start both concurrently |
| `npm run build` | Build frontend for production |
| `npm run build:server` | Compile server TypeScript |
| `npm start` | Start production server |
| `npm run lint` | TypeScript type check |

---

## 🔒 Security Notes

- The `/api/stream` and `/api/download` endpoints validate video IDs (11-char alphanumeric) to prevent SSRF.
- CORS is restricted to `APP_URL` and localhost in development.
- No user data is stored; the SQLite dependency is included for future playlist persistence.

---

## 📄 License

MIT © Arpitraj02
