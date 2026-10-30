import PageFooter from '@/components/page-footer';
import EventPhoto from '@/components/event-photo';
import { journey } from '@/lib/journey-data';
import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { pageSocialMetadata, personJsonLd, siteUrl } from '@/lib/seo';
import { Fragment } from 'react';

export const metadata: Metadata = {
  title: 'About Akshay Abraham | Akshay K Rooben Abraham',
  description:
    'Photos from the journey of Akshay Abraham (Akshay K Rooben Abraham): Lyra, hackathons, YC Startup School India, and more.',
  alternates: { canonical: '/about' },
  ...pageSocialMetadata(
    'About Akshay Abraham | Akshay K Rooben Abraham',
    'Photos from the journey of Akshay Abraham (Akshay K Rooben Abraham): Lyra, hackathons, YC Startup School India, and more.',
    '/about',
    {
      url: '/events/akshay-abraham-aiboomi-kochi.webp',
      width: 1600,
      height: 1067,
      alt: 'Akshay Abraham (Akshay K Rooben Abraham) receiving first prize at AIBoomi Startup Weekend Kochi',
    }
  ),
};

export default function AboutPage() {
  const profileJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${siteUrl}/about#profile`,
    url: `${siteUrl}/about`,
    primaryImageOfPage: `${siteUrl}/events/akshay-abraham-aiboomi-kochi.webp`,
    mainEntity: personJsonLd,
    associatedMedia: journey.map((event) => ({
      '@type': 'ImageObject',
      contentUrl: `${siteUrl}${event.photo.src}`,
      name: event.photo.alt,
      caption: event.title,
      width: event.photo.width,
      height: event.photo.height,
      about: { '@id': personJsonLd['@id'] },
    })),
  };

  return (
    <div className="site-shell inner-page relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <header className="journey-header">
        <p className="eyebrow">About me</p>
        <h1>Journey.</h1>
        <p className="page-intro">
          I’m Akshay Abraham (Akshay K Rooben Abraham), a student and builder
          from Kottayam. User empathy shapes how I work: understanding someone’s
          needs and thinking through the whole experience.
        </p>
      </header>
      <section
        className="building-note section-reveal"
        aria-labelledby="building-heading"
      >
        <div>
          <p className="eyebrow">Where that takes shape</p>
          <h2 id="building-heading">What I’m working on.</h2>
        </div>
        <div>
          <p>
            <strong>Lyra is my primary focus</strong>, helping students reason
            through problems and build understanding. Alongside it, I’m building{' '}
            <strong>MNEMO</strong> for people in the early stages of memory
            loss, and <strong>Mitra</strong> as a caretaker system for later
            stages.
          </p>
          <Link href="/projects" className="action-text mt-4">
            Explore the projects <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section
        id="journey"
        className="journey-section"
        aria-labelledby="journey-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">The latest moments first</p>
            <h2 id="journey-heading">Along the way.</h2>
          </div>
          <p>People, projects, and the moments that changed how I build.</p>
        </div>
        <ol className="journey-timeline">
          {[...journey].reverse().map((event, index) => (
            <li key={event.title} className="journey-item section-reveal">
              <div className="journey-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="journey-event">
                <div className="journey-event-copy">
                  <p className="eyebrow">{event.tag}</p>
                  <h3>{event.title}</h3>
                  <p>
                    {event.highlight
                      ? event.detail
                          .split(event.highlight)
                          .map((part, index) => (
                            <Fragment key={index}>
                              {index > 0 && (
                                <strong className="journey-collaborator collaborator-name">
                                  {event.highlight}
                                </strong>
                              )}
                              {part}
                            </Fragment>
                          ))
                      : event.detail}
                  </p>
                </div>
                <EventPhoto title={event.title} {...event.photo} />
              </div>
            </li>
          ))}
        </ol>
        <a
          href="https://www.linkedin.com/in/akshayabraham37/recent-activity/all/"
          target="_blank"
          rel="noopener noreferrer"
          className="action-text mt-8"
        >
          More moments on LinkedIn <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </section>
      <section className="journey-outro">
        <p>Always learning as I go.</p>
        <Link href="/#contact" className="action-primary">
          Let’s talk <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>
      <PageFooter />
    </div>
  );
}
