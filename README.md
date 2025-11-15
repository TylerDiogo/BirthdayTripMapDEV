# Birthday Trip Globe

A static React + Vite + TypeScript app that visualizes a 30th birthday around-the-world trip on a Mapbox globe.

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Mapbox token**

   The repo ships with a public Mapbox access token baked into the bundle so it works out of the box. If you prefer to use your
   own token, duplicate `.env.example` as `.env` and set `VITE_MAPBOX_TOKEN`:

   ```bash
   cp .env.example .env
   # edit .env and set VITE_MAPBOX_TOKEN
   ```

3. **Trip data**

   Edit `trip-data.json` at the repo root to adjust stops (id, order, city, country, lat, lng, date, note). The app fetches this file at runtime, so deploying updated data only requires updating the JSON file.

## Available scripts

- `npm run dev` – Start the Vite dev server.
- `npm run build` – Type-check and build static assets into `dist/`.
- `npm run preview` – Preview the production build locally.

## Deployment

The app builds to static assets in `dist/`. Deploy that folder to any static host such as GitHub Pages, Netlify, or Vercel. Ensure the host exposes `trip-data.json` alongside the bundled files.

## Tech stack

- React 18 + TypeScript
- Vite
- Mapbox GL JS (globe projection, markers, arcs)
