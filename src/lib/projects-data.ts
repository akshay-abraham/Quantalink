/** Portfolio projects. Only set githubUrl for repositories meant to be linked. */
export interface Project {
  title: string;
  description: string;
  githubUrl?: string;
  license?: string;
  collaborators?: string[];
  category?: string;
  /** Show this project in the homepage spotlight. */
  isFeatured?: boolean;
}

export const projects: Project[] = [
  {
    title: 'Lyra',
    category: 'Learning',
    description:
      'Lyra helps students think through a problem instead of handing over an answer. I’m shaping it with feedback from students and educators.',
    isFeatured: true,
  },
  {
    title: 'Mitra',
    category: 'Memory & care',
    collaborators: ['Chris V Jacob'],
    description:
      'A caretaker system for people living with later stage memory loss and the people looking after them.',
    isFeatured: true,
  },
  {
    title: 'Driver Guard',
    description:
      'A local driver-monitoring dashboard built with Python, OpenCV, MediaPipe, and FastAPI. Uses webcam-based eye and mouth tracking to detect fatigue signs and issue alerts, with optional ESP32 integration.',
    githubUrl: 'https://github.com/akshay-abraham/driver_guard',
    license: 'MIT License',
  },
  {
    title: 'M57',
    isFeatured: true,
    description:
      'A native Android app exploring focused digital habits through configurable AI-app redirection to Lyra, short-video controls, and on-device family browsing filters.',
    githubUrl: 'https://github.com/akshay-abraham/m57',
    license: 'AGPL v3 / GPL v3',
  },
  {
    title: 'MNEMO',
    category: 'Memory & care',
    collaborators: ['Chris V Jacob'],
    description: 'Designed for people in the early stages of memory loss.',
  },
  {
    title: 'NEPHRA  ·  Smart Water Bottle System',
    collaborators: ['Adwaith R Krishna US'],
    description:
      'A smart water bottle system with ESP32, copper tape sensor, and MPU6050, featuring mobile app integration, hydration tracking, and cloud AI analytics.',
    githubUrl: 'https://github.com/akshay-abraham/NEPHRA',
    license: 'MIT License',
  },
  {
    title: 'Personal website',
    description:
      'The place where I keep my work and the stories behind it. Built with Next.js and TypeScript.',
    githubUrl: 'https://github.com/akshay-abraham/Quantalink',
    license: 'GPL v3',
  },
];
