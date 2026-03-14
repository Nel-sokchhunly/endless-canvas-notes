# Endless Canvas in Next.js — Sticky Notes with Grid

A full implementation of an infinite canvas with:
- Dot/grid background that scrolls with the viewport
- Pan (alt+drag or middle mouse) and zoom (ctrl+scroll)
- Draggable sticky notes with color, tilt, tape, and timestamp

---

## File Structure

```
src/
├── app/
│   └── page.tsx
├── components/
│   ├── Canvas.tsx
│   └── StickyNote.tsx
├── hooks/
│   └── useCanvas.ts
└── types/
    └── canvas.ts
```

---

## Types — `types/canvas.ts`

```ts
export type Transform = {
  x: number;
  y: number;
  scale: number;
};

export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

export type Note = {
  id: string;
  x: number;
  y: number;
  text: string;
  color?: NoteColor;
  rotation?: number;  // degrees, e.g. -2 to 2
  createdAt?: number; // Date.now()
};
```

---

## Hook — `hooks/useCanvas.ts`

Handles pan, zoom, and screen↔world coordinate conversion.

```ts
import { useRef, useState, useCallback } from 'react';
import type { Transform } from '@/types/canvas';

export function useCanvas() {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle mouse OR Alt + left click
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      isPanning.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom toward cursor
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setTransform(t => {
        const newScale = Math.min(Math.max(t.scale * zoomFactor, 0.1), 5);
        return {
          scale: newScale,
          x: mouseX - (mouseX - t.x) * (newScale / t.scale),
          y: mouseY - (mouseY - t.y) * (newScale / t.scale),
        };
      });
    } else {
      setTransform(t => ({ ...t, x: t.x - e.deltaX, y: t.y - e.deltaY }));
    }
  }, []);

  const screenToWorld = useCallback(
    (sx: number, sy: number) => ({
      x: (sx - transform.x) / transform.scale,
      y: (sy - transform.y) / transform.scale,
    }),
    [transform]
  );

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  return {
    transform,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    screenToWorld,
    resetView,
  };
}
```

---

## Component — `components/StickyNote.tsx`

```tsx
'use client';

import type { Note, NoteColor } from '@/types/canvas';

export const NOTE_COLORS = {
  yellow: {
    base: '#fef08a',
    header: '#fde047',
    text: '#3f2d00',
    accent: '#ca8a04',
  },
  blue: {
    base: '#bfdbfe',
    header: '#93c5fd',
    text: '#1e3a8a',
    accent: '#1d4ed8',
  },
  green: {
    base: '#bbf7d0',
    header: '#86efac',
    text: '#14532d',
    accent: '#15803d',
  },
  pink: {
    base: '#fbcfe8',
    header: '#f9a8d4',
    text: '#500724',
    accent: '#be185d',
  },
  purple: {
    base: '#e9d5ff',
    header: '#d8b4fe',
    text: '#3b0764',
    accent: '#7e22ce',
  },
} as const;

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: NoteColor) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
}

export default function StickyNote({
  note,
  onUpdate,
  onDelete,
  onColorChange,
  onDragStart,
}: StickyNoteProps) {
  const color = NOTE_COLORS[note.color ?? 'yellow'];

  const createdAt = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div
      className="group absolute"
      style={{
        left: note.x,
        top: note.y,
        width: 200,
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '2px 12px 12px 12px',
        backgroundColor: color.base,
        boxShadow: '2px 4px 14px rgba(0,0,0,0.13)',
        transform: `rotate(${note.rotation ?? 0}deg)`,
      }}
    >
      {/* Tape */}
      <div
        style={{
          position: 'absolute',
          top: -7,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 36,
          height: 14,
          borderRadius: 2,
          backgroundColor: color.accent,
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      />

      {/* Header — drag handle */}
      <div
        onMouseDown={e => {
          e.stopPropagation();
          onDragStart(e, note.id);
        }}
        style={{
          padding: '8px 10px 6px',
          borderRadius: '2px 12px 0 0',
          backgroundColor: color.header,
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: 6,
        }}
      >
        {/* Grip dots */}
        <div style={{ display: 'flex', gap: 3 }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: color.accent,
                opacity: 0.45,
                display: 'block',
              }}
            />
          ))}
        </div>

        {/* Color swatches */}
        <div style={{ display: 'flex', gap: 3 }}>
          {(Object.keys(NOTE_COLORS) as NoteColor[]).map(c => (
            <button
              key={c}
              title={c}
              onMouseDown={e => e.stopPropagation()}
              onClick={() => onColorChange(note.id, c)}
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                border: `1.5px solid ${NOTE_COLORS[c].accent}`,
                backgroundColor: NOTE_COLORS[c].header,
                cursor: 'pointer',
                padding: 0,
                outline:
                  note.color === c
                    ? `2px solid ${NOTE_COLORS[c].accent}`
                    : 'none',
                outlineOffset: 1,
              }}
            />
          ))}
        </div>

        {/* Delete */}
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={() => onDelete(note.id)}
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: 'none',
            backgroundColor: color.header,
            color: color.text,
            fontSize: 9,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.15s',
          }}
          className="group-hover:!opacity-100"
        >
          ✕
        </button>
      </div>

      {/* Text area */}
      <textarea
        defaultValue={note.text}
        placeholder="Type something..."
        onChange={e => onUpdate(note.id, e.target.value)}
        onMouseDown={e => e.stopPropagation()}
        style={{
          flex: 1,
          padding: '10px 12px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          fontSize: 13,
          lineHeight: 1.55,
          color: color.text,
          minHeight: 100,
        }}
      />

      {/* Footer timestamp */}
      {createdAt && (
        <div
          style={{
            padding: '4px 10px 8px',
            fontSize: 10,
            color: color.text,
            opacity: 0.4,
            fontFamily: 'monospace',
          }}
        >
          {createdAt}
        </div>
      )}
    </div>
  );
}
```

---

## Component — `components/Canvas.tsx`

```tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import StickyNote from '@/components/StickyNote';
import type { Note, NoteColor } from '@/types/canvas';

const COLOR_CYCLE: NoteColor[] = ['yellow', 'blue', 'green', 'pink', 'purple'];

export default function Canvas() {
  const {
    transform,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    screenToWorld,
    resetView,
  } = useCanvas();

  const [notes, setNotes] = useState<Note[]>([]);
  const transformRef = useRef(transform);

  // Keep ref in sync so drag handlers always see latest scale
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  // Prevent browser zoom hijacking ctrl+scroll
  useEffect(() => {
    const prevent = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    window.addEventListener('wheel', prevent, { passive: false });
    return () => window.removeEventListener('wheel', prevent);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('canvas-notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('canvas-notes', JSON.stringify(notes));
  }, [notes]);

  // Double-click to create a note
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('.canvas-note')) return;
      const world = screenToWorld(e.clientX, e.clientY);
      setNotes(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          x: world.x - 100,
          y: world.y - 90,
          text: '',
          color: COLOR_CYCLE[prev.length % COLOR_CYCLE.length],
          rotation: parseFloat((Math.random() * 4 - 2).toFixed(2)),
          createdAt: Date.now(),
        },
      ]);
    },
    [screenToWorld]
  );

  const updateNote = useCallback((id: string, text: string) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, text } : n)));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const changeColor = useCallback((id: string, color: NoteColor) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, color } : n)));
  }, []);

  // Drag a note — uses window listeners so dragging outside the note still works
  const onNoteMouseDown = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      e.preventDefault();

      const t = transformRef.current;
      const startScreenX = e.clientX;
      const startScreenY = e.clientY;

      // Snapshot starting world position
      setNotes(prev => {
        const note = prev.find(n => n.id === id);
        if (!note) return prev;

        const startNoteX = note.x;
        const startNoteY = note.y;

        const onMove = (ev: MouseEvent) => {
          // Divide screen delta by scale to get world delta
          const dx = (ev.clientX - startScreenX) / t.scale;
          const dy = (ev.clientY - startScreenY) / t.scale;
          setNotes(all =>
            all.map(n =>
              n.id === id
                ? { ...n, x: startNoteX + dx, y: startNoteY + dy }
                : n
            )
          );
        };

        const onUp = () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        return prev; // no state change here, just setting up listeners
      });
    },
    []
  );

  // Grid pattern sizes — scale with zoom
  const gridSmall = 30 * transform.scale;
  const gridLarge = 150 * transform.scale;

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        backgroundColor: '#0f0f0f',
        cursor: 'default',
        touchAction: 'none',
        userSelect: 'none',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
      onDoubleClick={handleDoubleClick}
    >
      {/* ── Grid background ── */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fine grid */}
          <pattern
            id="grid-small"
            x={transform.x % gridSmall}
            y={transform.y % gridSmall}
            width={gridSmall}
            height={gridSmall}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSmall} 0 L 0 0 0 ${gridSmall}`}
              fill="none"
              stroke="#1e1e1e"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Accent grid — every 5 cells */}
          <pattern
            id="grid-large"
            x={transform.x % gridLarge}
            y={transform.y % gridLarge}
            width={gridLarge}
            height={gridLarge}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridLarge} 0 L 0 0 0 ${gridLarge}`}
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid-small)" />
        <rect width="100%" height="100%" fill="url(#grid-large)" />
      </svg>

      {/* ── HUD ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          display: 'flex',
          gap: 8,
          zIndex: 10,
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: '#666',
            backgroundColor: '#1a1a1a',
            padding: '3px 8px',
            borderRadius: 6,
            fontFamily: 'monospace',
          }}
        >
          {Math.round(transform.scale * 100)}%
        </span>
        <button
          onClick={resetView}
          style={{
            fontSize: 11,
            color: '#888',
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            padding: '3px 10px',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      {/* ── Hint ── */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          fontSize: 11,
          color: '#444',
          zIndex: 10,
          fontFamily: 'monospace',
          lineHeight: 1.8,
        }}
      >
        Double-click to add note
        <br />
        Alt+drag or middle mouse to pan
        <br />
        Ctrl+scroll to zoom · Drag header to move note
      </div>

      {/* ── World container ── */}
      <div
        className="absolute"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
        }}
      >
        {notes.map(note => (
          <div key={note.id} className="canvas-note">
            <StickyNote
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onColorChange={changeColor}
              onDragStart={onNoteMouseDown}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Page — `app/page.tsx`

```tsx
import Canvas from '@/components/Canvas';

export default function Home() {
  return <Canvas />;
}
```

---

## How Note Dragging Works

The key is dividing the mouse delta by `transform.scale` so the note tracks
the cursor correctly at any zoom level:

```ts
const dx = (ev.clientX - startScreenX) / t.scale;
const dy = (ev.clientY - startScreenY) / t.scale;
```

Without the division, notes move too fast when zoomed in and too slow when zoomed out.

We snapshot the starting world position at mousedown so the note position
doesn't drift on re-renders, and attach listeners to `window` (not the element)
so dragging outside the note boundary still works.

---

## How the Grid Works

Two SVG `<pattern>` layers stacked:

- `grid-small` — 30px cells, stroke `#1e1e1e`, subtle texture
- `grid-large` — 150px cells (every 5 small cells), stroke `#2a2a2a`, visual anchoring

Both offset by `transform.x % patternSize` / `transform.y % patternSize` so they
scroll seamlessly with the canvas without re-rendering.

To switch to a **light theme**, change:
```ts
backgroundColor: '#ffffff'   // canvas bg
stroke="#ebebeb"             // grid-small
stroke="#d5d5d5"             // grid-large
```

To switch to **dots instead of lines**, replace the `<path>` inside each pattern with:
```svg
<circle cx="1" cy="1" r="0.8" fill="#2a2a2a" />
```

---

## Tailwind Note

`group-hover:!opacity-100` on the delete button requires Tailwind. Without it, use JS hover:

```tsx
onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0')}
```

---

## Recommended Libraries

| Need | Library | License |
|---|---|---|
| Rich text in notes | `@tiptap/react` | MIT |
| Canvas state management | `zustand` | MIT |

---

## Recommended Next Steps

| Feature | Approach |
|---|---|
| Resize notes | Add a resize handle at bottom-right, track `width`/`height` in Note type |
| Rich text | Replace `<textarea>` with `@tiptap/react` (MIT) |
| Snap to grid | Round `x`/`y` to nearest 30 on drag end |
| Persist to DB | POST to a Next.js API route → Postgres/Supabase on change |
| Select + multi-drag | Track `selectedIds: Set<string>`, apply delta to all selected on drag |
