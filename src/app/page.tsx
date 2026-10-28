import ProfileSection from '@/components/profile-section';
import LinkCards from '@/components/link-cards';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageFooter from '@/components/page-footer';
import Skills from '@/components/skills';
import EasterEgg from '@/components/easter-egg';
import Projects from '@/components/projects';

export default function Home() {
  return (
    <div className="site-shell relative z-10">
      <ProfileSection />
      <div id="work" className="home-section section-reveal">
        <Projects featuredOnly />
      </div>
      <section
        className="journey-preview section-reveal"
        aria-labelledby="journey-preview-heading"
      >
        <div className="journey-preview-copy">
          <p className="eyebrow">A few moments along the way</p>
          <h2 id="journey-preview-heading">Journey.</h2>
          <p>The people and projects that shaped how I build.</p>
          <Link href="/about" className="action-text">
            Explore my journey <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="journey-preview-photos">
          <Image
            src="/events/akshay-abraham-aiboomi-kochi.webp"
            alt="Akshay Abraham receiving first prize at AIBoomi Startup Weekend Kochi"
            width={1600}
            height={1067}
            sizes="(max-width: 767px) 24vw, 120px"
          />
          <Image
            src="/events/akshay-abraham-hack4future-2025.webp"
            alt="Akshay Abraham at Hack4Future 2025 in Kochi"
            width={1600}
            height={1067}
            sizes="(max-width: 767px) 24vw, 120px"
          />
          <Image
            src="/events/akshay-abraham-yc-startup-school-india.webp"
            alt="Akshay Abraham at Y Combinator Startup School India"
            width={1600}
            height={900}
            sizes="(max-width: 767px) 24vw, 120px"
          />
        </div>
      </section>
      <div className="home-section section-reveal">
        <Skills />
      </div>
      <section
        className="setup-section section-reveal"
        aria-labelledby="setup-heading"
      >
        <div className="setup-icons" aria-hidden="true">
          <Image
            src="https://cdn.simpleicons.org/fedora/51A2DA"
            alt=""
            width={42}
            height={42}
            unoptimized
          />
          <span>+</span>
          <Image
            src="https://cdn.simpleicons.org/kde/1D99F3"
            alt=""
            width={42}
            height={42}
            unoptimized
          />
        </div>
        <div>
          <p className="eyebrow">Fedora KDE · My daily desktop</p>
          <h2 id="setup-heading">My everyday setup.</h2>
          <p>
            Fedora KDE is where I do most of my work. My dotfiles and setup
            notes are in tachyon-dots, if you’d like to put together a similar
            desktop.
          </p>
        </div>
        <a
          href="https://github.com/akshay-abraham/tachyon-dots"
          target="_blank"
          rel="noopener noreferrer"
          className="action-text"
        >
          Explore my setup <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </section>
      <LinkCards />
      <div className="home-section">
        <EasterEgg />
      </div>
      <PageFooter />
    </div>
  );
}
