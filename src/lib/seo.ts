export const siteUrl = 'https://akshayabraham.vercel.app';
export const socialImage = '/akshay-abraham-portfolio.png';

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'Akshay Abraham',
  alternateName: 'Quantalink',
};

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: 'Akshay Abraham',
  alternateName: 'Akshay K Rooben Abraham',
  url: siteUrl,
  image: {
    '@type': 'ImageObject',
    contentUrl: `${siteUrl}/akshay-abraham-aiboomi-portrait.webp`,
    name: 'Portrait of Akshay Abraham (Akshay K Rooben Abraham)',
    width: 640,
    height: 640,
  },
  description:
    'Student and builder from Kottayam creating Lyra, MNEMO, and Mitra.',
  homeLocation: {
    '@type': 'Place',
    name: 'Kottayam, Kerala, India',
  },
  sameAs: [
    'https://www.linkedin.com/in/akshayabraham37/',
    'https://github.com/akshay-abraham/',
    'https://www.instagram.com/akshay.abraham/',
  ],
};

export function pageSocialMetadata(
  title: string,
  description: string,
  path: string,
  image: {
    url: string;
    width: number;
    height: number;
    alt: string;
  } = {
    url: socialImage,
    width: 1200,
    height: 630,
    alt: 'Akshay Abraham (Akshay K Rooben Abraham) portfolio introduction with his AIBoomi portrait',
  }
) {
  return {
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName: 'Akshay Abraham',
      images: [image],
      locale: 'en_US',
      type: 'website' as const,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
