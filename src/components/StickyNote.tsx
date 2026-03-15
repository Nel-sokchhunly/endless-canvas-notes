'use client';

import React, { memo } from 'react';
import type { Note, NoteColor } from '@/types/canvas';
import { NOTE_COLORS } from '@/constants/colors';

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: NoteColor) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
  onResizeStart: (e: React.MouseEvent, id: string) => void;
  isActive: boolean;
}

function StickyNote({
  note,
  onUpdate,
  onDelete,
  onColorChange,
  onDragStart,
  onResizeStart,
  isActive,
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
      className="group"
      style={{
        position: 'absolute',
        left: note.x,
        top: note.y,
        width: note.width ?? 200,
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
        style={{
          padding: '8px 10px 6px',
          borderRadius: '2px 12px 0 0',
          backgroundColor: color.header,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: 6,
        }}
      >
        {/* Grip dots — drag handle (grab → grabbing while active) */}
        <div
          style={{ display: 'flex', gap: 3, cursor: isActive ? 'grabbing' : 'grab' }}
          onMouseDown={e => {
            e.stopPropagation();
            onDragStart(e, note.id);
          }}
        >
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
            opacity: 0.75,
          }}
        >
          ✕
        </button>
      </div>

      {/* Text area */}
      <textarea
        value={note.text}
        placeholder="Type something..."
        onChange={e => {
          const el = e.currentTarget;
          el.style.height = 'auto';
          el.style.height = `${el.scrollHeight}px`;
          onUpdate(note.id, e.target.value);
        }}
        onMouseDown={e => e.stopPropagation()}
        rows={1}
        style={{
          padding: '10px 12px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          overflow: 'hidden',
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          fontSize: 13,
          lineHeight: 1.55,
          color: color.text,
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

      {/* Resize handle (right edge) — drag to change width */}
      <div
        onMouseDown={e => {
          e.stopPropagation();
          onResizeStart(e, note.id);
        }}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 10,
          cursor: 'ew-resize',
          backgroundColor: 'transparent',
        }}
        title="Drag to resize width"
      />
    </div>
  );
}

export default memo(StickyNote);
