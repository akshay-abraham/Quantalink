import { GithubIcon } from '@/components/icons/github';
import { InstagramIcon } from '@/components/icons/instagram';
import { LinkedinIcon } from '@/components/icons/linkedin';

const profiles = [
  {
    label: 'GitHub',
    url: 'https://github.com/akshay-abraham/',
    display: 'akshay-abraham',
    Icon: GithubIcon,
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/akshay.abraham/',
    display: 'akshay.abraham',
    Icon: InstagramIcon,
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/akshayabraham37/',
    display: 'akshayabraham37',
    Icon: LinkedinIcon,
  },
];

export default function Home() {
  return (
    <section className="linkedin-cover" aria-labelledby="cover-heading">
      <div className="cover-avatar-space" aria-hidden="true" />
      <div className="cover-copy">
        <div className="cover-mark nav-glass" aria-hidden="true">
          <span className="brand-monogram">
            ak<span>.</span>
          </span>
        </div>
        <p className="eyebrow">
          Akshay K Rooben Abraham · Student &amp; builder
        </p>
        <h1 id="cover-heading" className="hero-title">
          Akshay
          <br />
          <span>Abraham.</span>
        </h1>
        <p className="cover-tagline">Creating systems · Building Lyra</p>
      </div>
      <aside
        className="cover-contact nav-glass"
        aria-label="Website and social profiles"
      >
        <p className="eyebrow">Explore my work</p>
        <a
          className="cover-website"
          href="https://akshayabraham.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          akshayabraham.vercel.app
        </a>
        <div className="cover-profiles">
          {profiles.map(({ label, url, display, Icon }) => (
            <a
              key={label}
              className="contact-link cover-profile"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label}: ${display}`}
            >
              <Icon className="cover-profile-icon" aria-hidden="true" />
              <span>{display}</span>
            </a>
          ))}
        </div>
      </aside>
    </section>
  );
}
