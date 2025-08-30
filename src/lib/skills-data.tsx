/**
 * @file /src/lib/skills-data.tsx
 * @description This file contains the data for all technical skills, organized into categories.
 *              To add a new skill or category, modify the `skillsData` array.
 *              This structure makes it easy to render the skills page dynamically.
 * @note This file must have a `.tsx` extension because it imports and uses React components (icons).
 */

import { BrainCircuit, Code, Wrench } from 'lucide-react';
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
import { NumpyIcon } from '@/components/icons/numpy';
import { PandasIcon } from '@/components/icons/pandas';
import { SciktLearnIcon } from '@/components/icons/scikt-learn';
import { SqliteIcon } from '@/components/icons/sqlite';
import { TensorflowIcon } from '@/components/icons/tensorflow';
import { GeminiIcon } from '@/components/icons/gemini';
import { ArduinoIcon } from '@/components/icons/arduino';
import { EspressifIcon } from '@/components/icons/espressif';

/**
 * Defines the structure for an individual skill.
 * @property {string} name - The name of the skill (e.g., "Python").
 * @property {React.ReactNode} icon - The React component for the skill's logo.
 * @property {string} [iconClassName] - Optional CSS classes to apply to the icon container.
 */
export interface Skill {
  name: string;
  icon: React.ReactNode;
  iconClassName?: string;
}

/**
 * Defines the structure for a category of skills.
 * @property {string} title - The title of the category (e.g., "Frontend Development").
 * @property {React.ReactNode} icon - The icon representing the category.
 * @property {string} [subtitle] - An optional subtitle to display under the category title.
 * @property {Skill[]} skills - An array of `Skill` objects belonging to this category.
 */
export interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  skills: Skill[];
}

/**
 * Data for all technical skills, organized by category.
 * The order is Backend, Frontend, then Tools, reflecting a professional focus.
 */
export const skillsData: SkillCategory[] = [
  {
    title: 'Backend & Data Science',
    icon: <BrainCircuit size={32} />,
    subtitle: 'Backend and data science tools leveraged for future physics research integration and computational analysis.',
    skills: [
      { name: 'Python', icon: <PythonIcon /> },
      { name: 'C', icon: <CIcon /> },
      { name: 'NumPy', icon: <NumpyIcon /> },
      { name: 'Pandas', icon: <PandasIcon /> },
      { name: 'Scikit-learn', icon: <SciktLearnIcon /> },
      { name: 'TensorFlow', icon: <TensorflowIcon /> },
      { name: 'SQLite', icon: <SqliteIcon /> },
    ]
  },
  {
    title: 'Frontend Development',
    icon: <Code size={32} />,
    subtitle: 'Frontend technologies applied with a foundation in computer science principles, utilizing generative AI for rapid prototyping and debugging.',
    skills: [
      { name: 'HTML5', icon: <HtmlIcon /> },
      { name: 'CSS3', icon: <CssIcon /> },
      { name: 'Tailwind CSS', icon: <TailwindIcon /> },
      { name: 'JavaScript', icon: <JavascriptIcon />, iconClassName: 'p-1' },
      { name: 'TypeScript', icon: <TypescriptIcon />, iconClassName: 'p-1' },
      { name: 'React', icon: <ReactIcon /> },
      { name: 'Next.js', icon: <NextjsIcon /> },
    ],
  },
  {
    title: 'Tools & Platforms',
    icon: <Wrench size={32} />,
    skills: [
       { name: 'Git', icon: <GitIcon /> },
       { name: 'GitHub', icon: <GithubIcon /> },
       { name: 'VS Code', icon: <VscodeIcon /> },
       { name: 'ChatGPT', icon: <ChatgptIcon /> },
       { name: 'Gemini', icon: <GeminiIcon /> },
       { name: 'Bash', icon: <BashIcon /> },
       { name: 'Zsh', icon: <ZshIcon /> },
       { name: 'Ubuntu', icon: <UbuntuIcon /> },
       { name: 'Vercel', icon: <VercelIcon /> },
       { name: 'Arduino', icon: <ArduinoIcon /> },
       { name: 'ESP32/ESP8266', icon: <EspressifIcon /> },
    ],
  },
];
