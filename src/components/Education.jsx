import { motion } from "motion/react";
import {
  GraduationCap,
  BookOpen,
  MapPin,
} from "lucide-react";
import { educationData } from "../data/portfolioData";

export default function Education() {
  return (
    <section className="section-container content-section" id="education" aria-labelledby="education-heading">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <span className="section-eyebrow">04 / EDUCATION & ACADEMICS</span>
        <h2 id="education-heading" className="section-title">
          Academic <span className="text-highlight">foundation.</span>
        </h2>
        <p className="section-subtitle">
          Software Engineering education grounded in computer science principles, practical
          system design, and algorithmic problem solving.
        </p>
      </motion.div>

      <div className="education-grid">
        {/* Main Institution Card */}
        <motion.div
          className="education-main-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="education-card-top">
            <div className="education-icon-box">
              <GraduationCap size={28} aria-hidden="true" />
            </div>

            <div className="education-badge font-mono">
              <span>Undergraduate Degree</span>
            </div>
          </div>

          <div className="education-degree-info">
            <h3 className="education-degree-title">{educationData.degree}</h3>
            <div className="education-institution-group">
              <span className="education-dept">{educationData.department}</span>
              <span className="education-uni">{educationData.institution}</span>
            </div>

            <div className="education-location">
              <MapPin size={14} aria-hidden="true" />
              <span>{educationData.location}</span>
            </div>

            <p className="education-description">{educationData.description}</p>
          </div>

          {/* Key Coursework Tags */}
          <div className="education-coursework-section">
            <h4 className="coursework-heading">
              <BookOpen size={16} aria-hidden="true" />
              <span>Relevant Coursework & Core Modules</span>
            </h4>

            <div className="coursework-tags-list">
              {educationData.coursework.map((course) => (
                <span key={course} className="course-tag font-mono">
                  {course}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Academic Principles Column */}
        <div className="education-principles-column">
          {educationData.principles.map((principle, index) => (
            <motion.article
              key={principle.title}
              className="principle-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <div className="principle-header">
                <span className="principle-num font-mono">0{index + 1}</span>
                <h4 className="principle-title">{principle.title}</h4>
              </div>
              <p className="principle-detail">{principle.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
