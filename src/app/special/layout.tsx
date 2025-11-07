/**
 * @file src/app/special/layout.tsx
 * @description A custom layout for the special page.
 *              This layout is nearly identical to the root layout but specifically
 *              omits the <GuidedTour /> component to provide a focused experience.
 *              It also imports a custom font for the special event cards.
 */
import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster"
import AnimatedBackground from "@/components/animated-background"
import MainNav from '@/components/main-nav';
import GlobalPetRenderer from '@/components/global-pet-renderer';
import { Analytics } from '@vercel/analytics/react';

// Metadata is now handled in the page.tsx file for more dynamic control.

/**
 * SpecialLayout component serves as the template for the /special route.
 * @param {Readonly<{ children: React.ReactNode }>} props - The props object.
 * @returns {JSX.Element} The HTML structure for the special page.
 */
export default function SpecialLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Import the "Space Grotesk" font for the main site and "Lobster" for the special cards. */}
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Lobster&display=swap" rel="stylesheet" />
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
