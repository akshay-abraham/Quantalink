/**
 * @file src/app/skills/page.tsx
 * @description The dedicated page for showcasing a detailed breakdown of technical skills.
 *              This is a Server Component that handles metadata and wraps the client-side
 *              component responsible for rendering the animated content.
 */
import PageFooter from '@/components/page-footer';
import SkillsClientPage from '@/components/skills-client-page';
import type { Metadata } from 'next';

// Page-specific metadata for SEO.
export const metadata: Metadata = {
  title: 'Skills & Technologies | Akshay K Rooben Abraham',
  description: 'A detailed look at the languages, frameworks, tools, and platforms I work with, including Python, React, Next.js, and various developer tools.',
  // Provides the canonical URL for this page.
  alternates: {
    canonical: '/skills',
  },
};

/**
 * The SkillsPage Server Component. It sets up the page structure and metadata.
 * @returns {JSX.Element} The rendered skills page.
 */
export default function SkillsPage() {
  return (
    <div className="relative z-10 flex min-h-screen w-full flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl flex-grow">
        <header className="mb-12 pt-20 text-center">
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            Skills & Technologies
          </h1>
           <p className="text-foreground/70 mt-4 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            I am currently learning backend technologies to integrate with my future physics aspirations. On the frontend, I have a strong theoretical foundation from courses like CS50W, but I primarily engage in "vibe coding" with significant help from Gemini for generation and ChatGPT for debugging.
          </p>
        </header>

        <main className="space-y-16">
          {/* Renders the client component that handles the interactive parts. */}
          <SkillsClientPage />
        </main>

      </div>
      <PageFooter />
    </div>
  );
}
