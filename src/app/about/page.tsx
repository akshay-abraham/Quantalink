/**
 * @file src/app/about/page.tsx
 * @description The dedicated "About Me" page.
 */
import AnimatedBackground from "@/components/animated-background";
import PageFooter from "@/components/page-footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';

// Page-specific metadata
export const metadata: Metadata = {
  title: 'About Me | Akshay K Rooben Abraham',
  description: 'Learn more about Akshay K Rooben Abraham, a Class 11 PCMB student with a passion for theoretical physics, electronics, and open-source technology.',
  alternates: {
    canonical: '/about',
  },
};

/**
 * AboutPage component renders a detailed biography.
 * @returns {JSX.Element} The rendered "About Me" page.
 */
export default function AboutPage() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          <header className="mb-8">
             <Link href="/" className="inline-block mb-8">
               <Button variant="outline" className="bg-card/30 border-border/40">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-primary tracking-tight text-center">
              About Me
            </h1>
          </header>
          <main>
             <div 
              className="bg-card/30 border border-border/40 rounded-2xl p-6 md:p-8 shadow-lg animate-fade-in-up"
            >
                <p className="text-foreground/80 text-left leading-relaxed">
                  I am currently a Class 11 PCMB student at Girideepam Bethany Central School, pursuing a path toward theoretical physics. Alongside academics, I have been actively working with electronics and technology for over three years—ranging from practical electrical work in my neighborhood to building with Arduino, ESP boards, and sensors. I have experience with C, Python, and command-line tools like Git. At school, I have consistently taken up leadership roles since Class 9, including serving on the student council and as a Prefect, which has honed my ability to take responsibility, collaborate, and stay disciplined in group efforts. My goal is to develop skills in a real working environment and learn from people building in technology.
                </p>
            </div>
          </main>
        </div>
        <div className="w-full max-w-4xl flex-grow" />
        <PageFooter />
      </div>
    </>
  );
}
