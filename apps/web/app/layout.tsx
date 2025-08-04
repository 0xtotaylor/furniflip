import type { Viewport } from 'next';
import { Providers } from './providers';

import './globals.css';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

export const metadata = {
  title: 'FurniFlip - AI-enabled furniture sales',
  description:
    'FurniFlip transforms photos of your furniture into professional, catalogs in seconds. We can sell your furniture for you too.'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
