'use client';

import React, { memo } from 'react';
import { Transform } from '@/types/canvas';

interface BackgroundGridProps {
  transform: Transform;
}

function BackgroundGrid({ transform }: BackgroundGridProps) {
  return (
    <div
      className='absolute inset-0 pointer-events-none'
      style={{
        backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.18) 1.2px, transparent 1.2px)',
        backgroundSize: `${20 * transform.scale}px ${20 * transform.scale}px`,
        backgroundPosition: `${transform.x}px ${transform.y}px`,
      }}
    />
  );
}

export default memo(BackgroundGrid);
