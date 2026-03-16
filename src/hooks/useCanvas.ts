import { useRef, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/store/canvasStore';

export function useCanvas() {
  const { transform, setTransform, resetView } = useCanvasStore();
  const isPanning = useRef(false);
  const isSpacePressed = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') isSpacePressed.current = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') isSpacePressed.current = false;
    };
    const onWindowBlur = () => {
      isSpacePressed.current = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onWindowBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onWindowBlur);
    };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle mouse OR Space + left click
    if (e.button === 1 || (e.button === 0 && isSpacePressed.current)) {
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
    // If we're not zooming, just pan
    if (!e.ctrlKey && !e.metaKey) {
      setTransform(t => ({ ...t, x: t.x - e.deltaX, y: t.y - e.deltaY }));
      return;
    }

    // Zooming toward cursor
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Increase sensitivity: 0.005 is generally a good balance for both trackpads and mice
    const factor = Math.exp(-e.deltaY * 0.005);

    setTransform(t => {
      const rawScale = t.scale * factor;
      // Keep reasonable limits, but allow the calculation to feel "fast"
      const newScale = Math.min(Math.max(rawScale, 0.05), 10);
      const scaleRatio = newScale / t.scale;

      return {
        scale: newScale,
        x: mouseX - (mouseX - t.x) * scaleRatio,
        y: mouseY - (mouseY - t.y) * scaleRatio,
      };
    });
  }, [setTransform]);

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

