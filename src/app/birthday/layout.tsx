/**
 * @file src/app/birthday/layout.tsx
 * @description A custom layout for the birthday page.
 *              This layout is nearly identical to the root layout but specifically
 *              omits the <GuidedTour /> component to provide a focused experience.
 */
import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster"
import AnimatedBackground from "@/components/animated-background"
import MainNav from '@/components/main-nav';
import GlobalPetRenderer from '@/components/global-pet-renderer';
import { Analytics } from '@vercel/analytics/react';

// Use the same metadata as the root layout as a base.
export const metadata: Metadata = {
  title: 'A Timed Anomaly',
  description: 'A special message has been prepared for a specific moment in spacetime. Is it for you? Is it for today?',
   openGraph: {
    title: 'A Timed Anomaly',
    description: 'A special message prepared for a specific moment in spacetime.',
    url: 'https://akshayabraham.vercel.app/birthday',
    siteName: 'Akshay Abraham Portfolio',
    images: [
      {
        url: 'https://akshayabraham.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'A mysterious message from Akshay Abraham',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A Timed Anomaly',
    description: 'A special message prepared for a specific moment in spacetime.',
    images: ['https://akshayabraham.vercel.app/og-image.png'],
  },
};

/**
 * BirthdayLayout component serves as the template for the /birthday route.
 * @param {Readonly<{ children: React.ReactNode }>} props - The props object.
 * @returns {JSX.Element} The HTML structure for the birthday page.
 */
export default function BirthdayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
          <AnimatedBackground />
          <GlobalPetRenderer />
          <div id="pet-container"></div>
          <MainNav />
          <main>{children}</main>
          <Toaster />
          <Analytics />
      </body>
    </html>
  );
}
