import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { skillsData } from "../data/portfolioData";

export default function Skills() {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = [
    { label: "All", count: skillsData.length },
    { label: "Frontend", count: skillsData.filter((s) => s.category === "Frontend").length },
    { label: "Backend", count: skillsData.filter((s) => s.category === "Backend").length },
    { label: "Database", count: skillsData.filter((s) => s.category === "Database").length },
    { label: "Tools", count: skillsData.filter((s) => s.category === "Tools").length },
    { label: "Learning", count: skillsData.filter((s) => s.category === "Learning").length },
  ];

  const filteredSkills =
    activeFilter === "All"
      ? skillsData
      : skillsData.filter((s) => s.category === activeFilter);

  return (
    <section className="section-container content-section" id="skills" aria-labelledby="skills-heading">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <span className="section-eyebrow">02 / TECHNICAL SKILLS</span>
        <h2 id="skills-heading" className="section-title">
          My technical <span className="text-highlight">toolkit.</span>
        </h2>
        <p className="section-subtitle">
          Technologies and tools verified by practical implementation in my projects.
          Currently learning technologies are marked transparently.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="filter-tabs-wrapper" role="tablist" aria-label="Filter skills by category">
        {categories.map((cat) => (
          <button
            key={cat.label}
            type="button"
            role="tab"
            aria-selected={activeFilter === cat.label}
            className={`filter-tab ${activeFilter === cat.label ? "active" : ""}`}
            onClick={() => setActiveFilter(cat.label)}
          >
            <span>{cat.label}</span>
            <span className="filter-count font-mono">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="skills-grid">
        {filteredSkills.map((skill, index) => {
          const Icon = skill.icon;
          const isLearning = skill.status === "Learning";

          return (
            <motion.article
              key={skill.name}
              className={`skill-card ${isLearning ? "skill-learning" : ""}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.35, delay: (index % 6) * 0.04 }}
            >
              <div className="skill-card-top">
                <div className="skill-icon-wrapper">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <span
                  className={`skill-status-tag font-mono ${
                    isLearning ? "tag-learning" : "tag-core"
                  }`}
                >
                  {skill.status}
                </span>
              </div>

              <div className="skill-card-info">
                <h3 className="skill-name">{skill.name}</h3>
                <span className="skill-category font-mono">{skill.category}</span>
                <p className="skill-description">{skill.description}</p>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Skills Footer Note */}
      <div className="skills-meta-box">
        <div className="skills-meta-item">
          <CheckCircle2 size={16} className="text-accent" />
          <span>Core technologies used across active and completed projects.</span>
        </div>
        <div className="skills-meta-item">
          <Sparkles size={16} className="text-learning" />
          <span>Currently expanding knowledge in cross-platform mobile development with React Native.</span>
        </div>
      </div>
    </section>
  );
}
