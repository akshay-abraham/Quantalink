/**
 * @file src/lib/tech-sphere-data.tsx
 * @description Data for the 3D rotating tech sphere on the homepage.
 *              Each item in the array represents a logo to be displayed.
 * @note This must be a .tsx file to import and use React components (icons).
 */
import { ReactIcon } from "@/components/icons/react";
import { PythonIcon } from "@/components/icons/python";
import { CPlusPlusIcon } from "@/components/icons/cplusplus";
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
    <CPlusPlusIcon key="cplusplus" />,
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
    [ICONS[2], 'C++'],
    [ICONS[3], 'Git'],
    [ICONS[4], 'GitHub'],
    [ICONS[5], 'TypeScript'],
    [ICONS[6], 'JavaScript'],
    [ICONS[7], 'HTML5'],
    [ICONS[8], 'CSS3'],
    [ICONS[9], 'Tailwind CSS'],
    [ICONS[10], 'Next.js'],
    [ICONS[11], 'Vercel'],
]);
