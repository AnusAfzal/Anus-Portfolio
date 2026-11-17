import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Download } from "lucide-react";
import { personalInfo } from "../data/portfolioData";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Education", href: "#education" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar section-container">
          <a
            href="#home"
            className="logo"
            aria-label="Anus Afzal - Home"
            onClick={handleLinkClick}
          >
            Anus<span className="accent-dot">.</span>
            <span className="logo-badge">SE</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="nav-desktop" aria-label="Primary navigation">
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="nav-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="nav-actions">
              <a
                href={personalInfo.resumeUrl}
                download="Anus_Afzal_Resume.pdf"
                className="button-resume"
                aria-label="Download Resume PDF"
                title="Download Resume (Placeholder PDF)"
              >
                <Download size={14} aria-hidden="true" />
                <span>Resume</span>
              </a>

              <a href="#contact" className="button-talk">
                <span>Let's Talk</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open navigation menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        id="mobile-navigation"
        className={`mobile-drawer ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-drawer-backdrop" onClick={handleLinkClick} />
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-header">
            <span className="mobile-drawer-title">Navigation</span>
            <button
              type="button"
              className="drawer-close"
              onClick={handleLinkClick}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav aria-label="Mobile navigation">
            <ul className="mobile-nav-list">
              {navLinks.map((link, idx) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="mobile-nav-item"
                    onClick={handleLinkClick}
                  >
                    <span className="mobile-nav-index">0{idx + 1}</span>
                    <span className="mobile-nav-label">{link.name}</span>
                    <ArrowUpRight size={16} className="mobile-nav-arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mobile-drawer-actions">
            <a
              href={personalInfo.resumeUrl}
              download="Anus_Afzal_Resume.pdf"
              className="button-primary full-width"
              onClick={handleLinkClick}
            >
              <Download size={16} />
              <span>Download Resume</span>
            </a>
            <a
              href="#contact"
              className="button-secondary full-width"
              onClick={handleLinkClick}
            >
              <span>Get in Touch</span>
            </a>
          </div>

          <div className="mobile-drawer-footer">
            <p className="mobile-status-text">
              <span className="status-dot-pulse" /> Available for internships
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
