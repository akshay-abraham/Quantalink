import { skillsData } from '@/lib/skills-data';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { InfiniteScroller } from './infinite-scroller';
import SkillCard from './skill-card';

export default function Skills() {
  const all = skillsData.flatMap((category) => category.skills);
  const half = Math.ceil(all.length / 2);
  return (
    <section id="skills-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Tools I use and learn</p>
          <h2>Across the stack.</h2>
        </div>
        <p>
          Hover or focus a skill to see where I use it. Tap a card on mobile.
        </p>
      </div>
      <div className="space-y-4">
        <InfiniteScroller>
          {all.slice(0, half).map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </InfiniteScroller>
        <InfiniteScroller direction="right">
          {all.slice(half).map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </InfiniteScroller>
      </div>
      <div className="mt-6 flex justify-end">
        <Link href="/skills" id="see-all-skills-button" className="action-text">
          All skills &amp; technologies{' '}
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
