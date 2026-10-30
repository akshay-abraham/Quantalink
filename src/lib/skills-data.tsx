import { Code2, Cpu, Database, Languages } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';

export interface Skill {
  name: string;
  icon: ReactNode;
  iconClassName?: string;
  projects: string[];
}

export interface SkillCategory {
  title: string;
  icon: ReactNode;
  subtitle?: string;
  skills: Skill[];
}

const skillProjects: Record<string, string[]> = {
  C: ['CS50', 'NEPHRA', 'Mitra'],
  Python: ['Driver Guard'],
  JavaScript: ['Personal website', 'MNEMO'],
  TypeScript: ['Lyra', 'Mitra', 'MNEMO', 'Personal website'],
  Kotlin: ['M57', 'Mitra'],
  HTML: ['Personal website', 'MNEMO'],
  CSS: ['Personal website', 'Mitra', 'MNEMO'],
  'Next.js': ['Lyra', 'Personal website'],
  React: ['Lyra', 'Mitra', 'Personal website'],
  'Tailwind CSS': ['Lyra', 'Personal website'],
  'Node.js': ['Lyra', 'Mitra', 'MNEMO'],
  Vite: ['Mitra'],
  FastAPI: ['Driver Guard'],
  Android: ['M57', 'Mitra'],
  LangChain: ['Lyra'],
  OpenCV: ['Driver Guard'],
  MediaPipe: ['Driver Guard'],
  Supabase: ['Lyra'],
  PostgreSQL: ['Lyra'],
  SQLite: ['Mitra', 'MNEMO'],
  Arduino: ['NEPHRA', 'Mitra'],
  'ESP32 / ESP8266': ['NEPHRA', 'Mitra', 'Driver Guard'],
  Git: ['All projects'],
  Docker: ['MNEMO'],
  Vercel: ['Lyra', 'Personal website'],
  'Arch Linux': ['Personal Linux experiments'],
  'Fedora Linux': ['Tachyon dots', 'Daily development'],
  'KDE Plasma': ['Tachyon dots', 'Daily desktop'],
};

/** Official Simple Icons artwork, fetched directly from its CDN by the browser. */
function skill(name: string, slug: string): Skill {
  return {
    name,
    projects: skillProjects[name] ?? [],
    icon: (
      <Image
        src={`https://cdn.simpleicons.org/${slug}/0F172A`}
        alt=""
        width={40}
        height={40}
        unoptimized
        className="h-full w-full object-contain"
      />
    ),
  };
}

// Technologies used across Lyra, Mitra, MNEMO, Driver Guard, M57, and this website.
export const skillsData: SkillCategory[] = [
  {
    title: 'Core Languages',
    icon: <Languages size={32} />,
    subtitle: 'From web interfaces and server logic to Android and firmware.',
    skills: [
      skill('C', 'c'),
      skill('Python', 'python'),
      skill('JavaScript', 'javascript'),
      skill('TypeScript', 'typescript'),
      skill('Kotlin', 'kotlin'),
      skill('HTML', 'html5'),
      skill('CSS', 'css'),
    ],
  },
  {
    title: 'Web & App Development',
    icon: <Code2 size={32} />,
    subtitle:
      'The stack behind my portfolio, learning tools, and caretaker apps.',
    skills: [
      skill('Next.js', 'nextdotjs'),
      skill('React', 'react'),
      skill('Tailwind CSS', 'tailwindcss'),
      skill('Node.js', 'nodedotjs'),
      skill('Vite', 'vite'),
      skill('FastAPI', 'fastapi'),
      skill('Android', 'android'),
    ],
  },
  {
    title: 'AI & Data',
    icon: <Database size={32} />,
    subtitle:
      'AI orchestration, computer vision, and storage used in my projects.',
    skills: [
      skill('LangChain', 'langchaincorporate'),
      skill('OpenCV', 'opencv'),
      skill('MediaPipe', 'mediapipe'),
      skill('Supabase', 'supabase'),
      skill('PostgreSQL', 'postgresql'),
      skill('SQLite', 'sqlite'),
    ],
  },
  {
    title: 'Hardware & Platforms',
    icon: <Cpu size={32} />,
    subtitle:
      'Embedded devices, development platforms, and tools for shipping.',
    skills: [
      skill('Arduino', 'arduino'),
      skill('ESP32 / ESP8266', 'espressif'),
      skill('Git', 'git'),
      skill('Docker', 'docker'),
      skill('Vercel', 'vercel'),
      skill('Arch Linux', 'archlinux'),
      skill('Fedora Linux', 'fedora'),
      skill('KDE Plasma', 'kde'),
    ],
  },
];
