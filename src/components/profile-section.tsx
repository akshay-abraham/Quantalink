import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function ProfileSection() {
  return (
    <section className="hero-grid" aria-labelledby="intro-heading">
      <div className="hero-copy">
        <p className="eyebrow hero-enter">
          Akshay K Rooben Abraham · Student &amp; builder
        </p>
        <h1
          id="intro-heading"
          className="hero-title hero-enter"
          style={{ animationDelay: '90ms' }}
        >
          Akshay
          <br />
          <span>Abraham.</span>
        </h1>
        <p
          className="hero-tagline hero-enter"
          style={{ animationDelay: '140ms' }}
        >
          Creating systems · Building Lyra
        </p>
        <p className="hero-lead hero-enter" style={{ animationDelay: '180ms' }}>
          I’m a student who likes building useful things. User empathy guides
          how I work: understanding what people need, then building the pieces
          that work together for them.
        </p>
        <div
          className="hero-actions hero-enter"
          style={{ animationDelay: '270ms' }}
        >
          <Link href="#work" className="action-primary">
            Explore my work <ArrowDownRight size={17} aria-hidden="true" />
          </Link>
          <Link href="/about" className="action-text">
            The story so far <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div
          className="hero-current hero-enter"
          style={{ animationDelay: '360ms' }}
        >
          <span className="status-dot" aria-hidden="true" />
          <p>
            <span>
              Primary focus: <strong>Lyra</strong>
            </span>
            <span className="block text-foreground/55">
              Also building MNEMO &amp; Mitra
            </span>
          </p>
        </div>
      </div>
      <div
        className="hero-portrait hero-enter"
        style={{ animationDelay: '180ms' }}
      >
        <div className="portrait-orbit" aria-hidden="true" />
        <div className="portrait-frame">
          <div className="portrait-topline">
            <span>A little about me</span>
            <span>01 / AK</span>
          </div>
          <Image
            src="/akshay-abraham-aiboomi-portrait.webp"
            alt="Akshay Abraham speaking about Lyra at AIBoomi Startup Weekend Kochi"
            width={640}
            height={640}
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 380px, 85vw"
            preload
            className="portrait-image"
          />
          <div className="portrait-caption">
            <span className="eyebrow">Student &amp; builder</span>
            <p>Learning by building.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
