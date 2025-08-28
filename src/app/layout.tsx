/**
 * @file src/app/layout.tsx
 * @description The root layout for the entire application.
 *              This component wraps all pages, providing a consistent HTML structure,
 *              loading global stylesheets, and setting up fonts.
 */
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import AnimatedBackground from "@/components/animated-background"
import MainNav from '@/components/main-nav';

// Define metadata for the website, used for SEO and browser tab information.
export const metadata: Metadata = {
  metadataBase: new URL('https://akshayabraham.vercel.app'),
  title: 'Akshay K Rooben Abraham | Aspirant Theoretical Physicist',
  description: 'The personal portfolio of Akshay K Rooben Abraham, an aspiring theoretical physicist, PCMB student, and open-source contributor exploring the intersection of science and technology.',
  keywords: [
    'Akshay Abraham',
    'Akshay K Rooben Abraham',
    'Akshay K Ruben Abraham',
    'Theoretical Physicist',
    'Portfolio',
    'Next.js',
    'React',
    'TypeScript',
    'PCMB Student',
    'Open Source'
  ],
  openGraph: {
    title: 'Akshay K Rooben Abraham | Personal Portfolio',
    description: 'Aspirant Theoretical Physicist · PCMB Student · Open-Source Contributor',
    url: 'https://akshayabraham.vercel.app',
    siteName: 'Akshay Abraham Portfolio',
    images: [
      {
        url: 'https://akshayabraham.vercel.app/og-image.png', // Must be an absolute URL
        width: 1200,
        height: 630,
        alt: 'Akshay Abraham Personal Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
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
  alternates: {
    canonical: 'https://akshayabraham.vercel.app',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Akshay K Rooben Abraham',
  alternateName: ['Akshay Abraham', 'Akshay K Ruben Abraham'],
  url: 'https://akshayabraham.vercel.app',
  jobTitle: 'Aspirant Theoretical Physicist & PCMB Student',
  worksFor: {
    '@type': 'Organization',
    name: 'Girideepam Bethany Central School',
  },
  sameAs: [
    'https://www.linkedin.com/in/akshayabraham37/',
    'https://github.com/akshay-abraham/',
    'https://www.instagram.com/akshay.abraham/',
  ],
};

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
        {/* Preconnect to Google Fonts for performance optimization. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Import the "Space Grotesk" font stylesheet. */}
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <meta name="google-site-verification" content="-ggF-eMSfmD9YH-4yLzcQDEjUmv9WBmZuwxjsFAHifA" />
         {/* Add JSON-LD to the head */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
          {/* The AnimatedBackground component is rendered here to appear on all pages. */}
          <AnimatedBackground />
          <MainNav />
          {/* Renders the active page content. */}
          <main>{children}</main>
          {/* The Toaster component handles pop-up notifications (e.g., for errors or confirmations). */}
          <Toaster />
      </body>
    </html>
  );
}
