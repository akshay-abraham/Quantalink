'use client';

import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EventPhotoProps {
  title: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function EventPhoto({
  title,
  src,
  alt,
  width,
  height,
}: EventPhotoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`View photo: ${title}`}
          className="journey-photo-button group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 1200px) 480px, (min-width: 768px) 40vw, calc(100vw - 110px)"
            className="max-h-[340px] h-auto w-full object-contain"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white transition-colors group-hover:bg-black/85">
            <ZoomIn aria-hidden="true" className="h-3.5 w-3.5" />
            View photo
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-2xl bg-background p-4 sm:p-6">
        <DialogTitle className="pr-7 text-left text-lg leading-snug">
          {title}
        </DialogTitle>
        <DialogDescription className="sr-only">{alt}</DialogDescription>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 1024px) 976px, calc(100vw - 64px)"
          className="max-h-[72dvh] h-auto w-full rounded-lg object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
