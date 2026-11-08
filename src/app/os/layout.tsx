import type { Metadata, Viewport } from 'next';
import font from 'next/font/local';
import '../../tahoe/app/globals.css';

export const metadata: Metadata = {
  title: 'Akshay Tahoe desktop',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const sf = font({
  src: '../../../public/fonts/SF-Pro.woff2',
  weight: '1 1000',
  variable: '--font-sf',
});

const sfMono = font({
  src: '../../../public/fonts/SF-Mono.woff2',
  weight: '300 900',
  variable: '--font-sf-mono',
});

export default function TahoeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sf.variable} ${sfMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
