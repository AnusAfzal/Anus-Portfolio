import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Education from "../components/Education";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function PublicPortfolio() {
  return (
    <div className="portfolio-app">
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Subtle Ambient Glows */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-glow glow-top" />
        <div className="ambient-glow glow-middle" />
        <div className="ambient-grid-overlay" />
      </div>

      {/* Global Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
