import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, Transform } from '@/types/canvas';
import type { User } from '@supabase/supabase-js';

type CanvasState = {
  user: User | null;
  setUser: (user: User | null) => void;
  isSyncing: boolean;
  setIsSyncing: (syncing: boolean) => void;
  transform: Transform;
  notes: Note[];
  noteMode: 'sticky' | 'markdown';
  hasSeenHint: boolean;
  setTransform: (updater: (prev: Transform) => Transform) => void;
  resetView: () => void;
  setNotes: (updater: (prev: Note[]) => Note[]) => void;
  clearNotes: () => void;
  setNoteMode: (mode: 'sticky' | 'markdown') => void;
  setHasSeenHint: (seen: boolean) => void;
};

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      isSyncing: false,
      setIsSyncing: (syncing) => set({ isSyncing: syncing }),
      transform: { x: 0, y: 0, scale: 1 },
      notes: [],
      noteMode: 'sticky',
      hasSeenHint: false,
      setTransform: (updater) =>
        set((state) => ({
          transform: updater(state.transform),
        })),
      resetView: () =>
        set({
          transform: { x: 0, y: 0, scale: 1 },
        }),
      setNotes: (updater) =>
        set((state) => ({
          notes: updater(state.notes),
        })),
      clearNotes: () =>
        set({
          notes: [],
        }),
      setNoteMode: (mode) =>
        set({
          noteMode: mode,
        }),
      setHasSeenHint: (seen) =>
        set({
          hasSeenHint: seen,
        }),
    }),
    {
      name: 'canvas-store',
      // Don't persist user state to localStorage
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { user, isSyncing, ...rest } = state;
        return rest;
      },
    },
  ),
);
