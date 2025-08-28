/**
 * @file src/lib/tech-sphere-data.tsx
 * @description Data for the 3D rotating tech sphere on the homepage.
 *              Each item in the array represents a logo to be displayed.
 * @note This must be a .tsx file to import and use React components (icons).
 */
import { ReactIcon } from "@/components/icons/react";
import { PythonIcon } from "@/components/icons/python";
import { GitIcon } from "@/components/icons/git";
import { GithubIcon } from "@/components/icons/github";
import { TypescriptIcon } from "@/components/icons/typescript";
import { JavascriptIcon } from "@/components/icons/javascript";
import { HtmlIcon } from "@/components/icons/html5";
import { CssIcon } from "@/components/icons/css3";
import { TailwindIcon } from "@/components/icons/tailwind";
import { NextjsIcon } from "@/components/icons/nextdotjs";
import { VercelIcon } from "@/components/icons/vercel";

export const ICONS = [
    <ReactIcon key="react" />,
    <PythonIcon key="python" />,
    <GitIcon key="git" />,
    <GithubIcon key="github" className="dark:invert" />,
    <TypescriptIcon key="typescript" />,
    <JavascriptIcon key="javascript" />,
    <HtmlIcon key="html" />,
    <CssIcon key="css" />,
    <TailwindIcon key="tailwind" />,
    <NextjsIcon key="nextjs" className="dark:invert" />,
    <VercelIcon key="vercel" className="dark:invert" />,
];

// This maps the icon components to their respective names for the tooltip.
export const ICON_NAME_MAP = new Map<React.ReactNode, string>([
    [ICONS[0], 'React'],
    [ICONS[1], 'Python'],
    [ICONS[2], 'Git'],
    [ICONS[3], 'GitHub'],
    [ICONS[4], 'TypeScript'],
    [ICONS[5], 'JavaScript'],
    [ICONS[6], 'HTML5'],
    [ICONS[7], 'CSS3'],
    [ICONS[8], 'Tailwind CSS'],
    [ICONS[9], 'Next.js'],
    [ICONS[10], 'Vercel'],
]);
