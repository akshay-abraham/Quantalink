'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Keep links to the canonical home inside the Safari site view. */
export default function EmbeddedHomeNavigation() {
  const router = useRouter();

  useEffect(() => {
    if (window.self === window.top) return;

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (
        !(anchor instanceof HTMLAnchorElement) ||
        (anchor.target && anchor.target !== '_self')
      )
        return;
      const destination = new URL(anchor.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname !== '/'
      )
        return;
      event.preventDefault();
      router.push(`/site${destination.search}${destination.hash}`);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return null;
}
