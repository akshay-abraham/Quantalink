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
    category: 'AI & learning · Primary focus',
    description:
      'An AI learning system that helps students work through problems and develop their reasoning. Built around guided learning, independent thinking, and feedback from students and educators.',
    isFeatured: true,
  },
  {
    title: 'Mitra',
    category: 'Embedded systems & care',
    collaborators: ['Chris V Jacob'],
    description:
      'A wearable companion and caretaker system built around ESP32 devices, a home base, and a responsive caretaker app. Connects motion and location events, panic alerts, care routines, and a personal AI companion.',
    isFeatured: true,
  },
  {
    title: 'MNEMO',
    category: 'Voice & knowledge',
    collaborators: ['Chris V Jacob'],
    isFeatured: true,
    description:
      'A voice-first knowledge companion for Obsidian. Turns recordings into organised, linked notes, with multilingual transcription, spoken recall, guided practice, and an offline recording queue.',
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
    description:
      'A native Android app exploring focused digital habits through configurable AI-app redirection to Lyra, short-video controls, and on-device family browsing filters.',
    githubUrl: 'https://github.com/akshay-abraham/m57',
    license: 'AGPL v3 / GPL v3',
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
    title: 'Quantalink',
    description:
      'My personal portfolio, built with Next.js and TypeScript. Brings together projects, skills, and my journey with an interactive background and a responsive interface.',
    githubUrl: 'https://github.com/akshay-abraham/Quantalink',
    license: 'GPL v3',
  },
];
