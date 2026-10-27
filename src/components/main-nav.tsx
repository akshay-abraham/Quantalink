import Link from 'next/link';
import DesktopNav from './desktop-nav';
import MobileNav from './mobile-nav';

export default function MainNav() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <Link
          href="/"
          className="site-brand"
          aria-label="Akshay Abraham  ·  home"
        >
          <span className="brand-monogram">
            ak<span>.</span>
          </span>
          <span className="brand-label">Akshay Abraham</span>
        </Link>
        <div className="hidden md:block">
          <DesktopNav />
        </div>
      </header>
      <div className="mobile-nav-anchor fixed right-4 top-4 z-50 h-12 w-12 md:hidden">
        <MobileNav />
      </div>
    </>
  );
}
