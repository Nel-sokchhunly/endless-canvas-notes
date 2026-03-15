'use client';

import React, { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCanvasStore } from '@/store/canvasStore';
import { NOTE_COLORS } from '@/constants/colors';
import type { NoteColor } from '@/types/canvas';

interface MarkdownEditorProps {
  noteId: string;
  onClose: () => void;
}

function MarkdownEditor({ noteId, onClose }: MarkdownEditorProps) {
  const { notes, setNotes } = useCanvasStore();
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('edit');

  const note = notes.find((n) => n.id === noteId && n.kind === 'markdown');
  if (!note) return null;

  const handleTitleChange = (title: string) => {
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, title } : n)));
  };

  const handleMarkdownChange = (markdown: string) => {
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, markdown } : n)));
  };

  const handleColorChange = (color: NoteColor) => {
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, color } : n)));
  };

  const colors = NOTE_COLORS[note.color ?? 'yellow'];

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      className='animate-md-backdrop'
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        className='animate-md-modal'
        style={{
          width: 'min(720px, 96vw)',
          height: 'min(520px, 90vh)',
          backgroundColor: colors.base,
          borderRadius: 16,
          border: `1px solid ${colors.header}`,
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          padding: 16,
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <input
            autoFocus
            value={note.title ?? ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder='Note title'
            style={{
              flex: 1,
              marginRight: 8,
              backgroundColor: colors.header,
              borderRadius: 8,
              border: 'none',
              padding: '6px 10px',
              color: colors.text,
              fontSize: 15,
              outline: 'none',
            }}
          />
          <div
            style={{
              display: 'flex',
              gap: 4,
              marginRight: 8,
              alignItems: 'center',
            }}
          >
            {(Object.keys(NOTE_COLORS) as NoteColor[]).map((c) => (
              <button
                key={c}
                title={c}
                onClick={() => handleColorChange(c)}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: `1.5px solid ${NOTE_COLORS[c].accent}`,
                  backgroundColor: NOTE_COLORS[c].header,
                  cursor: 'pointer',
                  padding: 0,
                  outline: note.color === c ? `2px solid ${NOTE_COLORS[c].accent}` : 'none',
                  outlineOffset: 1,
                }}
              />
            ))}
          </div>
          <button
            onClick={() => setViewMode((m) => (m === 'edit' ? 'view' : 'edit'))}
            style={{
              fontSize: 11,
              color: colors.text,
              backgroundColor: viewMode === 'view' ? colors.header : colors.base,
              border: `1px solid ${colors.accent}`,
              padding: '4px 10px',
              borderRadius: 999,
              cursor: 'pointer',
              marginRight: 6,
            }}
          >
            {viewMode === 'edit' ? 'View' : 'Edit'}
          </button>
          <button
            onClick={onClose}
            style={{
              fontSize: 12,
              color: colors.text,
              backgroundColor: colors.base,
              border: `1px solid ${colors.accent}`,
              padding: '4px 10px',
              borderRadius: 999,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, marginTop: 4 }}>
          {viewMode === 'edit' ? (
            <textarea
              value={note.markdown ?? ''}
              onChange={(e) => handleMarkdownChange(e.target.value)}
              placeholder='Write markdown...'
              style={{
                width: '100%',
                height: '100%',
                resize: 'none',
                borderRadius: 10,
                border: `1px solid ${colors.accent}`,
                backgroundColor: colors.base,
                padding: '10px 12px',
                color: colors.text,
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: 13,
                lineHeight: 1.5,
                outline: 'none',
              }}
            />
          ) : (
            <div
              className='prose prose-sm max-w-none'
              style={
                {
                  width: '100%',
                  height: '100%',
                  borderRadius: 10,
                  border: `1px solid ${colors.accent}`,
                  backgroundColor: colors.base,
                  padding: '10px 12px',
                  color: colors.text,
                  fontSize: 13,
                  lineHeight: 1.5,
                  overflow: 'auto',
                  '--tw-prose-headings': colors.text,
                  '--tw-prose-body': colors.text,
                  '--tw-prose-bold': colors.text,
                  '--tw-prose-links': colors.accent,
                  '--tw-prose-lists': colors.text,
                  '--tw-prose-quotes': colors.text,
                  '--tw-prose-code': colors.text,
                } as React.CSSProperties
              }
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.markdown || 'Nothing here yet.'}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(MarkdownEditor);
