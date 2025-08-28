/**
 * @file src/components/skills.tsx
 * @description A component that displays a summary of key skills on the homepage.
 *              It encourages users to visit the full skills page.
 * @note This is a client component because it uses the `useInView` hook for animations.
 */
"use client"

import { useInView } from '@/hooks/use-in-view';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { GitBranch, Users, ArrowRight, Atom, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { CIcon } from './icons/c';
import { PythonIcon } from './icons/python';

// A summary of key skills to be displayed on the homepage.
const skills = [
  { name: 'C', icon: CIcon },
  { name: 'Python', icon: PythonIcon },
  { name: 'Electronics & IoT', icon: BrainCircuit },
  { name: 'Theoretical Physics', icon: Atom },
  { name: 'Git & GitHub', icon: GitBranch },
  { name: 'Leadership', icon: Users }
];

/**
 * Skills component renders a grid of skill badges and a link to the full skills page.
 * @returns {JSX.Element} A section containing the skills summary.
 */
export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref);

  return (
    <section 
      ref={ref}
      className={cn(
        "space-y-4 text-center transition-opacity duration-1000 ease-out",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{
        transitionDelay: isVisible ? '150ms' : '0ms'
      }}
    >
      <h2 className={cn(
          "text-2xl font-bold text-primary tracking-tight transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          Skills & Technologies
      </h2>
      <div className="flex flex-wrap justify-center gap-3">
        {/* Map over the skills to render a badge for each one. */}
        {skills.map((skill, index) => (
          <Badge
            key={skill.name}
            variant="outline"
            className={cn(
              "px-4 py-2 text-sm transition-all duration-700 ease-out",
              // Animate each badge with a stagger effect.
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
            style={{ 
              transitionDelay: isVisible ? `${200 + index * 100}ms` : '0ms',
              backgroundColor: 'hsl(var(--card) / 0.3)',
              borderColor: 'hsl(var(--border) / 0.4)',
            }}
          >
            <skill.icon className="mr-2 h-4 w-4" />
            {skill.name}
          </Badge>
        ))}
      </div>
      {/* A prominent button to navigate to the full skills page. */}
      <div 
        className={cn(
          "text-center transition-all duration-700 pt-2",
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        )}
        style={{ transitionDelay: '500ms'}}
      >
        <Link href="/skills">
          <Button variant="outline" className="bg-card/30 border-border/40">
            See Full Technical Skillset
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
