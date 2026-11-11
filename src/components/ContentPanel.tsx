import { useEffect, type Ref } from 'react';
import { durations } from '../scripts/motion';
import { projects, projectPath } from '../data/projects';

export default function ContentPanel({ parent, child, titleRef, onReturn, leaving = false, onExited }: {
  parent: string;
  child: string;
  titleRef?: Ref<HTMLHeadingElement>;
  onReturn: () => void;
  /** A cleared preview stays mounted, inert and without ids, while it animates out. */
  leaving?: boolean;
  onExited?: () => void;
}) {
  const project = parent === 'Projects' ? projects.find(({ title }) => title === child) : undefined;

  useEffect(() => {
    if (!leaving) return;
    // The exit animation normally ends first; this covers reduced motion switching on mid-exit.
    const timer = window.setTimeout(() => onExited?.(), durations.panel + 120);
    return () => clearTimeout(timer);
  }, [leaving]);

  return (
    <section id={leaving ? undefined : 'project-preview'} className={project ? 'content-panel project-preview' : 'content-panel'}
      aria-labelledby={leaving ? undefined : 'preview-title'} data-leaving={leaving || undefined} inert={leaving}
      aria-hidden={leaving || undefined}
      onAnimationEnd={(event) => {
        if (leaving && event.target === event.currentTarget) onExited?.();
      }}>
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
        {leaving ? <h2>{child}</h2>
          : <h2 id="preview-title" data-morph-preview ref={titleRef} tabIndex={-1}>{child}</h2>}
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
            <a className="explore-link" data-morph-open href={projectPath(project.slug)}>
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
