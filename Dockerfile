# ── Stage 1: Build frontend ─────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Build server ────────────────────────────────────────────────────
FROM node:20-alpine AS server-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:server

# ── Stage 3: Production image ────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Install yt-dlp and ffmpeg
RUN apk add --no-cache python3 ffmpeg curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod +x /usr/local/bin/yt-dlp

# Copy production node_modules
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled server
COPY --from=server-builder /app/dist ./dist

# Copy built frontend into dist/public (server serves from dist/)
COPY --from=frontend-builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/server/index.js"]
