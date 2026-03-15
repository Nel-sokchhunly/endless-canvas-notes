import type { ReactNode } from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Endless Canvas | Infinite Sticky-Note Board',
  description: 'An infinite digital canvas for brainstorming and organization. Create, drag, and zoom sticky notes with a seamless grid background.',
  keywords: ['infinite canvas', 'sticky notes', 'brainstorming', 'digital whiteboard', 'productivity', 'nextjs', 'react'],
  authors: [{ name: 'Endless Canvas Team' }],
  creator: 'Endless Canvas',
  publisher: 'Endless Canvas',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://endless-canvas.vercel.app'), // Update this with your actual production URL
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Endless Canvas | Infinite Sticky-Note Board',
    description: 'An infinite digital canvas for brainstorming and organization. Create, drag, and zoom sticky notes.',
    url: 'https://endless-canvas.vercel.app',
    siteName: 'Endless Canvas',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Endless Canvas | Infinite Sticky-Note Board',
    description: 'An infinite digital canvas for brainstorming and organization.',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
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

