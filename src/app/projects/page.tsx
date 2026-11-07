import PageFooter from '@/components/page-footer';
import Projects from '@/components/projects';
import type { Metadata } from 'next';
import { pageSocialMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Projects by Akshay Abraham',
  description:
    'Explore projects by Akshay Abraham (Akshay K Rooben Abraham), including Lyra, Mitra, MNEMO, Driver Guard, M57, and NEPHRA.',
  alternates: { canonical: '/projects' },
  ...pageSocialMetadata(
    'Projects by Akshay Abraham',
    'Explore Lyra, Mitra, MNEMO, and other projects built by Akshay Abraham.',
    '/projects'
  ),
};

export default function ProjectsPage() {
  return (
    <div className="site-shell inner-page relative z-10">
      <header className="journey-header">
        <p className="eyebrow">Out of the sketchbook</p>
        <h1>Projects.</h1>
        <p className="page-intro">
          Some are out in the world. Some are still finding their feet. Source
          code is linked where it’s public.
        </p>
      </header>
      <Projects />
      <PageFooter />
    </div>
  );
}
