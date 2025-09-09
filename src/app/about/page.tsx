
/**
 * @file src/app/about/page.tsx
 * @description The dedicated "About Me" page, providing a detailed look at my journey.
 *              This page uses styled cards and icons for a dynamic presentation.
 */
import AnimatedBackground from "@/components/animated-background";
import PageFooter from "@/components/page-footer";
import { BookOpen, Telescope, Users } from "lucide-react";
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Page-specific metadata for SEO.
export const metadata: Metadata = {
  title: 'About Akshay K Rooben Abraham | My Journey',
  description: 'Learn more about Akshay K Rooben Abraham, a student with a passion for physics, electronics, and open-source technology.',
  // Provides the canonical URL for this page.
  alternates: {
    canonical: '/about',
  },
};

// Data for the different sections of the "About Me" page.
const aboutSections = [
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "My Studies",
    content: "I'm currently a high school student focusing on Physics, Chemistry, Math, and Biology (PCMB). I find the fundamental principles of science deeply fascinating and enjoy the process of learning how the world works.",
  },
  {
    icon: <Telescope className="h-8 w-8" />,
    title: "Curiosity & Hobbies",
    content: "Outside of my core subjects, I have a strong interest in electronics and how software and hardware can work together. For the past few years, I've enjoyed tinkering with Arduino and ESP boards, and I'm always trying to learn more about C, Python, and using tools like Git.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Collaboration",
    content: "I believe that working with others is one of the best ways to learn. In school, I've had opportunities to participate in group activities and student bodies, which has been a valuable experience in teamwork and responsibility.",
  }
];

/**
 * AboutPage component renders a detailed, sectioned biography.
 * @returns {JSX.Element} The rendered "About Me" page with animated sections.
 */
export default function AboutPage() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl">
          <header className="mb-12 text-center pt-20">
            <h1 className="text-4xl font-bold text-primary tracking-tight animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              About Me
            </h1>
            <p className="text-foreground/70 mt-2 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '350ms' }}>
              A little bit about my interests and journey.
            </p>
          </header>
          <main>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {aboutSections.map((section, index) => (
                <Card 
                  key={section.title}
                  className={cn(
                    "group relative overflow-hidden bg-card/30 border-border/40 rounded-2xl p-4 text-center shadow-lg animate-fade-in-up",
                    "transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
                  )}
                  style={{ animationDelay: `${500 + index * 150}ms`}}
                >
                  <div className="animate-border-glow"></div>
                  <div className="relative z-10">
                    <CardHeader className="flex flex-col items-center gap-4">
                      <div className="text-primary bg-primary/10 p-3 rounded-full transition-transform duration-300 group-hover:scale-110">
                        {section.icon}
                      </div>
                      <CardTitle className="text-xl text-primary">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80 leading-relaxed text-sm">
                        {section.content}
                      </p>
                    </CardContent>
                  </div>
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

    