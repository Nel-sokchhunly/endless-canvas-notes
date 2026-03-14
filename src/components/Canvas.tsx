'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import StickyNote from '@/components/StickyNote';
import type { NoteColor } from '@/types/canvas';
import { useCanvasStore } from '@/store/canvasStore';

const COLOR_CYCLE: NoteColor[] = ['yellow', 'blue', 'green', 'pink', 'purple'];

export default function Canvas() {
  const { transform, onMouseDown, onMouseMove, onMouseUp, onWheel, screenToWorld, resetView } =
    useCanvas();

  const { notes, setNotes } = useCanvasStore();
  const transformRef = useRef(transform);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

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

  // Double-click to create a note
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('.canvas-note')) return;

      // Convert click from viewport → canvas → world space
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;
      const world = screenToWorld(canvasX, canvasY);

      setNotes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          // Center the note horizontally under the cursor (note width ≈ 200)
          x: world.x - 100,
          y: world.y,
          text: '',
          width: 200,
          color: COLOR_CYCLE[prev.length % COLOR_CYCLE.length],
          rotation: parseFloat((Math.random() * 4 - 2).toFixed(2)),
          createdAt: Date.now(),
        },
      ]);
    },
    [screenToWorld],
  );

  const updateNote = useCallback((id: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const changeColor = useCallback((id: string, color: NoteColor) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, color } : n)));
  }, []);

  // Drag a note — uses window listeners so dragging outside the note still works
  const onNoteMouseDown = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      e.preventDefault();

      // Mark this as the top/active note
      setActiveNoteId(id);

      const t = transformRef.current;
      const startScreenX = e.clientX;
      const startScreenY = e.clientY;

      // Snapshot starting world position
      setNotes((prev) => {
        const note = prev.find((n) => n.id === id);
        if (!note) return prev;

        const startNoteX = note.x;
        const startNoteY = note.y;

        const onMove = (ev: MouseEvent) => {
          // Divide screen delta by scale to get world delta
          const dx = (ev.clientX - startScreenX) / t.scale;
          const dy = (ev.clientY - startScreenY) / t.scale;
          setNotes((all) =>
            all.map((n) => (n.id === id ? { ...n, x: startNoteX + dx, y: startNoteY + dy } : n)),
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
    [setNotes],
  );

  // Resize a note horizontally from the right edge
  const onNoteResizeMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();

    const t = transformRef.current;
    const startScreenX = e.clientX;

    setNotes((prev) => {
      const note = prev.find((n) => n.id === id);
      if (!note) return prev;

      const startWidth = note.width ?? 200;

      const onMove = (ev: MouseEvent) => {
        const dx = (ev.clientX - startScreenX) / t.scale;
        const nextWidth = Math.max(120, startWidth + dx);
        setNotes((all) =>
          all.map((n) => (n.id === id ? { ...n, width: nextWidth } : n)),
        );
      };

      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);

      return prev;
    });
  }, []);

  // Grid pattern sizes — scale with zoom
  const gridSmall = 30 * transform.scale;
  const gridLarge = 150 * transform.scale;

  return (
    <div
      className='relative overflow-hidden'
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0f0f0f',
        cursor: 'default',
        touchAction: 'none',
        userSelect: 'none',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
      onDoubleClick={handleDoubleClick}>
      {/* ── Hint ── */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          fontSize: 11,
          color: '#666',
          zIndex: 10,
          fontFamily: 'monospace',
          lineHeight: 1.8,
          backgroundColor: 'rgba(0,0,0,0.4)',
          padding: '4px 8px',
          borderRadius: 6,
        }}
      >
        Double-click to add note
        <br />
        Alt+drag or middle mouse to pan
        <br />
        Ctrl+scroll to zoom · Drag dots to move · Drag right edge to resize width
      </div>

      {/* ── Grid background ── */}
      <svg
        className='absolute inset-0 pointer-events-none'
        width='100%'
        height='100%'
        xmlns='http://www.w3.org/2000/svg'>
        <defs>
          {/* Fine grid */}
          <pattern
            id='grid-small'
            x={transform.x % gridSmall}
            y={transform.y % gridSmall}
            width={gridSmall}
            height={gridSmall}
            patternUnits='userSpaceOnUse'>
            <path
              d={`M ${gridSmall} 0 L 0 0 0 ${gridSmall}`}
              fill='none'
              stroke='#1e1e1e'
              strokeWidth='0.5'
            />
          </pattern>

          {/* Accent grid — every 5 cells */}
          <pattern
            id='grid-large'
            x={transform.x % gridLarge}
            y={transform.y % gridLarge}
            width={gridLarge}
            height={gridLarge}
            patternUnits='userSpaceOnUse'>
            <path
              d={`M ${gridLarge} 0 L 0 0 0 ${gridLarge}`}
              fill='none'
              stroke='#2a2a2a'
              strokeWidth='1'
            />
          </pattern>
        </defs>

        <rect width='100%' height='100%' fill='url(#grid-small)' />
        <rect width='100%' height='100%' fill='url(#grid-large)' />
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
        }}>
        <span
          style={{
            fontSize: 11,
            color: '#666',
            backgroundColor: '#1a1a1a',
            padding: '3px 8px',
            borderRadius: 6,
            fontFamily: 'monospace',
          }}>
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
          }}>
          Reset
        </button>
      </div>

      {/* ── World container ── */}
      <div
        className='absolute'
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
        }}>
        {notes.map((note) => (
          <div
            key={note.id}
            className='canvas-note'
            style={{ position: 'relative', zIndex: note.id === activeNoteId ? 20 : 10 }}
          >
            <StickyNote
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onColorChange={changeColor}
              onDragStart={onNoteMouseDown}
              onResizeStart={onNoteResizeMouseDown}
              isActive={note.id === activeNoteId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
