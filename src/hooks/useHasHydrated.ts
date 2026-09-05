import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/store/canvasStore';

/**
 * Reading from IndexedDB is async, so the store starts empty and fills in a
 * tick later. Components wait on this before rendering persisted state.
 */
export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useCanvasStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    const unsubFinish = useCanvasStore.persist.onFinishHydration(() => setHydrated(true));
    return () => unsubFinish();
  }, []);

  return hydrated;
}
