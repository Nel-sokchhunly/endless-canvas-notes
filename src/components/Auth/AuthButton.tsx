'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useCanvasStore } from '@/store/canvasStore';
import ConfirmDialog from '@/components/Canvas/ConfirmDialog';

export default function AuthButton() {
  const supabase = createClient();
  const { user } = useCanvasStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsConfirmOpen(false);
  };

  if (user) {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user.user_metadata.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.full_name || 'User'}
              style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #444' }}
            />
          )}
          <button
            onClick={() => setIsConfirmOpen(true)}
            style={{
              fontSize: 11,
              color: '#aaa',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              padding: '0 12px',
              height: 32,
              borderRadius: 8,
              cursor: 'pointer',
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
            Sign out
          </button>
        </div>

        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleSignOut}
          title='Sign out?'
          message='You will be signed out. Your notes are saved and will sync again when you sign back in.'
          confirmLabel='Sign out'
        />
      </>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      style={{
        fontSize: 11,
        color: '#fff',
        backgroundColor: '#24292e',
        border: '1px solid #444',
        padding: '0 12px',
        height: 32,
        borderRadius: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#2f363d';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#24292e';
      }}
    >
      <svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
      Sign in to sync notes
    </button>
  );
}
