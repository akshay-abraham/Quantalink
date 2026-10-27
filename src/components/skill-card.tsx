import type { Skill } from '@/lib/skills-data';

export default function SkillCard({
  skill,
  tabIndex,
}: {
  skill: Skill;
  tabIndex?: number;
}) {
  const usage = skill.projects.join(' · ');
  return (
    <button
      type="button"
      className="animated-skill-card"
      aria-label={`${skill.name}. Used in ${usage}`}
      tabIndex={tabIndex}
    >
      <span className="skill-card-icon" aria-hidden="true">
        {skill.icon}
      </span>
      <span className="skill-card-name">{skill.name}</span>
      <span className="skill-usage">{usage}</span>
    </button>
  );
}
