'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import AppleLogo from '@/tahoe/app/assets/icons/apple.png';

export default function DesktopExperience() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => {
      setIsDesktop(media.matches);
      if (!media.matches) setIsReady(false);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <div className="desktop-frame-host" aria-label="Tahoe desktop">
      <div className="desktop-boot-placeholder" aria-hidden="true">
        <Image src={AppleLogo} alt="" width={70} height={86} />
      </div>
      {isDesktop && (
        <iframe
          src="/os"
          title="Akshay Tahoe desktop"
          className={`desktop-frame${isReady ? ' is-ready' : ''}`}
          onLoad={() => setIsReady(true)}
          allowFullScreen
        />
      )}
    </div>
  );
}
