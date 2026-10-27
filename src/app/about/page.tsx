import PageFooter from '@/components/page-footer';
import EventPhoto from '@/components/event-photo';
import { journey } from '@/lib/journey-data';
import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Journey | Akshay K Rooben Abraham',
  description:
    'From my first school AI workshop to hackathons and YC Startup School India: creating systems through user empathy.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="site-shell inner-page relative z-10">
      <header className="journey-header hero-enter">
        <p className="eyebrow">The person behind the projects</p>
        <h1>My journey.</h1>
        <p className="page-intro">
          I’m Akshay, a student and builder from Kottayam. User empathy shapes
          how I work: understanding someone’s needs and thinking through the
          whole experience.
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
