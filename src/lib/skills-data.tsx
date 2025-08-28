/**
 * @file /src/lib/skills-data.tsx
 * @description This file contains the data for all skills, organized into categories.
 *              To add a new skill or category, modify the `skillsData` array.
 *              This structure makes it easy to render the skills page dynamically.
 * @note This file must have a `.tsx` extension because it imports and uses React components (icons).
 */

import { BrainCircuit, Code, Database, Server, Wrench } from 'lucide-react';
import { CPlusPlusIcon } from '@/components/icons/cplusplus';
import { PythonIcon } from '@/components/icons/python';
import { TypescriptIcon } from '@/components/icons/typescript';
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
import { CIcon } from '@/components/icons/c';
import { NextjsIcon } from '@/components/icons/nextdotjs';
import { DjangoIcon } from '@/components/icons/django';
import { NumpyIcon } from '@/components/icons/numpy';
import { PandasIcon } from '@/components/icons/pandas';
import { SciktLearnIcon } from '@/components/icons/scikt-learn';
import { SqliteIcon } from '@/components/icons/sqlite';
import { TensorflowIcon } from '@/components/icons/tensorflow';


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
        iconClassName: 'p-1'
      },
      {
        name: 'TypeScript',
        description: 'A superset of JavaScript that adds static typing, improving code quality and maintainability.',
        icon: <TypescriptIcon />,
        iconClassName: 'p-1'
      },
      {
        name: 'Python',
        description: 'A versatile language used for scripting, web backends, automation, and data science.',
        icon: <PythonIcon />,
      },
      {
        name: 'React',
        description: 'A declarative, component-based library for building user interfaces.',
        icon: <ReactIcon />,
      },
      {
        name: 'Next.js',
        description: 'The React framework for building full-stack, production-grade web applications.',
        icon: <NextjsIcon />,
        iconClassName: 'dark:invert'
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
        name: 'C++',
        description: 'A high-performance language used in systems programming, game development, and competitive programming.',
        icon: <CPlusPlusIcon />,
      },
      {
        name: 'C',
        description: 'A foundational language known for its performance, used for system/OS-level programming.',
        icon: <CIcon />,
      },
      {
        name: 'Django',
        description: 'A high-level Python web framework that encourages rapid development and clean, pragmatic design.',
        icon: <DjangoIcon />,
      },
    ],
  },
  {
    title: 'Data Science & AI',
    icon: <BrainCircuit size={32} />,
    skills: [
      {
        name: 'TensorFlow',
        description: 'An end-to-end open source platform for machine learning and deep learning.',
        icon: <TensorflowIcon />,
      },
      {
        name: 'Scikit-learn',
        description: 'A library for Python with tools for data mining and data analysis, built on NumPy, SciPy, and matplotlib.',
        icon: <SciktLearnIcon />,
      },
      {
        name: 'Pandas',
        description: 'A data analysis and manipulation tool, built on top of the Python programming language.',
        icon: <PandasIcon />,
      },
      {
        name: 'NumPy',
        description: 'The fundamental package for scientific computing with Python, providing support for large, multi-dimensional arrays and matrices.',
        icon: <NumpyIcon />,
      },
    ]
  },
  {
    title: 'Developer Tools',
    icon: <Wrench size={32} />,
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
    title: 'Platforms & Databases',
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
        name: 'SQLite',
        description: 'A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.',
        icon: <SqliteIcon />,
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