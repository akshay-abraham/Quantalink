
/**
 * @file src/components/skills-client-page.tsx
 * @description A client component that renders the animated, interactive content
 *              for the main "Skills & Technologies" page. It handles the entrance
 *              animations for the skill categories and uses an infinite scroller
 *              for a dynamic presentation.
 * @note This is a client component because it uses hooks for animations.
 */
'use client';

import { useEffect, useState } from 'react';
import { skillsData, SkillCategory } from '@/lib/skills-data';
import { Card, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { InfiniteScroller } from '@/components/infinite-scroller';

/**
 * A small component to render a styled icon for a skill category.
 * @param {{ icon: React.ReactNode }} props - The props object.
 * @param {React.ReactNode} props.icon - The icon element to render.
 * @returns {JSX.Element} A styled div containing the icon.
 */
const CategoryIcon = ({ icon }: { icon: React.ReactNode }) => (
  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
    {icon}
  </div>
);

/**
 * SkillsClientPage component renders the full, categorized list of skills with animations.
 * @returns {JSX.Element} The rendered skills content.
 */
export default function SkillsClientPage() {
  // State to track if the component has mounted, to prevent server-side animation rendering.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Renders a single skill category, including its title, icon, and an infinite scroller of skill cards.
   * @param {SkillCategory} category - The category data object.
   * @param {number} index - The index of the category, used for animation delay.
   * @returns {JSX.Element} A div containing the rendered category.
   */
  const renderCategory = (category: SkillCategory, index: number) => (
    <div 
      key={category.title}
      className={cn(
        "space-y-6 transition-all duration-700 ease-out",
        // Only apply animation classes if the component is mounted on the client.
        isMounted ? "animate-fade-in-up" : "opacity-0"
      )}
      style={{ animationDelay: `${200 + index * 150}ms` }}
    >
      <div className="flex flex-col items-center text-center">
        <CategoryIcon icon={category.icon} />
        <h2 className="text-2xl font-bold text-primary mb-2">{category.title}</h2>
        {/* Render the subtitle for the category if it exists */}
        {category.subtitle && (
          <p className="text-foreground/70 max-w-2xl text-sm leading-relaxed">{category.subtitle}</p>
        )}
      </div>
      {/* Use the InfiniteScroller for a dynamic, moving display of skills. */}
       <InfiniteScroller speed={index % 2 === 0 ? "slow" : "normal"}>
        {category.skills.map((skill) => (
          <Card
            key={skill.name}
            className={cn(
              "bg-card/40 border-border/40 shadow-lg text-center flex flex-col items-center justify-center w-[160px] h-[120px] shrink-0 p-4 transition-shadow,background-color duration-300 hover:shadow-xl hover:bg-card/60 relative overflow-hidden group"
            )}
          >
             <div className="relative z-10 flex flex-col items-center justify-center gap-2 h-full">
                <div className={cn("h-12 w-12 flex items-center justify-center text-foreground", skill.iconClassName)}>
                  <div className="h-10 w-10 flex items-center justify-center">
                    {skill.icon}
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground/90">{skill.name}</p>
              </div>
          </Card>
        ))}
      </InfiniteScroller>
    </div>
  );

  return (
    <>
      {skillsData.map(renderCategory)}
    </>
  );
}
