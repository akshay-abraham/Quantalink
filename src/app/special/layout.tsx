/**
 * @file src/app/special/layout.tsx
 * @description A custom layout for the special page.
 *              This layout is nearly identical to the root layout but specifically
 *              omits the <GuidedTour /> component to provide a focused experience.
 *              It also imports a custom font for the special event cards.
 */
import type { Metadata } from 'next';

// Metadata is now handled in the page.tsx file for more dynamic control.

/**
 * SpecialLayout component serves as the template for the /special route.
 * It simply passes its children through, as the main structural elements
 * are handled by the root layout. The unique font is loaded in the root layout.
 * @param {Readonly<{ children: React.ReactNode }>} props - The props object.
 * @returns {JSX.Element} The child components for the special page.
 */
export default function SpecialLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
