/**
 * @file src/components/icons/ubuntu.tsx
 * @description The official logo for Ubuntu as an SVG component.
 */
export const UbuntuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#E95420"
    {...props}
  >
    <circle cx="12" cy="12" r="11" fill="#fff" />
    <path d="M12 1a11 11 0 100 22 11 11 0 000-22zM6.5 7.7c1.4 0 2.5 1.1 2.5 2.5S7.9 12.7 6.5 12.7s-2.5-1.1-2.5-2.5S5.1 7.7 6.5 7.7zm11 0c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5zm-5.5 8.6c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
  </svg>
);
