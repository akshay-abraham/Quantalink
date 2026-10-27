import PageFooter from '@/components/page-footer';
import EventPhoto from '@/components/event-photo';
import { journey } from '@/lib/journey-data';
import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { pageSocialMetadata, personJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Akshay Abraham | Journey & Projects',
  description:
    'Learn about Akshay Abraham, a student and builder from Kottayam. Follow his journey from a school AI workshop to hackathons, Lyra, and YC Startup School India.',
  alternates: { canonical: '/about' },
  ...pageSocialMetadata(
    'About Akshay Abraham | Journey & Projects',
    'Follow Akshay Abraham’s journey through Lyra, hackathons, and YC Startup School India.',
    '/about'
  ),
};

export default function AboutPage() {
  const profileJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://akshayabraham.vercel.app/about#profile',
    url: 'https://akshayabraham.vercel.app/about',
    mainEntity: personJsonLd,
  };

  return (
    <div className="site-shell inner-page relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <header className="journey-header hero-enter">
        <p className="eyebrow">The person behind the projects</p>
        <h1>About Akshay Abraham.</h1>
        <p className="page-intro">
          I’m Akshay Abraham, a student and builder from Kottayam. User empathy
          shapes how I work: understanding someone’s needs and thinking through
          the whole experience.
        </p>
      </header>
      <section
        className="building-note section-reveal"
        aria-labelledby="profile-heading"
      >
        <div>
          <p className="eyebrow">At a glance</p>
          <h2 id="profile-heading">Who I am.</h2>
        </div>
        <div>
          <p>
            My full name is <strong>Akshay K Rooben Abraham</strong>. I’m based
            in Kottayam, Kerala, India, and I build projects across AI learning,
            voice tools, and connected devices.
          </p>
          <p className="mt-4">
            My main project is <strong>Lyra</strong>, an AI learning system that
            helps students reason through problems. I also work on{' '}
            <strong>MNEMO</strong>, a voice-first knowledge companion, and{' '}
            <strong>Mitra</strong>, a wearable caretaker system.
          </p>
          <p className="mt-4">
            You can verify my work through my{' '}
            <a href="https://github.com/akshay-abraham/">GitHub</a> and follow
            my updates on{' '}
            <a href="https://www.linkedin.com/in/akshayabraham37/">LinkedIn</a>.
          </p>
        </div>
      </section>
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
            <strong>MNEMO</strong> for voice-first knowledge and{' '}
            <strong>Mitra</strong> for everyday care and companionship.
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
            <h2 id="journey-heading">The journey so far.</h2>
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
                  <p>{event.detail}</p>
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
