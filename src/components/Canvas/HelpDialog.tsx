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
