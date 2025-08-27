/**
 * @file /src/lib/skills-data.tsx
 * @description This file contains the data for all skills, organized into categories.
 *              To add a new skill or category, modify the `skillsData` array.
 *              This structure makes it easy to render the skills page dynamically.
 * @note This file must have a `.tsx` extension because it imports and uses React components (icons).
 */

import { Code, Server, Tool, Settings } from 'lucide-react';
import { CPlusPlusIcon } from '@/components/icons/cplusplus';
import { PythonIcon } from '@/components/icons/python';
import { TypescriptIcon } from '@/componentsicons/typescript';
import { ReactIcon } from '@/components/icons/react';
import { HtmlIcon } from '@/components/icons/html5';
import { CssIcon } from '@/components/icons/css3';
import { JavascriptIcon } from '@/components/icons/javascript';
import { TailwindIcon } from '@/components/icons/tailwind';
import { VscodeIcon } from '@/components/icons/vscode';
import { ChatgptIcon } from '@/components/icons/chatgpt';
import { GithubIcon } from '@/components/icons/github';
import { GitIcon } from '@/components/icons/git';
import { BashIcon } from '@/components/icons/bash';
import { ZshIcon } from '@/components/icons/zsh';
import { VercelIcon } from '@/components/icons/vercel';
import { UbuntuIcon } from '@/components/icons/ubuntu';


/**
 * Defines the structure for an individual skill.
 */
export interface Skill {
  name: string;
  description: string;
  icon: React.ReactNode;
  iconClassName?: string;
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
    title: 'Languages & Frameworks',
    icon: <Code size={32} />,
    skills: [
      {
        name: 'JavaScript',
        description: 'The engine of the modern web, used to create dynamic and interactive user experiences.',
        icon: <JavascriptIcon />,
        iconClassName: 'bg-black p-1 rounded-sm'
      },
      {
        name: 'TypeScript',
        description: 'A superset of JavaScript that adds static typing, improving code quality and maintainability.',
        icon: <TypescriptIcon />,
        iconClassName: 'p-1'
      },
       {
        name: 'Python',
        description: 'A versatile language used for scripting, automation, data science, and introductory AI projects.',
        icon: <PythonIcon />,
      },
      {
        name: 'React & Next.js',
        description: 'A powerful combination for building modern, performant, and scalable web applications.',
        icon: <ReactIcon />,
      },
      {
        name: 'HTML5',
        description: 'The standard markup language for creating the structure and content of web pages.',
        icon: <HtmlIcon />,
      },
      {
        name: 'CSS3',
        description: 'The language for styling web pages, enabling responsive design and complex visual layouts.',
        icon: <CssIcon />,
      },
      {
        name: 'Tailwind CSS',
        description: 'A utility-first CSS framework that enables rapid development of custom user interfaces.',
        icon: <TailwindIcon />,
      },
      {
        name: 'C & C++',
        description: 'A strong foundation in computer science fundamentals, memory management, and performance.',
        icon: <CPlusPlusIcon />,
      },
    ],
  },
  {
    title: 'Developer Tools',
    icon: <Tool size={32} />,
    skills: [
      {
        name: 'Git',
        description: 'A distributed version control system for tracking changes and collaborating on code.',
        icon: <GitIcon />,
      },
      {
        name: 'GitHub',
        description: 'A platform for hosting Git repositories and collaborating with other developers.',
        icon: <GithubIcon />,
        iconClassName: 'dark:invert'
      },
      {
        name: 'VS Code',
        description: 'A lightweight but powerful source code editor that runs on your desktop.',
        icon: <VscodeIcon />,
      },
       {
        name: 'ChatGPT',
        description: 'An AI-powered language model used for brainstorming, debugging, and accelerating development.',
        icon: <ChatgptIcon />,
      },
    ],
  },
   {
    title: 'Platforms & Environments',
    icon: <Server size={32} />,
    skills: [
       {
        name: 'Vercel',
        description: 'A cloud platform for static sites and Serverless Functions that fits perfectly with Next.js.',
        icon: <VercelIcon />,
        iconClassName: 'dark:invert'
      },
       {
        name: 'Ubuntu',
        description: 'A popular Linux distribution used for development servers and the Windows Subsystem for Linux (WSL).',
        icon: <UbuntuIcon />,
      },
       {
        name: 'Bash',
        description: 'The default shell on most Linux distributions, used for scripting and command-line automation.',
        icon: <BashIcon />,
        iconClassName: 'dark:invert'
      },
      {
        name: 'Zsh',
        description: 'A powerful, highly customizable shell with advanced features, often used with "Oh My Zsh".',
        icon: <ZshIcon />,
        iconClassName: 'dark:invert'
      },
    ],
  },
];
