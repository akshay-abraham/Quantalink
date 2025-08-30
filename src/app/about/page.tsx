/**
 * @file src/app/about/page.tsx
 * @description The dedicated "About Me" page, redesigned for a more dynamic and engaging presentation.
 */
import AnimatedBackground from "@/components/animated-background";
import PageFooter from "@/components/page-footer";
import { ArrowLeft, Target, Cpu, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Page-specific metadata
export const metadata: Metadata = {
  title: 'About Me | Akshay K Rooben Abraham',
  description: 'Learn more about Akshay K Rooben Abraham, a Class 11 PCMB student with a passion for theoretical physics, electronics, and open-source technology.',
  alternates: {
    canonical: '/about',
  },
};

const aboutSections = [
  {
    icon: <Target className="h-8 w-8" />,
    title: "Academic Aspiration",
    content: "I am currently a Class 11 PCMB student at Girideepam Bethany Central School, pursuing a path toward theoretical physics. My academic goal is to build a deep, foundational understanding of the principles that govern our universe.",
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "Technical Journey",
    content: "Alongside academics, I have been actively working with electronics and technology for over three years—ranging from practical electrical work to building with Arduino, ESP boards, and sensors. I have experience with C, Python, and command-line tools like Git.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Leadership & Collaboration",
    content: "At school, I have consistently taken up leadership roles since Class 9, including serving on the student council and as a Prefect. These experiences have honed my ability to take responsibility, collaborate, and stay disciplined in group efforts.",
  }
];

/**
 * AboutPage component renders a detailed, sectioned biography.
 * @returns {JSX.Element} The rendered "About Me" page.
 */
export default function AboutPage() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl">
          <header className="mb-12 text-center">
             <Link href="/" className="inline-block mb-8">
               <Button variant="outline" className="bg-card/30 border-border/40">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-primary tracking-tight">
              My Story
            </h1>
            <p className="text-foreground/70 mt-2 max-w-2xl mx-auto">
              A brief look into my academic, technical, and personal journey.
            </p>
          </header>
          <main>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {aboutSections.map((section, index) => (
                <Card 
                  key={section.title}
                  className="bg-card/30 border-border/40 rounded-2xl p-6 text-center shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${200 + index * 150}ms`}}
                >
                  <CardHeader className="flex flex-col items-center gap-4">
                    <div className="text-primary bg-primary/10 p-3 rounded-full">
                      {section.icon}
                    </div>
                    <CardTitle className="text-xl text-primary">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 leading-relaxed text-sm">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
        <div className="w-full max-w-4xl flex-grow" />
        <PageFooter />
      </div>
    </>
  );
}
