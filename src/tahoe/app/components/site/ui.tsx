import React from "react";

export const PageHeader: React.FC<{
  title: string;
  lede?: React.ReactNode;
}> = ({ title, lede }) => (
  <header className="border-b border-site-rule pb-10">
    <h1 className="text-36 font-semibold leading-[1.1] tracking-tight">
      {title}
    </h1>
    {lede && (
      <p className="mt-4 max-w-2xl text-17 leading-7 text-site-muted">{lede}</p>
    )}
  </header>
);

export const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <section className="mt-14">
    <h2 className="text-20 font-semibold tracking-tight">{title}</h2>
    <div className="mt-5">{children}</div>
  </section>
);

export const Chips: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="flex flex-wrap gap-2">
    {items.map((item) => (
      <li
        key={item}
        className="rounded-full border border-site-rule bg-site-surface px-3 py-1 text-12 text-site-muted"
      >
        {item}
      </li>
    ))}
  </ul>
);

/** External link that says where it goes and opens in a new tab. */
export const ExternalLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
}> = ({ href, children, className }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    className={className ?? "text-site-accent hover:underline"}
  >
    {children}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);
