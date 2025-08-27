/**
 * @file src/components/about-me.tsx
 * @description This file is now unused and can be deleted. The content has been moved to src/app/about/page.tsx.
 * @note This component is no longer used in the application.
 */
"use client"

import { useInView } from '@/hooks/use-in-view';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * AboutMe component renders a short biography.
 * It uses a custom `useInView` hook to trigger a fade-in animation when the
 * component scrolls into the viewport, enhancing the user experience.
 * @returns {JSX.Element} The rendered "About Me" section.
 */
export default function AboutMe() {
  // A ref to the main section element to track its visibility.
  const ref = useRef<HTMLDivElement>(null);
  // The useInView hook returns true if the element is in the viewport.
  const isVisible = useInView(ref);

  return (
    <section 
      ref={ref}
      // `cn` is a utility to conditionally join class names.
      // The section is initially transparent and becomes opaque when visible.
      className={cn(
        "space-y-4 text-center transition-opacity duration-1000 ease-out",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{
        transitionDelay: isVisible ? '150ms' : '0ms'
      }}
    >
      <h2 
        className={cn(
          // The title animates in with a fade and upward translation.
          "text-2xl font-bold text-primary tracking-tight transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        About Me
      </h2>
      <p 
       className={cn(
          // The paragraph animates similarly, but with a slight delay.
          "text-foreground/80 text-left sm:text-center leading-relaxed transition-all duration-700",
           isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
        style={{
          transitionDelay: isVisible ? '200ms' : '0ms'
        }}
      >
        I am currently a Class 11 PCMB student at Girideepam Bethany Central School, pursuing a path toward theoretical physics. Alongside academics, I have been actively working with electronics and technology for over three years—ranging from practical electrical work in my neighborhood to building with Arduino, ESP boards, and sensors. I have experience with C, Python, and command-line tools like Git. At school, I have consistently taken up leadership roles since Class 9, including serving on the student council and as a Prefect, which has honed my ability to take responsibility, collaborate, and stay disciplined in group efforts. My goal is to develop skills in a real working environment and learn from people building in technology.
      </p>
    </section>
  )
}
