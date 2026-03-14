import { useRef, useCallback } from 'react';
import { useCanvasStore } from '@/store/canvasStore';

export function useCanvas() {
  const { transform, setTransform, resetView } = useCanvasStore();
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle mouse OR Alt + left click
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      isPanning.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom toward cursor with smoother scaling
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Use an exponential factor based on delta for smoother zoom
      const factor = Math.exp(-e.deltaY * 0.001);

      setTransform(t => {
        const rawScale = t.scale * factor;
        const newScale = Math.min(Math.max(rawScale, 0.1), 5);
        const scaleRatio = newScale / t.scale;

        return {
          scale: newScale,
          x: mouseX - (mouseX - t.x) * scaleRatio,
          y: mouseY - (mouseY - t.y) * scaleRatio,
        };
      });
    } else {
      setTransform(t => ({ ...t, x: t.x - e.deltaX, y: t.y - e.deltaY }));
    }
  }, []);

  const screenToWorld = useCallback(
    (sx: number, sy: number) => ({
      x: (sx - transform.x) / transform.scale,
      y: (sy - transform.y) / transform.scale,
    }),
    [transform]
  );

  return {
    transform,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    screenToWorld,
    resetView,
  };
}

