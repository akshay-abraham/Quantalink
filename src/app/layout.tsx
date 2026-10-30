/**
 * @file src/app/layout.tsx
 * @description The root layout for the entire application.
 *              This component wraps all pages, providing a consistent HTML structure,
 *              loading global stylesheets and fonts, and setting up metadata for SEO.
 */
import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import AnimatedBackground from '@/components/animated-background';
import MainNav from '@/components/main-nav';
import GlobalPetRenderer from '@/components/global-pet-renderer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import {
  pageSocialMetadata,
  personJsonLd,
  siteUrl,
  websiteJsonLd,
} from '@/lib/seo';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Define metadata for the website, used for SEO and browser tab information.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Akshay Abraham | Student & Builder',
  description:
    'Meet Akshay Abraham (Akshay K Rooben Abraham), a student and builder from Kottayam creating Lyra, MNEMO, and Mitra. Explore his projects, skills, and journey.',
  authors: [{ name: 'Akshay Abraham', url: siteUrl }],
  creator: 'Akshay Abraham',
  keywords: [
    'Akshay Abraham',
    'Akshay K Rooben Abraham',
    'Portfolio',
    'Next.js',
    'React',
    'TypeScript',
    'PCMB Student',
    'Open Source',
    'Lyra',
    'AI Builder',
  ],
  ...pageSocialMetadata(
    'Akshay Abraham | Student & Builder',
    'Explore the projects, skills, and journey of Akshay Abraham, a student and builder from Kottayam.',
    '/'
  ),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Sets the canonical URL for the root of the site.
  alternates: {
    canonical: '/',
  },
};

// JSON-LD structured data for rich search results (Google).
const jsonLd = personJsonLd;

/**
 * RootLayout component that serves as the main template for all pages.
 * @param {Readonly<{ children: React.ReactNode }>} props - The props object.
 * @param {React.ReactNode} props.children - The child components to be rendered within this layout (i.e., the page content).
 * @returns {JSX.Element} The root HTML structure of the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The `suppressHydrationWarning` is used because the animated background can cause
    // minor mismatches on initial load, which is acceptable for this decorative element.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="google-site-verification"
          content="-ggF-eMSfmD9YH-4yLzcQDEjUmv9WBmZuwxjsFAHifA"
        />
        {/* Add JSON-LD to the head to provide structured data to search engines. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        {/* The AnimatedBackground component is rendered here to appear on all pages. */}
        <AnimatedBackground />
        {/* This component renders the roaming pet if one is active in the global state. */}
        <GlobalPetRenderer />
        {/* This div is the portal target for the roaming pet. */}
        <div id="pet-container"></div>
        <MainNav />
        {/* Renders the active page content. */}
        <main id="main-content">{children}</main>
        {/* The Toaster component handles pop-up notifications. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
