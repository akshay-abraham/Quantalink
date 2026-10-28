import { skillsData } from '@/lib/skills-data';
import { InfiniteScroller } from './infinite-scroller';
import SkillCard from './skill-card';

export default function SkillsClientPage() {
  return (
    <div className="skills-categories">
      {skillsData.map((category, index) => (
        <section key={category.title} className="skill-category section-reveal">
          <div className="skill-category-heading">
            <div className="text-primary" aria-hidden="true">
              {category.icon}
            </div>
            <div>
              <h2>{category.title}</h2>
              <p>{category.subtitle}</p>
            </div>
          </div>
          <InfiniteScroller direction={index % 2 ? 'right' : 'left'}>
            {category.skills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </InfiniteScroller>
        </section>
      ))}
    </div>
  );
}
