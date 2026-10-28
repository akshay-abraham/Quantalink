import { projects } from '@/lib/projects-data';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Projects({
  featuredOnly = false,
}: {
  featuredOnly?: boolean;
}) {
  const shown = featuredOnly ? projects.filter((p) => p.isFeatured) : projects;
  return (
    <section className="projects-section">
      {featuredOnly && (
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ideas, carried all the way through</p>
            <h2>Selected systems.</h2>
          </div>
          <p>
            Lyra leads the work. MNEMO and Mitra focus on people living with
            memory challenges.
          </p>
        </div>
      )}
      <div className="project-grid">
        {shown.map((project, index) => (
          <article
            key={project.title}
            className={`project-card section-reveal ${project.title === 'Lyra' ? 'project-primary' : ''}`}
          >
            <div className="project-card-top">
              <span className="project-index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="project-category">
                {project.category || 'Independent project'}
              </span>
            </div>
            <h3>{project.title}</h3>
            <p className="project-description">{project.description}</p>
            {project.collaborators && (
              <div className="project-credit">
                <span>Built together with</span>
                <strong className="collaborator-name">
                  {project.collaborators.join(', ')}
                </strong>
              </div>
            )}
            {(project.githubUrl || project.license) && (
              <div className="project-card-footer">
                {project.license && <span>{project.license}</span>}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Image
                      src="https://cdn.simpleicons.org/github/0F172A"
                      alt=""
                      width={16}
                      height={16}
                      unoptimized
                      aria-hidden="true"
                    />
                    Source
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
            {featuredOnly && (
              <div className="project-card-line" aria-hidden="true" />
            )}
          </article>
        ))}
      </div>
      {featuredOnly && (
        <div className="mt-7 flex justify-end">
          <Link href="/projects" className="action-text">
            All projects <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
