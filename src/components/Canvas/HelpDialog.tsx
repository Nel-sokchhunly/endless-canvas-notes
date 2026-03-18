'use client';

import React, { memo } from 'react';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={onClose}
      className='animate-md-backdrop'
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        backdropFilter: 'blur(2px)',
        cursor: 'default',
      }}
    >
      <div
        className='animate-md-modal'
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 380,
          backgroundColor: '#1a1a1a',
          borderRadius: 16,
          border: '1px solid #2a2a2a',
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#eee', margin: 0, fontSize: 18, fontWeight: 600 }}>Controls</h3>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: 18,
              cursor: 'pointer',
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '110px 1fr 1fr',
            gap: '12px 10px',
            alignItems: 'center',
          }}
        >
          {/* Header */}
          <span style={{ fontSize: 10, color: '#555', fontWeight: 600, textTransform: 'uppercase' }}>
            Action
          </span>
          <span style={{ fontSize: 10, color: '#555', fontWeight: 600, textTransform: 'uppercase' }}>
            Mouse
          </span>
          <span style={{ fontSize: 10, color: '#555', fontWeight: 600, textTransform: 'uppercase' }}>
            Trackpad
          </span>

          {/* Rows */}
          <span style={{ color: '#888', fontSize: 12 }}>Create Note</span>
          <span
            style={{
              gridColumn: 'span 2',
              backgroundColor: '#2a2a2a',
              color: '#aaa',
              padding: '3px 4px',
              borderRadius: 4,
              fontSize: 9,
              fontFamily: 'monospace',
              textAlign: 'center',
            }}
          >
            DOUBLE CLICK
          </span>

          <span style={{ color: '#888', fontSize: 12 }}>Pan Canvas</span>
          <span
            style={{
              backgroundColor: '#2a2a2a',
              color: '#aaa',
              padding: '3px 4px',
              borderRadius: 4,
              fontSize: 9,
              fontFamily: 'monospace',
              textAlign: 'center',
            }}
          >
            SPACE + DRAG
          </span>
          <span
            style={{
              backgroundColor: '#2a2a2a',
              color: '#aaa',
              padding: '3px 4px',
              borderRadius: 4,
              fontSize: 9,
              fontFamily: 'monospace',
              textAlign: 'center',
            }}
          >
            2-FGR SCROLL
          </span>

          <span style={{ color: '#888', fontSize: 12 }}>Zoom</span>
          <span
            style={{
              backgroundColor: '#2a2a2a',
              color: '#aaa',
              padding: '3px 4px',
              borderRadius: 4,
              fontSize: 9,
              fontFamily: 'monospace',
              textAlign: 'center',
            }}
          >
            CTRL + WHEEL
          </span>
          <span
            style={{
              backgroundColor: '#2a2a2a',
              color: '#aaa',
              padding: '3px 4px',
              borderRadius: 4,
              fontSize: 9,
              fontFamily: 'monospace',
              textAlign: 'center',
            }}
          >
            PINCH
          </span>

          <span style={{ color: '#888', fontSize: 12 }}>Move Note</span>
          <span
            style={{
              gridColumn: 'span 2',
              backgroundColor: '#2a2a2a',
              color: '#aaa',
              padding: '3px 4px',
              borderRadius: 4,
              fontSize: 9,
              fontFamily: 'monospace',
              textAlign: 'center',
            }}
          >
            DRAG DOTS
          </span>

          <span style={{ color: '#888', fontSize: 12 }}>Resize Width</span>
          <span
            style={{
              gridColumn: 'span 2',
              backgroundColor: '#2a2a2a',
              color: '#aaa',
              padding: '3px 4px',
              borderRadius: 4,
              fontSize: 9,
              fontFamily: 'monospace',
              textAlign: 'center',
            }}
          >
            RIGHT EDGE
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#141414',
            border: '1px solid #2a2a2a',
            borderRadius: 10,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <svg height="14" viewBox="0 0 16 16" width="14" fill="#555" style={{ flexShrink: 0 }}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span style={{ fontSize: 11, color: '#666', lineHeight: 1.5 }}>
            Sign in with GitHub to sync your notes across devices.
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 10,
            border: 'none',
            backgroundColor: '#2a2a2a',
            color: '#eee',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginTop: 8,
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#333')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default memo(HelpDialog);
