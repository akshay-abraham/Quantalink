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
        <p className="eyebrow">A few things I’m working on</p>
        <h1>Projects.</h1>
        <p className="page-intro">
          Learning, care, knowledge, and a few experiments along the way. Public
          source code is linked where available.
        </p>
      </header>
      <Projects />
      <PageFooter />
    </div>
  );
}
