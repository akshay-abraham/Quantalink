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
        note: 'Built a strong foundation in computer science principles and low-level programming through Harvard\'s CS50x and CS50p courses, mastering concepts like memory management, data structures, and algorithms.',
      },
       {
        name: 'Python',
        icon: <PythonIcon className="w-5 h-5" />,
        note: 'Proficient in Python for scripting, backend logic, and currently exploring its applications in AI and machine learning via Harvard\'s CS50AI.',
      },
      {
        name: 'TypeScript',
        icon: <TypescriptIcon className="w-5 h-5" />,
        note: 'Using TypeScript to build robust, type-safe frontend applications, including this portfolio. I appreciate its ability to catch errors early and improve code quality.',
      },
      {
        name: 'React & Next.js',
        icon: <ReactIcon className="w-5 h-5" />,
        note: 'Leveraging React and Next.js to build modern, performant, and interactive user interfaces with a component-based architecture.',
      },
      {
        name: 'HTML & CSS',
        icon: <HtmlCssIcon className="w-5 h-5" />,
        note: 'Solid understanding of web fundamentals for structuring content and creating responsive, visually appealing layouts with modern CSS and Tailwind.',
      },
      {
        name: 'Electronics & IoT',
        icon: <Cpu className="w-5 h-5" />,
        note: 'Over 3 years of hands-on experience, progressing from basic mechatronics and DC circuits to complex projects with Arduino, AC circuits, and ESP8266/ESP32 boards for IoT applications.',
      },
      {
        name: 'Git & Command Line',
        icon: <GitBranch className="w-5 h-5" />,
        note: 'Proficient in version control with Git and comfortable in a command-line environment using Bash, WSL2 (Ubuntu), and the integrated terminal in VS Code. Skills were honed through CS50 and practical application.',
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
        note: 'A perfectionist with a keen eye for detail, inspired by Apple\'s design philosophy. I enjoy deeply analyzing products to understand what makes a user experience intuitive, seamless, and delightful.',
      },
      {
        name: 'Leadership',
        icon: <Users className="w-5 h-5" />,
        note: 'Have actively sought and held leadership roles since Class 9, including serving on the student council, as a house captain, and leading event teams. These roles have taught me responsibility, discipline, and how to collaborate effectively to achieve a common goal.',
      },
    ]
  },
  {
    title: 'Future Deep Focus Areas',
    icon: <Target size={32} />,
    skills: [
      {
        name: 'AI with Python',
        icon: <PythonIcon className="w-5 h-5" />,
        note: 'Currently expanding my knowledge in Artificial Intelligence by working through Harvard\'s CS50AI, focusing on concepts like machine learning, search algorithms, and neural networks.',
      },
      {
        name: 'Full-Stack Web Dev',
        icon: <HtmlCssIcon className="w-5 h-5" />,
        note: 'Planning to master web development fundamentals (HTML, CSS, JS) via CS50W to build robust and scalable web applications.',
      },
      {
        name: 'Advanced Physics',
        icon: <Atom className="w-5 h-5" />,
        note: 'My academic goal is to formally study advanced quantum and classical mechanics to build a strong theoretical foundation for a future in physics research.',
      },
      {
        name: 'Formal Electronics',
        icon: <Cpu className="w-5 h-5" />,
        note: 'I aim to complement my practical experience with formal electronics courses to gain a deeper, theoretical understanding of circuit design and electrical engineering principles.',
      },
    ],
  },
];
