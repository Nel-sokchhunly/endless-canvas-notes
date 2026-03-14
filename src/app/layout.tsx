import type { ReactNode } from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Endless Canvas',
  description: 'Infinite sticky-note canvas with pan and zoom',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}

