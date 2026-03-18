'use client';

import React, { memo } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
}

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Clear All' }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
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
      }}
    >
      <div
        className='animate-md-modal'
        style={{
          width: 340,
          backgroundColor: '#1a1a1a',
          borderRadius: 16,
          border: '1px solid #2a2a2a',
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          textAlign: 'center',
        }}
      >
        <h3 style={{ color: '#eee', margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h3>
        <p style={{ color: '#888', margin: 0, fontSize: 13, lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 10,
              border: '1px solid #2a2a2a',
              backgroundColor: 'transparent',
              color: '#aaa',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#252525')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 10,
              border: 'none',
              backgroundColor: '#ff4444',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#ff2222')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ff4444')}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ConfirmDialog);
