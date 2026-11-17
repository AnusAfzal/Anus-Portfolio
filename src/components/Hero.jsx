import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  Mail,
  Terminal,
  Code2,
  Layers,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { personalInfo } from "../data/portfolioData";

export default function Hero() {
  return (
    <section className="hero section-container" id="home" aria-label="Hero Introduction">
      <div className="hero-grid">
        {/* Left Column: Hero Text */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Availability Badge */}
          <div className="availability-badge">
            <span className="status-dot-pulse" aria-hidden="true" />
            <span className="availability-text">
              Available for Software Engineering Internships
            </span>
          </div>

          <p className="hero-eyebrow">
            SOFTWARE ENGINEERING STUDENT & ASPIRING FULL-STACK DEVELOPER
          </p>

          <h1 className="hero-title">
            Engineering robust
            <br />
            software with modern
            <br />
            <span className="text-highlight">precision & clarity.</span>
          </h1>

          <p className="hero-description">
            Hi, I'm <strong className="hero-name">{personalInfo.name}</strong>, a Software Engineering
            student at <strong>UBIT, University of Karachi</strong>. I focus on developing
            scalable full-stack web applications, clean backend architectures, and practical
            software solutions.
          </p>

          {/* Action CTAs */}
          <div className="hero-actions">
            <a href="#projects" className="button-primary">
              <span>View Projects</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>

            <a href="#contact" className="button-secondary">
              <Mail size={16} aria-hidden="true" />
              <span>Contact Me</span>
            </a>

            <a
              href={personalInfo.resumeUrl}
              download="Anus_Afzal_Resume.pdf"
              className="button-tertiary"
              title="Download Resume (Placeholder PDF)"
            >
              <Download size={15} aria-hidden="true" />
              <span>Resume</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="hero-socials">
            <span className="socials-label">Connect:</span>
            <div className="social-links-list">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer noopener"
                className="social-icon-btn"
                aria-label="GitHub Profile (opens in new tab)"
              >
                <FaGithub size={18} aria-hidden="true" />
                <span className="social-tooltip">GitHub</span>
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="social-icon-btn"
                aria-label="LinkedIn Profile (opens in new tab)"
              >
                <FaLinkedin size={18} aria-hidden="true" />
                <span className="social-tooltip">LinkedIn</span>
              </a>

              <a
                href={`mailto:${personalInfo.email}`}
                className="social-icon-btn"
                aria-label="Send direct email"
              >
                <Mail size={18} aria-hidden="true" />
                <span className="social-tooltip">Email</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Interactive Developer Console Visual */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
          aria-hidden="true"
        >
          <div className="terminal-card">
            {/* Terminal Header */}
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot dot-close" />
                <span className="dot dot-minimize" />
                <span className="dot dot-maximize" />
              </div>
              <div className="terminal-tab">
                <Terminal size={13} className="tab-icon" />
                <span className="tab-title">developer.config.ts</span>
              </div>
              <span className="terminal-env">node v20</span>
            </div>

            {/* Terminal Code Body */}
            <div className="terminal-body font-mono">
              <div className="code-line">
                <span className="line-num">01</span>
                <span className="token-keyword">export const</span>{" "}
                <span className="token-var">engineer</span> = {"{"}
              </div>

              <div className="code-line indent-1">
                <span className="line-num">02</span>
                <span className="token-prop">name</span>:{" "}
                <span className="token-string">"{personalInfo.name}"</span>,
              </div>

              <div className="code-line indent-1">
                <span className="line-num">03</span>
                <span className="token-prop">institution</span>:{" "}
                <span className="token-string">"{personalInfo.university}"</span>,
              </div>

              <div className="code-line indent-1">
                <span className="line-num">04</span>
                <span className="token-prop">discipline</span>:{" "}
                <span className="token-string">"Software Engineering"</span>,
              </div>

              <div className="code-line indent-1">
                <span className="line-num">05</span>
                <span className="token-prop">coreStack</span>: [
              </div>

              <div className="code-line indent-2">
                <span className="line-num">06</span>
                <span className="token-string">"React"</span>,{" "}
                <span className="token-string">"Node.js"</span>,{" "}
                <span className="token-string">"Express"</span>,{" "}
                <span className="token-string">"SQL/MongoDB"</span>
              </div>

              <div className="code-line indent-1">
                <span className="line-num">07</span>
                ],
              </div>

              <div className="code-line indent-1">
                <span className="line-num">08</span>
                <span className="token-prop">focus</span>:{" "}
                <span className="token-string">"Full-Stack & Systems Architecture"</span>,
              </div>

              <div className="code-line indent-1">
                <span className="line-num">09</span>
                <span className="token-prop">internshipReady</span>:{" "}
                <span className="token-boolean">true</span>,
              </div>

              <div className="code-line">
                <span className="line-num">10</span>
                {"};"}
              </div>

              <div className="terminal-prompt">
                <span className="prompt-symbol">$</span>
                <span className="prompt-cmd">git status</span>
                <span className="prompt-output">
                  On branch main · working tree clean · ready for opportunities
                </span>
              </div>
            </div>

            {/* Terminal Footer */}
            <div className="terminal-footer">
              <div className="terminal-footer-status">
                <span className="status-dot" />
                <span>UBIT · BS Software Engineering</span>
              </div>
              <span className="terminal-build-status">Ready</span>
            </div>
          </div>

          {/* Floating Badges */}
          <div className="floating-badge badge-top-right">
            <Code2 size={15} className="badge-icon" />
            <span>Clean & Scalable Code</span>
          </div>

          <div className="floating-badge badge-bottom-left">
            <Layers size={15} className="badge-icon" />
            <span>Full-Stack Discipline</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Hint */}
      <div className="hero-scroll-wrapper">
        <a href="#about" className="scroll-indicator" aria-label="Scroll to About section">
          <span>Scroll to explore</span>
          <ArrowDown size={14} className="bounce-arrow" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
