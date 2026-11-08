'use client';

import { useEffect, useState } from 'react';

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
