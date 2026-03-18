'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import StickyNote from '@/components/StickyNote';
import type { NoteColor } from '@/types/canvas';
import { useCanvasStore } from '@/store/canvasStore';

// Sub-components
import BackgroundGrid from './BackgroundGrid';
import HUD from './HUD';
import HelpDialog from './HelpDialog';
import ConfirmDialog from './ConfirmDialog';
import MarkdownEditor from './MarkdownEditor';
import MarkdownNote from './MarkdownNote';
import AuthButton from '@/components/Auth/AuthButton';

const COLOR_CYCLE: NoteColor[] = ['yellow', 'blue', 'green', 'pink', 'purple'];

export default function Canvas() {
  const { transform, onMouseDown, onMouseMove, onMouseUp, onWheel, screenToWorld, resetView } =
    useCanvas();

  const { notes, setNotes, clearNotes, noteMode, setNoteMode, hasSeenHint, setHasSeenHint } =
    useCanvasStore();

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync hydration state
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Auto-show hint on first visit (persisted via Zustand)
  useEffect(() => {
    if (isHydrated && !hasSeenHint) {
      setIsHintOpen(true);
      setHasSeenHint(true);
    }
  }, [isHydrated, hasSeenHint, setHasSeenHint]);

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [editingMarkdownId, setEditingMarkdownId] = useState<string | null>(null);

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

  // Double-click to create a note
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('.canvas-note')) return;

      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;
      const world = screenToWorld(canvasX, canvasY);

      if (noteMode === 'markdown') {
        const id = crypto.randomUUID();
        setNotes((prev) => [
          ...prev,
          {
            id,
            kind: 'markdown',
            x: world.x - 120,
            y: world.y,
            text: '',
            title: 'New note',
            markdown: '',
            width: 240,
            color: COLOR_CYCLE[prev.length % COLOR_CYCLE.length],
            createdAt: Date.now(),
          },
        ]);
        setEditingMarkdownId(id);
        setActiveNoteId(id);
      } else {
        setNotes((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            kind: 'sticky',
            x: world.x - 100,
            y: world.y,
            text: '',
            width: 200,
            color: COLOR_CYCLE[prev.length % COLOR_CYCLE.length],
            rotation: parseFloat((Math.random() * 4 - 2).toFixed(2)),
            createdAt: Date.now(),
          },
        ]);
      }
    },
    [noteMode, screenToWorld, setNotes],
  );

  const updateNote = useCallback(
    (id: string, text: string, height?: number) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text, height } : n)));
    },
    [setNotes],
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotes],
  );

  const changeColor = useCallback(
    (id: string, color: NoteColor) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, color } : n)));
    },
    [setNotes],
  );

  const onNoteMouseDown = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      e.preventDefault();
      setActiveNoteId(id);

      const t = transformRef.current;
      const startScreenX = e.clientX;
      const startScreenY = e.clientY;

      setNotes((prev) => {
        const note = prev.find((n) => n.id === id);
        if (!note) return prev;

        const startNoteX = note.x;
        const startNoteY = note.y;

        const onMove = (ev: MouseEvent) => {
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

        return prev;
      });
    },
    [setNotes],
  );

  const onNoteResizeMouseDown = useCallback(
    (e: React.MouseEvent, id: string) => {
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
          setNotes((all) => all.map((n) => (n.id === id ? { ...n, width: nextWidth } : n)));
        };

        const onUp = () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        return prev;
      });
    },
    [setNotes],
  );

  // Prevent flash by not rendering until hydrated
  if (!isHydrated) return null;

  return (
    <div
      className='relative overflow-hidden'
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f8f8f8',
        cursor: 'default',
        touchAction: 'none',
        userSelect: 'none',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
      onDoubleClick={handleDoubleClick}>
      <BackgroundGrid transform={transform} />

      {/* ── Auth Button ── */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
        }}>
        <AuthButton />
      </div>

      <HUD
        transform={transform}
        noteMode={noteMode}
        setNoteMode={setNoteMode}
        onHintClick={() => setIsHintOpen(true)}
        onClearClick={() => notes.length > 0 && setIsClearConfirmOpen(true)}
        onResetClick={resetView}
        notesCount={notes.length}
      />

      <div
        className='absolute'
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}>
        {notes.map((note) =>
          note.kind === 'markdown' ? (
            <MarkdownNote
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onMouseDown={onNoteMouseDown}
              onEditClick={(id) => {
                setEditingMarkdownId(id);
                setActiveNoteId(id);
              }}
              onDeleteClick={deleteNote}
            />
          ) : (
            <div
              key={note.id}
              className='canvas-note'
              style={{ position: 'relative', zIndex: note.id === activeNoteId ? 20 : 10 }}>
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
          ),
        )}
      </div>

      <HelpDialog isOpen={isHintOpen} onClose={() => setIsHintOpen(false)} />

      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={() => {
          clearNotes();
          setIsClearConfirmOpen(false);
        }}
        title='Clear all notes?'
        message='This will permanently delete all notes on the canvas. This action cannot be undone.'
      />

      {editingMarkdownId && (
        <MarkdownEditor noteId={editingMarkdownId} onClose={() => setEditingMarkdownId(null)} />
      )}
    </div>
  );
}
