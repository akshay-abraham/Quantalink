import { Children, type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface InfiniteScrollerProps {
  children: ReactNode;
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
}

export function InfiniteScroller({
  children,
  speed = 'normal',
  direction = 'left',
  pauseOnHover = true,
}: InfiniteScrollerProps) {
  const items = Children.toArray(children);
  const style = {
    '--animation-duration': { slow: '65s', normal: '45s', fast: '25s' }[speed],
    '--animation-direction': direction === 'left' ? 'normal' : 'reverse',
  } as CSSProperties;
  return (
    <div
      className={cn('skills-marquee', pauseOnHover && 'pause-on-hover')}
      style={style}
    >
      <div className="skill-track">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="skill-track-group"
            aria-hidden={copy === 1 || undefined}
            inert={copy === 1 || undefined}
          >
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
