/**
 * @file src/components/icons/htmlcss.tsx
 * @description A custom SVG icon component representing HTML and CSS.
 */
export const HtmlCssIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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
    <path d="M12 19l-7-3 7-13 7 13-7 3z" />
    <path d="M12 19v-6" />
    <path d="m5 16 7-3" />
    <path d="m19 16-7-3" />
    <path d="m12 10-7 6" />
    <path d="m12 10 7 6" />
    <path d="M2 12h20" />
  </svg>
);
