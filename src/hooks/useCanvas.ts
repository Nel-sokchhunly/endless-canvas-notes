import { useRef, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/store/canvasStore';

const MIN_SCALE = 0.05;
const MAX_SCALE = 10;
const ZOOM_LERP = 0.15;
const MOUSE_WHEEL_DELTA_THRESHOLD = 50;
const MOUSE_WHEEL_SENSITIVITY = 0.003;
const TRACKPAD_SENSITIVITY = 0.005;

function clampScale(s: number) {
  return Math.min(Math.max(s, MIN_SCALE), MAX_SCALE);
}

export function useCanvas() {
  const { transform, setTransform, resetView: storeResetView } = useCanvasStore();
  const isPanning = useRef(false);
  const isSpacePressed = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const targetScaleRef = useRef(transform.scale);
  const zoomCenterRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);

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

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && isSpacePressed.current) {
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

  const animateZoom = useCallback(() => {
    setTransform(t => {
      const target = targetScaleRef.current;
      const diff = target - t.scale;

      if (Math.abs(diff) < 0.001) {
        animFrameRef.current = 0;
        if (Math.abs(diff) < 0.0001) return t;
        const ratio = target / t.scale;
        const { x: mx, y: my } = zoomCenterRef.current;
        return { scale: target, x: mx - (mx - t.x) * ratio, y: my - (my - t.y) * ratio };
      }

      const newScale = clampScale(t.scale + diff * ZOOM_LERP);
      const ratio = newScale / t.scale;
      const { x: mx, y: my } = zoomCenterRef.current;
      animFrameRef.current = requestAnimationFrame(animateZoom);
      return { scale: newScale, x: mx - (mx - t.x) * ratio, y: my - (my - t.y) * ratio };
    });
  }, [setTransform]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) {
      setTransform(t => ({ ...t, x: t.x - e.deltaX, y: t.y - e.deltaY }));
      return;
    }

    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const isDiscreteWheel =
      e.deltaMode === 1 || (e.deltaMode === 0 && Math.abs(e.deltaY) >= MOUSE_WHEEL_DELTA_THRESHOLD);

    if (isDiscreteWheel) {
      const capped = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120);
      const factor = Math.exp(-capped * MOUSE_WHEEL_SENSITIVITY);
      targetScaleRef.current = clampScale(targetScaleRef.current * factor);
      zoomCenterRef.current = { x: mouseX, y: mouseY };

      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(animateZoom);
      }
    } else {
      const factor = Math.exp(-e.deltaY * TRACKPAD_SENSITIVITY);
      setTransform(t => {
        const newScale = clampScale(t.scale * factor);
        const ratio = newScale / t.scale;
        targetScaleRef.current = newScale;
        return { scale: newScale, x: mouseX - (mouseX - t.x) * ratio, y: mouseY - (mouseY - t.y) * ratio };
      });
    }
  }, [setTransform, animateZoom]);

  const resetView = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    targetScaleRef.current = 1;
    storeResetView();
  }, [storeResetView]);

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

