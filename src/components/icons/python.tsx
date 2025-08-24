/**
 * @file src/components/icons/python.tsx
 * @description A custom SVG icon component for the Python programming language.
 */
export const PythonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="https://commons.wikimedia.org/wiki/File:Python_icon_%28black_and_white%29.svg#/media/File:Python_icon_(black_and_white).svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* This is an abstract representation and not an official logo. */}
    <path d="M14.5 14.5c-1.33 1.33-3.67 1.33-5 0s-1.33-3.67 0-5" />
    <path d="M9.5 9.5c1.33-1.33 3.67-1.33 5 0s1.33 3.67 0 5" />
    <path d="M12 22a10 10 0 0 0 10-10h-5" />
    <path d="M2 12a10 10 0 0 1 10-10v5" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
