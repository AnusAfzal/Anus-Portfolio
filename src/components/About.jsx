import { motion } from "motion/react";
import {
  Code2,
  Database,
  Terminal,
  Cpu,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import { personalInfo } from "../data/portfolioData";

export default function About() {
  const pillars = [
    {
      number: "01",
      title: "Full-Stack Web Development",
      description:
        "Building responsive user interfaces with React and connecting them to robust Node.js and Express backend services.",
      icon: Code2,
    },
    {
      number: "02",
      title: "Backend & Database Engineering",
      description:
        "Structuring relational MySQL schemas and NoSQL MongoDB document stores with an emphasis on data integrity and clean querying.",
      icon: Database,
    },
    {
      number: "03",
      title: "Practical Software Construction",
      description:
        "Solidifying computer science foundations by building tangible software projects, from workout trackers to memory platforms.",
      icon: Terminal,
    },
    {
      number: "04",
      title: "Continuous Learning Mindset",
      description:
        "Exploring mobile development with React Native and Expo, adopting modern development workflows, and staying curious.",
      icon: Cpu,
    },
  ];

  return (
    <section className="section-container content-section" id="about" aria-labelledby="about-heading">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <span className="section-eyebrow">01 / ABOUT ME</span>
        <h2 id="about-heading" className="section-title">
          Curious by nature.
          <br />
          <span className="text-muted">Driven by engineering principles.</span>
        </h2>
      </motion.div>

      <div className="about-grid">
        {/* Left Column: Narrative */}
        <motion.div
          className="about-narrative"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <div className="about-bio-card">
            {personalInfo.aboutText.map((paragraph, index) => (
              <p key={index} className="about-paragraph">
                {paragraph}
              </p>
            ))}

            <div className="about-academic-callout">
              <GraduationCap className="callout-icon" size={20} />
              <div>
                <strong>{personalInfo.degree}</strong>
                <span>{personalInfo.university}</span>
              </div>
            </div>

            <div className="about-cta-wrapper">
              <a href="#contact" className="text-link">
                <span>Start a conversation</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <span className="cta-separator">·</span>
              <a href="#projects" className="text-link">
                <span>Jump to selected work</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Pillars Cards */}
        <div className="about-pillars">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.number}
                className="pillar-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <div className="pillar-top">
                  <span className="pillar-num font-mono">{pillar.number}</span>
                  <div className="pillar-icon-box">
                    <Icon size={18} aria-hidden="true" />
                  </div>
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-description">{pillar.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
