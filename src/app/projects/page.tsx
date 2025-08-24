/**
 * @file src/app/projects/page.tsx
 * @description The dedicated page for showcasing all projects and contributions.
 *              This page provides a more comprehensive view than the "featured"
 *              section on the homepage.
 */
import AnimatedBackground from "@/components/animated-background";
import PageFooter from "@/components/page-footer";
import Projects from "@/components/projects";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * ProjectsPage component that displays a complete list of all projects.
 * @returns {JSX.Element} The rendered projects page.
 */
export default function ProjectsPage() {
  return (
    <>
      {/* The animated background is included here as well for a consistent look. */}
      <AnimatedBackground />
      {/* `relative z-10` ensures content is displayed above the background. */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-3xl">
          <header className="mb-8">
            {/* A navigation link to return to the homepage. */}
            <Link href="/" className="inline-block mb-8">
               <Button variant="outline" className="bg-card/30 border-border/40">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-primary tracking-tight text-center">
              Projects & Contributions
            </h1>
          </header>

          {/* An informational box providing context about the project timeline. */}
          <div className="bg-card/30 border border-border/40 rounded-lg p-4 text-center text-sm text-foreground/70 mb-8 italic">
            I started doing public projects only from August 2025. All previous work isn’t recorded here. Projects shown here are on GitHub, with licenses ranging between MIT and GNU GPL v3.
          </div>
          
          {/* The Projects component is rendered here without the `featuredOnly` prop,
              so it displays all projects from the data source. */}
          <Projects />
        </div>
      </div>
      <PageFooter />
    </>
  );
}
