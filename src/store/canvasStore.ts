import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, Transform } from '@/types/canvas';

type CanvasState = {
  transform: Transform;
  notes: Note[];
  setTransform: (updater: (prev: Transform) => Transform) => void;
  resetView: () => void;
  setNotes: (updater: (prev: Note[]) => Note[]) => void;
};

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set) => ({
      transform: { x: 0, y: 0, scale: 1 },
      notes: [],
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
    }),
    {
      name: 'canvas-store',
    },
  ),
);

