import type { Ref } from 'react';
import { projects, projectPath } from '../data/projects';

export default function ContentPanel({ parent, child, titleRef, onReturn }: {
  parent: string;
  child: string;
  titleRef: Ref<HTMLHeadingElement>;
  onReturn: () => void;
}) {
  const project = parent === 'Projects' ? projects.find(({ title }) => title === child) : undefined;

  return (
    <section id="project-preview" className={project ? 'content-panel project-preview' : 'content-panel'}
      aria-labelledby="preview-title">
      {project && (
        'placeholder' in project.image ? (
          <div className="project-image-placeholder">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="5" y="8" width="38" height="32" rx="5" />
              <circle cx="17" cy="18" r="3" />
              <path d="m7 35 10-9 7 6 7-10 10 13" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>{project.image.placeholder}</p>
          </div>
        ) : <img className="project-image" {...project.image} loading="lazy" decoding="async" />
      )}
      <div className="preview-copy">
        <p className="section-eyebrow">{project ? 'Project' : parent}</p>
        <h2 id="preview-title" ref={titleRef} tabIndex={-1}>{child}</h2>
        <p className="preview-summary">{project?.summary ?? 'Content placeholder. Notes and links for this item can be added here once they are available.'}</p>
        {!!project?.metrics.length && (
          <dl className="project-metrics">
            {project.metrics.map(({ label, value }) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        )}
        <div className="preview-actions">
          {project && (
            <a className="explore-link" href={projectPath(project.slug)}>
              {project.placeholder ? 'Open project placeholder' : 'View Case Study'} <span aria-hidden="true">→</span>
            </a>
          )}
          {parent === 'Research' && <a className="explore-link" href="/research/">Research overview</a>}
          <button className="return-node" type="button" onClick={onReturn}>↑ Back to selected node</button>
        </div>
      </div>
    </section>
  );
}
