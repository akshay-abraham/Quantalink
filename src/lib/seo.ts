export const siteUrl = 'https://akshayabraham.vercel.app';
export const socialImage = '/akshay-abraham-portfolio.png';

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: 'Akshay Abraham',
  alternateName: 'Akshay K Rooben Abraham',
  url: siteUrl,
  image: `${siteUrl}/akshay-abraham-aiboomi-portrait.webp`,
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
  path: string
) {
  return {
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName: 'Akshay Abraham | Quantalink',
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: 'Akshay Abraham portfolio introduction with his AIBoomi portrait',
        },
      ],
      locale: 'en_US',
      type: 'website' as const,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [socialImage],
    },
  };
}
