/**
 * @file /src/lib/skills-data.tsx
 * @description This file contains the data for all skills, organized into categories.
 *              To add a new skill or category, modify the `skillsData` array.
 *              This structure makes it easy to render the skills page dynamically.
 * @note This file must have a `.tsx` extension because it imports and uses React components (icons).
 */

import { Code, Briefcase, Target, Cpu, GitBranch, Lightbulb, Users, Atom } from 'lucide-react';
import { CPlusPlusIcon } from '@/components/icons/cplusplus';
import { PythonIcon } from '@/components/icons/python';
import { TypescriptIcon } from '@/components/icons/typescript';
import { ReactIcon } from '@/components/icons/react';
import { HtmlCssIcon } from '@/components/icons/htmlcss';

/**
 * Defines the structure for an individual skill.
 */
export interface Skill {
  name: string;
  note: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Defines the structure for a category of skills.
 */
export interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: Skill[];
}

/**
 * Data for all skills, organized by category.
 * To add more, simply add to the existing arrays or create a new category object.
 */
export const skillsData: SkillCategory[] = [
  {
    title: 'Core Technical Skills',
    icon: <Code size={32} />,
    skills: [
      {
        name: 'C & C++',
        icon: <CPlusPlusIcon className="w-5 h-5" />,
        note: 'Strong foundation in computer science fundamentals through Harvard\'s CS50x course.',
      },
      {
        name: 'Python',
        icon: <PythonIcon className="w-5 h-5" />,
        note: 'Completed Harvard\'s CS50P course and used Python for scripting, automation, and introductory AI projects.',
      },
      {
        name: 'TypeScript',
        icon: <TypescriptIcon className="w-5 h-5" />,
        note: 'Building type-safe, maintainable front-end applications including this portfolio project.',
      },
      {
        name: 'React & Next.js',
        icon: <ReactIcon className="w-5 h-5" />,
        note: 'Developing modern, performant web interfaces with React and Next.js using a component-driven approach.',
      },
      {
        name: 'HTML & CSS',
        icon: <HtmlCssIcon className="w-5 h-5" />,
        note: 'Completed CS50W fundamentals module; proficient in creating responsive, accessible layouts with modern CSS and Tailwind.',
      },
      {
        name: 'Electronics & IoT',
        icon: <Cpu className="w-5 h-5" />,
        note: 'Three years of experience in Arduino, ESP8266/ESP32, and embedded systems, from basic DC circuits to IoT prototypes.',
      },
      {
        name: 'Git & Command Line',
        icon: <GitBranch className="w-5 h-5" />,
        note: 'Proficient in Git version control and Linux command-line workflows (WSL2 + VS Code). Developed through CS50 courses and practical projects.',
      },
    ],
  },
  {
    title: 'Product & Leadership',
    icon: <Briefcase size={32} />,
    skills: [
      {
        name: 'Product Design',
        icon: <Lightbulb className="w-5 h-5" />,
        note: 'Focus on usability and detail-oriented design with inspiration from modern UI/UX practices.',
      },
      {
        name: 'Leadership & Collaboration',
        icon: <Users className="w-5 h-5" />,
        note: 'Experience organizing academic and technical events, fostering teamwork, and managing responsibilities effectively.',
      },
    ],
  },
  {
    title: 'Future Deep Focus Areas',
    icon: <Target size={32} />,
    skills: [
      {
        name: 'AI with Python',
        icon: <PythonIcon className="w-5 h-5" />,
        note: 'Planning to complete Harvard\'s CS50AI for applied AI concepts including search algorithms and machine learning.',
      },
      {
        name: 'Full-Stack Web Dev',
        icon: <HtmlCssIcon className="w-5 h-5" />,
        note: 'Currently pursuing Harvard\'s CS50W to gain full-stack development skills for scalable web applications.',
      },
      {
        name: 'Advanced Physics',
        icon: <Atom className="w-5 h-5" />,
        note: 'Focused on deepening knowledge in quantum and classical mechanics for future research goals.',
      },
      {
        name: 'Formal Electronics',
        icon: <Cpu className="w-5 h-5" />,
        note: 'Planning formal studies in circuit theory and electronics to complement practical experience.',
      },
    ],
  },
];