import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { personalInfo } from "../data/portfolioData";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Education", href: "#education" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="footer-wrapper" aria-label="Site Footer">
      <div className="section-container footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#home" className="logo" aria-label="Anus Afzal - Back to top">
              anus<span className="accent-dot">.</span>
              <span className="logo-badge">SE</span>
            </a>
            <p className="footer-tagline">
              Software Engineering Student at UBIT, University of Karachi.
              Building practical software with modern web technologies.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <ul className="footer-links">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="footer-link">
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={personalInfo.resumeUrl}
                  download="Anus_Afzal_Resume.pdf"
                  className="footer-link resume-highlight"
                >
                  Resume.pdf
                </a>
              </li>
            </ul>
          </nav>

          <div className="footer-socials">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer noopener"
              className="footer-social-btn"
              aria-label="GitHub Profile (opens in new tab)"
            >
              <FaGithub size={18} aria-hidden="true" />
            </a>

            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="footer-social-btn"
              aria-label="LinkedIn Profile (opens in new tab)"
            >
              <FaLinkedin size={18} aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="back-to-top-btn"
              aria-label="Back to top of page"
              title="Back to top"
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>

          <p className="footer-meta font-mono">
            Crafted with React, Vite & Motion · Dark Charcoal & Lime Accent
          </p>
        </div>
      </div>
    </footer>
  );
}
