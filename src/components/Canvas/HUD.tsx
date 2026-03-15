'use client';

import React, { memo } from 'react';
import { Transform } from '@/types/canvas';

interface HUDProps {
  transform: Transform;
  noteMode: 'sticky' | 'markdown';
  setNoteMode: (mode: 'sticky' | 'markdown') => void;
  onHintClick: () => void;
  onClearClick: () => void;
  onResetClick: () => void;
  notesCount: number;
}

function HUD({
  transform,
  noteMode,
  setNoteMode,
  onHintClick,
  onClearClick,
  onResetClick,
  notesCount,
}: HUDProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        display: 'flex',
        gap: 12,
        zIndex: 10,
        alignItems: 'center',
        height: 32,
      }}
    >
      <button
        onClick={onHintClick}
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#aaa',
          backgroundColor: '#1a1a1a',
          border: '1px solid #2a2a2a',
          width: 32,
          height: 32,
          borderRadius: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#333';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = '#444';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a';
          e.currentTarget.style.color = '#aaa';
          e.currentTarget.style.borderColor = '#2a2a2a';
        }}
        title="Controls Help"
      >
        ?
      </button>

      <span
        style={{
          fontSize: 11,
          color: '#aaa',
          backgroundColor: '#1a1a1a',
          border: '1px solid #2a2a2a',
          padding: '0 10px',
          borderRadius: 8,
          fontFamily: 'monospace',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {Math.round(transform.scale * 100)}%
      </span>

      <div
        style={{
          display: 'flex',
          backgroundColor: '#1a1a1a',
          border: '1px solid #2a2a2a',
          padding: 2,
          borderRadius: 8,
          position: 'relative',
          width: 160,
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            bottom: 2,
            left: 2,
            width: 77,
            backgroundColor: '#facc15', // Vibrant yellow highlight
            borderRadius: 6,
            transform: `translateX(${noteMode === 'sticky' ? 0 : 77}px)`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 0,
          }}
        />
        <button
          onClick={() => setNoteMode('sticky')}
          style={{
            width: 78,
            fontSize: 11,
            fontWeight: 600,
            color: noteMode === 'sticky' ? '#3f2d00' : '#888', // Dark text on yellow, gray on dark
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            borderRadius: 6,
            cursor: 'pointer',
            zIndex: 1,
            transition: 'color 0.2s',
            textAlign: 'center',
            height: '100%',
          }}
          onMouseOver={(e) => {
            if (noteMode !== 'sticky') e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            if (noteMode !== 'sticky') e.currentTarget.style.color = '#888';
          }}
        >
          Sticky
        </button>
        <button
          onClick={() => setNoteMode('markdown')}
          style={{
            width: 78,
            fontSize: 11,
            fontWeight: 600,
            color: noteMode === 'markdown' ? '#3f2d00' : '#888',
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            borderRadius: 6,
            cursor: 'pointer',
            zIndex: 1,
            transition: 'color 0.2s',
            textAlign: 'center',
            height: '100%',
          }}
          onMouseOver={(e) => {
            if (noteMode !== 'markdown') e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            if (noteMode !== 'markdown') e.currentTarget.style.color = '#888';
          }}
        >
          Markdown
        </button>
      </div>

      <button
        onClick={onResetClick}
        style={{
          fontSize: 11,
          color: '#aaa',
          backgroundColor: '#1a1a1a',
          border: '1px solid #2a2a2a',
          padding: '0 12px',
          borderRadius: 8,
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#333';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = '#444';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a';
          e.currentTarget.style.color = '#aaa';
          e.currentTarget.style.borderColor = '#2a2a2a';
        }}
      >
        Reset
      </button>

      <button
        onClick={onClearClick}
        style={{
          fontSize: 11,
          color: notesCount > 0 ? '#ff5555' : '#555',
          backgroundColor: '#1a1a1a',
          border: '1px solid #2a2a2a',
          padding: '0 12px',
          borderRadius: 8,
          cursor: notesCount > 0 ? 'pointer' : 'default',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
          opacity: notesCount > 0 ? 1 : 0.5,
        }}
        onMouseOver={(e) => {
          if (notesCount > 0) {
            e.currentTarget.style.backgroundColor = '#ff4444';
            e.currentTarget.style.borderColor = '#ff4444';
            e.currentTarget.style.color = '#fff';
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a';
          e.currentTarget.style.borderColor = '#2a2a2a';
          e.currentTarget.style.color = notesCount > 0 ? '#ff5555' : '#555';
        }}
      >
        Clear
      </button>
    </div>
  );
}

export default memo(HUD);
