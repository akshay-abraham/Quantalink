/**
 * @file /src/lib/projects-data.ts
 * @description This file contains the data for all projects.
 *              To add a new project, simply add a new object to the `projects` array.
 *              The data is structured to be easily mapped over in the UI components.
 */

/**
 * Defines the structure for a single project object.
 */
export interface Project {
  title: string;
  description: string;
  githubUrl: string;
  license: string;
  /** Optional. If true, the project will be displayed on the home page. */
  isFeatured?: boolean;
  /** Optional. If true, you can use this to style or filter contributions differently. */
  isContribution?: boolean;
}

/**
 * An array of project objects.
 */
export const projects: Project[] = [
  // To feature a project on the home page, set `isFeatured: true`.
  {
    title: 'NEPHRA - Smart Water Bottle System',
    description:
      'A smart water bottle system with ESP32, copper tape sensor, and MPU6050, featuring mobile app integration, hydration tracking, and cloud AI analytics.',
    githubUrl: 'https://github.com/akshay-abraham/NEPHRA',
    license: 'MIT License',
    isFeatured: false, 
  },
  {
    title: 'Quantalink',
    description:
      'A minimal, responsive Linktree-style web app built with Next.js and TypeScript, featuring customizable links, a QED-inspired animated background, and a clean UI — deployed on Vercel.',
    githubUrl: 'https://github.com/akshay-abraham/Quantalink',
    license: 'GPL v3',
    isFeatured: true,
  },
  {
    title: 'MSEdge Redirect Logo Redesign',
    description: 'Contributed a redesigned logo for the open-source MSEdge Redirect tool, improving visual branding and user recognition.',
    githubUrl: 'https://github.com/rcmaehl/MSEdgeRedirect/issues/517',
    license: 'LGPL-3.0',
    isContribution: true
  },
  {
    title: 'Lyra',
    description: 'Lyra is an AI-powered educational framework that provides guided, ethical, and customizable learning support — helping students think independently while enabling teachers to personalize AI tutoring for every learner, including those with special needs.',
    githubUrl: 'https://github.com/akshay-abraham/lyra',
    license:  '',
    isFeatured: false,
  },
  // To add another project, copy the object structure below:
  // {
  //   title: 'Your New Project Title',
  //   description: 'A brief and engaging description of your project.',
  //   githubUrl: 'https://github.com/your-username/your-repo',
  //   license: 'Your Project License (e.g., MIT, Apache 2.0)',
  //   isFeatured: false, // Set to true to show on home page
  //   isContribution: false, // Set to true if it's a contribution to another project
  // },
];
