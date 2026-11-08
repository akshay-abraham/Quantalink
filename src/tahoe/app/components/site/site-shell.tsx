import Link from "next/link";
import React from "react";
import MobilePortfolioNav from "../mobile/mobile-portfolio-nav";
import type { Profile } from "../../lib/content/schema";

const navigation = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Journey" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const SiteShell: React.FC<{
  profile: Profile;
  children: React.ReactNode;
}> = ({ profile, children }) => {
  const externalLinks: { label: string; href: string }[] = [];
  if (profile.links.github)
    externalLinks.push({ label: "GitHub", href: profile.links.github });
  if (profile.links.linkedin)
    externalLinks.push({ label: "LinkedIn", href: profile.links.linkedin });

  return (
    <div className="site-shell">
      <a
        href="#content"
        className="fixed left-4 top-3 z-20 -translate-y-16 rounded-full bg-site-surface px-4 py-2 text-13 text-site-fg shadow-lg transition-transform focus:translate-y-0 motion-reduce:transition-none"
      >
        Skip to content
      </a>

      <MobilePortfolioNav profile={profile} />

      <header className="site-desktop-header sticky top-0 z-10 border-b border-site-rule bg-site-header backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-5 py-3 md:h-14 md:flex-row md:items-center md:justify-between md:gap-6 md:px-8 md:py-0">
          <Link
            href="/"
            className="text-15 font-semibold tracking-tight hover:text-site-accent"
          >
            {profile.name}
          </Link>
          <nav
            aria-label="Portfolio sections"
            className="flex flex-wrap items-center gap-x-5 gap-y-1 text-13 text-site-muted"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-site-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main
        id="content"
        className="mx-auto max-w-3xl px-5 pb-24 pt-12 md:px-8 md:pt-16"
      >
        {children}
      </main>

      <footer className="site-desktop-footer border-t border-site-rule">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-10 text-13 text-site-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            {profile.name} — {profile.role}
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="hover:text-site-fg"
              >
                Email
              </a>
            </li>
            {externalLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-site-fg"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href={profile.cv} className="hover:text-site-fg">
                Portfolio overview (PDF)
              </a>
            </li>
            <li>
              <Link href="/" className="hover:text-site-fg">
                Desktop version
              </Link>
            </li>
          </ul>
        </div>
      </footer>

      <footer className="site-mobile-footer">
        <p>
          {profile.name} — {profile.role}
        </p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <Link href="/">Back to home</Link>
      </footer>
    </div>
  );
};

export default SiteShell;
