'use client';

import React, { memo } from 'react';
import type { Note } from '@/types/canvas';
import { NOTE_COLORS } from '@/constants/colors';

interface MarkdownNoteProps {
  note: Note;
  isActive: boolean;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

function MarkdownNote({
  note,
  isActive,
  onMouseDown,
  onEditClick,
  onDeleteClick,
}: MarkdownNoteProps) {
  const colors = NOTE_COLORS[note.color ?? 'yellow'];

  return (
    <div
      className='canvas-note'
      style={{
        position: 'absolute',
        left: note.x,
        top: note.y,
        zIndex: isActive ? 20 : 10,
        width: note.width ?? 220,
        minHeight: 80,
        borderRadius: '2px 12px 12px 12px',
        backgroundColor: colors.base,
        boxShadow: '2px 4px 14px rgba(0,0,0,0.13)',
        cursor: 'pointer',
      }}
    >
      <div
        onMouseDown={(e) => onMouseDown(e, note.id)}
        style={{
          padding: '6px 10px 5px',
          borderRadius: '2px 12px 0 0',
          backgroundColor: colors.header,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          cursor: 'grab',
        }}
      >
        <span
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.08,
            color: colors.text,
            opacity: 0.8,
          }}
        >
          MD
        </span>
        <span
          style={{
            fontSize: 11,
            color: colors.text,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            textAlign: 'right',
          }}
        >
          {note.title || 'Untitled'}
        </span>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onEditClick(note.id);
          }}
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: colors.text,
            backgroundColor: 'rgba(0,0,0,0.05)',
            border: 'none',
            padding: '2px 6px',
            borderRadius: 4,
            cursor: 'pointer',
            marginLeft: 4,
          }}
        >
          EDIT
        </button>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(note.id);
          }}
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: 'none',
            backgroundColor: colors.header,
            color: colors.text,
            fontSize: 9,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 2,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default memo(MarkdownNote);
