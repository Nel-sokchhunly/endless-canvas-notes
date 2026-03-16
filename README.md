# Endless Canvas Project

An infinite canvas of draggable sticky notes with a scrolling grid background, built with **Next.js (App Router)** and **TypeScript**.

## Features

- **Infinite grid** background that pans and zooms with the viewport.
- **Pan** with **Space + left-drag** or **middle mouse drag**.
- **Zoom** with **Ctrl / Cmd + scroll**, centered around the mouse cursor.
- **Sticky notes**:
  - Double-click empty space to create a note.
  - Drag the note header to move it (respects zoom level).
  - Choose from five colors, with tape and subtle rotation.
  - Timestamp display and localStorage persistence.

## File Structure

- `src/app/page.tsx` – Renders the canvas.
- `src/components/Canvas.tsx` – Infinite canvas, pan/zoom, grid, notes management.
- `src/components/StickyNote.tsx` – Individual sticky note UI.
- `src/hooks/useCanvas.ts` – Transform state, pan/zoom, and screen↔world conversion.
- `src/types/canvas.ts` – Shared types for transform and notes.

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Notes

- Tailwind is **not required**; the class names used are no-ops unless you add Tailwind later.
- The implementation follows the behavior described in `requirements.md` as closely as possible while keeping the setup minimal.

