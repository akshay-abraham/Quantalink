import PageFooter from '@/components/page-footer';
import SkillsClientPage from '@/components/skills-client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills & Technologies | Akshay K Rooben Abraham',
  description:
    'The languages, frameworks, and tools I use across web, Android, AI, and embedded projects.',
  alternates: { canonical: '/skills' },
};

export default function SkillsPage() {
  return (
    <div className="site-shell inner-page relative z-10">
      <header className="journey-header hero-enter">
        <p className="eyebrow">The tools behind the projects</p>
        <h1>Skills &amp; technologies.</h1>
        <p className="page-intro">
          What I’ve been using and learning while building.
        </p>
      </header>
      <SkillsClientPage />
      <PageFooter />
    </div>
  );
}
