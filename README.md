# Endless Canvas Project

An infinite canvas of draggable sticky notes with a scrolling grid background, built with **Next.js (App Router)** and **TypeScript**.

The app is fully local — no account, no backend. Everything you create is stored in your browser's IndexedDB and never leaves the device.

## Features

- **Infinite grid** background that pans and zooms with the viewport.
- **Pan** with **Space + left-drag**.
- **Zoom** with **Ctrl / Cmd + scroll**, centered around the mouse cursor.
- **Sticky notes**:
  - Double-click empty space to create a note.
  - Drag the note header to move it (respects zoom level).
  - Choose from five colors, with tape and subtle rotation.
  - Timestamp display.
- **Markdown notes** for longer-form content, toggled from the HUD.
- **Local persistence**: notes, viewport and preferences are saved to IndexedDB and restored on the next visit.

## File Structure

- `src/app/page.tsx` – Renders the canvas.
- `src/components/Canvas/` – Infinite canvas, pan/zoom, grid, notes management.
- `src/components/StickyNote.tsx` – Individual sticky note UI.
- `src/hooks/useCanvas.ts` – Transform state, pan/zoom, and screen↔world conversion.
- `src/hooks/useHasHydrated.ts` – Waits for the persisted canvas to load before rendering.
- `src/store/canvasStore.ts` – Zustand store persisted to IndexedDB.
- `src/utils/storage/indexedDb.ts` – IndexedDB storage adapter (falls back to `localStorage`).
- `src/types/canvas.ts` – Shared types for transform and notes.

## Getting Started

```bash
yarn install
yarn dev
```

Then open `http://localhost:3000` in your browser. No environment variables are required.

## Storage Notes

- State lives under the `endless-canvas` IndexedDB database, key `canvas-store`.
- Canvases saved by earlier `localStorage` builds are migrated automatically on first load.
- If IndexedDB is unavailable (e.g. a private window with site data blocked), the app falls back to `localStorage`.
- Clearing browser site data deletes your notes; there is no server copy.
