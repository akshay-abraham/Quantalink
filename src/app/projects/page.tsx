import PageFooter from '@/components/page-footer';
import Projects from '@/components/projects';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Akshay K Rooben Abraham',
  description:
    'Lyra, Mitra, MNEMO, Driver Guard, M57, NEPHRA, and Quantalink  ·  projects by Akshay K Rooben Abraham.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  return (
    <div className="site-shell inner-page relative z-10">
      <header className="journey-header hero-enter">
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
