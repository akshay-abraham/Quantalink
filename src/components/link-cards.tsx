import { ArrowUpRight } from 'lucide-react';
import { LinkedinIcon } from './icons/linkedin';
import { InstagramIcon } from './icons/instagram';
import { GithubIcon } from './icons/github';
import { WhatsappIcon } from './icons/whatsapp';

const links = [
  {
    href: 'https://www.linkedin.com/in/akshayabraham37/',
    title: 'LinkedIn',
    Icon: LinkedinIcon,
  },
  {
    href: 'https://github.com/akshay-abraham/',
    title: 'GitHub',
    Icon: GithubIcon,
  },
  {
    href: 'https://www.instagram.com/akshay.abraham/',
    title: 'Instagram',
    Icon: InstagramIcon,
  },
  { href: 'https://wa.me/919946141445', title: 'WhatsApp', Icon: WhatsappIcon },
];

export default function LinkCards() {
  return (
    <section
      id="contact"
      className="contact-section section-reveal"
      aria-labelledby="contact-heading"
    >
      <div>
        <p className="eyebrow">Contact</p>
        <h2 id="contact-heading">Get in touch.</h2>
        <p className="contact-intro">
          For a project, a question, or a conversation.
        </p>
        <a
          href="mailto:akshaykroobenabraham@gmail.com"
          className="contact-email"
        >
          Say hello by email <ArrowUpRight size={20} aria-hidden="true" />
        </a>
        <p className="contact-address">akshaykroobenabraham@gmail.com</p>
      </div>
      <div className="contact-links">
        {links.map(({ href, title, Icon }) => (
          <a
            key={title}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <Icon className="h-5 w-5" />
            <span>{title}</span>
            <ArrowUpRight className="ml-auto h-4 w-4" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
