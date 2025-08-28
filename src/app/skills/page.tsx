/**
 * @file src/app/skills/page.tsx
 * @description The dedicated page for showcasing a detailed breakdown of skills.
 *              This page organizes skills into categories and displays them
 *              in visually appealing, infinitely scrolling rows.
 * @note This is a client component because it uses hooks (`useState`, `useEffect`)
 *       for animations.
 */
'use client';

import AnimatedBackground from '@/components/animated-background';
import PageFooter from '@/components/page-footer';
import { skillsData, SkillCategory } from '@/lib/skills-data.tsx';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
 * The SkillsPage component that renders the full, categorized list of skills.
 * @returns {JSX.Element} The rendered skills page.
 */
export default function SkillsPage() {

  /**
   * Renders a single skill category, including its title, icon, and a grid of skill cards.
   * @param {SkillCategory} category - The category data object.
   * @param {number} index - The index of the category, used for animation delay.
   * @returns {JSX.Element} A div containing the rendered category.
   */
  const renderCategory = (category: SkillCategory, index: number) => (
    <div 
      key={category.title}
      className="space-y-6 animate-fade-in-up"
      style={{ animationDelay: `${200 + index * 150}ms` }}
    >
      <div className="flex flex-col items-center text-center">
        <CategoryIcon icon={category.icon} />
        <h2 className="text-2xl font-bold text-primary mb-4">{category.title}</h2>
      </div>
       <InfiniteScroller speed={index % 2 === 0 ? "slow" : "normal"}>
        {category.skills.map((skill) => (
          <Card 
            key={skill.name}
            className="bg-card/40 border-border/40 shadow-lg text-left flex flex-col w-[350px] shrink-0"
          >
            <CardHeader className="flex-grow">
              <div className="flex items-center gap-4 mb-3">
                 <div className={cn("h-10 w-10 flex items-center justify-center", skill.iconClassName)}>
                  {skill.icon}
                </div>
                <CardTitle className="text-xl text-primary">{skill.name}</CardTitle>
              </div>
              <CardDescription className="text-foreground/80 pt-1">
                {skill.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </InfiniteScroller>
    </div>
  );

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl flex-grow">
          <header className="mb-12 pt-20 text-center">
            <h1 className="text-4xl font-bold text-primary tracking-tight">
              My Skillset
            </h1>
             <p className="text-foreground/70 mt-2 max-w-2xl mx-auto">
              A detailed look at the languages, frameworks, tools, and platforms I work with.
            </p>
          </header>

          <main className="space-y-16">
            {skillsData.map(renderCategory)}
          </main>

        </div>
        <PageFooter />
      </div>
    </>
  );
}
