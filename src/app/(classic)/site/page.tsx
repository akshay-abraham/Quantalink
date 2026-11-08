import type { Metadata } from 'next';
import ClassicHome from '@/components/classic-home';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: '/' },
};

export default ClassicHome;
