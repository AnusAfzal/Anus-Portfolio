import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { projectsData as staticProjects, personalInfo } from "../data/portfolioData";
import { getPublishedProjects } from "../services/projectService";
import { isSupabaseConfigured } from "../lib/supabase";

export default function Projects() {
  const [projects, setProjects] = useState(staticProjects);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    getPublishedProjects()
      .then(({ data }) => {
        if (isMounted && data && data.length > 0) {
          setProjects(data);
        }
      })
      .catch((err) => {
        console.warn("[Projects] Error loading projects from backend, using fallback:", err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { label: "All", count: projects.length },
    {
      label: "Full Stack",
      count: projects.filter((p) => p.category === "Full Stack").length,
    },
    {
      label: "Mobile",
      count: projects.filter((p) => p.category === "Mobile").length,
    },
    {
      label: "Frontend",
      count: projects.filter((p) => p.category === "Frontend").length,
    },
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section className="section-container content-section" id="projects" aria-labelledby="projects-heading">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <span className="section-eyebrow">03 / SELECTED PROJECTS</span>
        <h2 id="projects-heading" className="section-title">
          Things I've <span className="text-highlight">built & engineered.</span>
        </h2>
        <p className="section-subtitle">
          Projects spanning cross-platform mobile apps, dynamic full-stack systems, and
          frontend API integrations.
        </p>
      </motion.div>

      {/* Category Filter Tabs */}
      <div className="filter-tabs-wrapper" role="tablist" aria-label="Filter projects by category">
        {categories.map((cat) => (
          <button
            key={cat.label}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.label}
            className={`filter-tab ${activeCategory === cat.label ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.label)}
          >
            <span>{cat.label}</span>
            <span className="filter-count font-mono">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="projects-loading-state font-mono" role="status">
          <Loader2 size={24} className="spin text-accent" aria-hidden="true" />
          <span>Synchronizing project records from Supabase...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="projects-empty-state font-mono">
          <p>No projects found in the "{activeCategory}" category.</p>
        </div>
      ) : (
        /* Projects Grid */
        <div className="projects-grid">
          {filteredProjects.map((project, index) => {
            const isInDevelopment = project.statusType === "progress" || project.status === "In Development";

            return (
              <motion.article
                key={project.id || project.slug || index}
                className="project-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: (index % 3) * 0.1 }}
              >
                <div className="project-card-header">
                  <div className="project-meta-top">
                    <span className="project-index font-mono">{project.number || `0${index + 1}`}</span>
                    <span className="project-category-badge font-mono">
                      {project.categoryLabel || `${project.category} Project`}
                    </span>
                  </div>

                  <div
                    className={`project-status-pill font-mono ${
                      isInDevelopment ? "status-dev" : "status-complete"
                    }`}
                  >
                    {isInDevelopment ? (
                      <>
                        <Clock size={12} aria-hidden="true" />
                        <span>In Development</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={12} aria-hidden="true" />
                        <span>Completed</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="project-card-body">
                  <h3 className="project-title">{project.name || project.title}</h3>
                  <p className="project-description">
                    {project.shortDescription || project.description}
                  </p>

                  {/* Key Highlights */}
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="project-highlights">
                      {project.highlights.map((item, hIdx) => (
                        <li key={hIdx}>
                          <span className="highlight-bullet">▹</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="project-card-footer">
                  {/* Tech Badges */}
                  <div className="project-tags" aria-label="Technologies used">
                    {(project.technologies || []).map((tech) => (
                      <span key={tech} className="tech-badge font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Links */}
                  <div className="project-actions">
                    <a
                      href={project.githubUrl || project.github_url || "https://github.com/AnusAfzal"}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="project-action-link"
                      aria-label={`View ${project.name || project.title} source code on GitHub (opens in new tab)`}
                      title="GitHub Repository"
                    >
                      <FaGithub size={15} aria-hidden="true" />
                      <span>Source</span>
                      <ArrowUpRight size={13} className="action-arrow" aria-hidden="true" />
                    </a>

                    {project.demoUrl || project.live_url ? (
                      <a
                        href={project.demoUrl || project.live_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="project-action-link primary"
                        aria-label={`Open live demo of ${project.name || project.title}`}
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                        <span>Live Demo</span>
                      </a>
                    ) : (
                      <span className="project-action-status font-mono">
                        {isInDevelopment ? "Mobile App Preview" : "Frontend Demo"}
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* GitHub Callout Footer */}
      <motion.div
        className="projects-callout-card"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
      >
        <div className="callout-content">
          <FaGithub size={28} className="callout-github-icon" aria-hidden="true" />
          <div>
            <h4 className="callout-title">Interested in more code repositories?</h4>
            <p className="callout-desc">
              Explore my full commit history, experiments, and university assignments on GitHub.
            </p>
          </div>
        </div>

        <a
          href={personalInfo.github}
          target="_blank"
          rel="noreferrer noopener"
          className="button-primary callout-btn"
          aria-label="Visit Anus Afzal's GitHub profile (opens in new tab)"
        >
          <span>Visit GitHub Profile</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </motion.div>
    </section>
  );
}
