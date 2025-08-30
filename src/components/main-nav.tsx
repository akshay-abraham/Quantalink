/**
 * @file src/components/main-nav.tsx
 * @description A responsive navigation component that renders the appropriate
 *              navigation bar based on the screen size (desktop or mobile).
 */
import DesktopNav from './desktop-nav';
import MobileNav from './mobile-nav';

/**
 * MainNav is the primary navigation container for the application.
 * It centrally manages and displays the correct navigation component.
 * @returns {JSX.Element} A div containing the responsive navigation.
 */
export default function MainNav() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="hidden md:block">
         <DesktopNav />
      </div>
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
