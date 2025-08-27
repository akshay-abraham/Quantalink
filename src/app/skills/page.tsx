/**
 * @file src/app/skills/page.tsx
 * @description The dedicated page for showcasing a detailed breakdown of skills.
 *              This page organizes skills into categories and provides detailed
 *              information for each skill in an interactive dialog.
 * @note This is a client component because it uses hooks (`useState`, `useEffect`)
 *       for the dialog interactions.
 */
'use client';

import AnimatedBackground from '@/components/animated-background';
import PageFooter from '@/components/page-footer';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { skillsData, SkillCategory } from '@/lib/skills-data.tsx';

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
   * Renders a single skill category, including its title, icon, and a list of skill buttons.
   * @param {SkillCategory} category - The category data object.
   * @param {number} index - The index of the category, used for animation delay.
   * @returns {JSX.Element} A div containing the rendered category.
   */
  const renderCategory = (category: SkillCategory, index: number) => (
    <div 
      key={category.title}
      className="bg-card/30 border border-border/40 rounded-2xl p-6 md:p-8 shadow-lg animate-fade-in-up"
      style={{ animationDelay: `${200 + index * 150}ms` }}
    >
      <div className="flex flex-col items-center text-center">
        <CategoryIcon icon={category.icon} />
        <h2 className="text-2xl font-bold text-primary mb-4">{category.title}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {/* Map over each skill in the category to create a button and dialog. */}
          {category.skills.map((skill) => (
            <Dialog key={skill.name}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="rounded-full px-5 py-2 text-base transition-all duration-300 ease-out transform hover:scale-105 hover:bg-primary/10 hover:border-primary/50 bg-background/30 border-input flex items-center gap-2"
                >
                  {skill.icon}
                  {skill.name}
                </Button>
              </DialogTrigger>
              {/* The content of the dialog, which is hidden until triggered. */}
              <DialogContent className="bg-card/70 backdrop-blur-md">
                <DialogHeader>
                  <DialogTitle className="text-primary text-2xl">{skill.name}</DialogTitle>
                  <DialogDescription className="text-foreground/80 pt-4 text-base leading-relaxed">
                    {skill.note}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl flex-grow">
          <header className="mb-8 pt-20 text-center">
            <h1 className="text-4xl font-bold text-primary tracking-tight">
              My Skillset
            </h1>
             <p className="text-foreground/70 mt-2 max-w-2xl mx-auto">
              A detailed look at my current technical abilities, leadership experience, and areas I'm excited to explore next.
            </p>
          </header>

          <main className="space-y-12">
            {/* Map over the skills data to render each category. */}
            {skillsData.map(renderCategory)}
          </main>

        </div>
        <PageFooter />
      </div>
    </>
  );
}
