export type Transform = {
  x: number;
  y: number;
  scale: number;
};

export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

export type Note = {
  id: string;
  x: number;
  y: number;
  text: string;
  // 'sticky' is default; 'markdown' uses title/markdown below
  kind?: 'sticky' | 'markdown';
  title?: string;
  markdown?: string;
  width?: number;
  height?: number;
  color?: NoteColor;
  rotation?: number; // degrees, e.g. -2 to 2
  createdAt?: number; // Date.now()
};

