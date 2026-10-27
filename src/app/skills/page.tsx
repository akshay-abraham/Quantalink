import PageFooter from '@/components/page-footer';
import SkillsClientPage from '@/components/skills-client-page';
import type { Metadata } from 'next';
import { pageSocialMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Skills & Technologies | Akshay Abraham',
  description:
    'Explore the languages, frameworks, and tools Akshay Abraham uses across web, Android, AI, and embedded projects.',
  alternates: { canonical: '/skills' },
  ...pageSocialMetadata(
    'Skills & Technologies | Akshay Abraham',
    'The tools Akshay Abraham uses across web, Android, AI, and embedded projects.',
    '/skills'
  ),
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
