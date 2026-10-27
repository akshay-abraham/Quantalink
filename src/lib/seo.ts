export const siteUrl = 'https://akshayabraham.vercel.app';
export const socialImage = '/akshay-abraham-portfolio.png';

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
          alt: 'Akshay Abraham speaking at AIBoomi Startup Weekend Kochi',
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
