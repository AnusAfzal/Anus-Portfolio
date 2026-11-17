import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Copy,
  Check,
  Send,
  ArrowUpRight,
  MapPin,
  Clock,
  Info,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { personalInfo } from "../data/portfolioData";
import { submitContactMessage } from "../services/contactService";
import { isSupabaseConfigured } from "../lib/supabase";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null); // string message | null
  const [submitError, setSubmitError] = useState(null); // string message | null

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openMailtoFallback = () => {
    const subjectLine =
      formData.subject.trim() ||
      `Portfolio Inquiry from ${formData.name.trim() || "Visitor"}`;
    const emailBody = `Hi Anus,

Name: ${formData.name.trim()}
Email: ${formData.email.trim()}

Message:
${formData.message.trim()}

---
Sent via portfolio contact form`;

    const mailtoUrl = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
      subjectLine
    )}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);

    // Basic frontend checks
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    // If Supabase credentials are not configured yet, fallback gracefully to email client
    if (!isSupabaseConfigured) {
      openMailtoFallback();
      setSubmitSuccess(
        "Opened in your default email client. (Note: Supabase backend is not configured in local .env, operating in resilient mailto fallback mode)."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContactMessage(formData);

      if (result.success) {
        setSubmitSuccess(result.message);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          honeypot: "",
        });
      } else {
        setSubmitError(result.error || "Failed to submit message.");
      }
    } catch (err) {
      console.error("[Contact] Unexpected submission error:", err);
      setSubmitError("An unexpected error occurred. You can click below to email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-container content-section" id="contact" aria-labelledby="contact-heading">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <span className="section-eyebrow">05 / GET IN TOUCH</span>
        <h2 id="contact-heading" className="section-title">
          Let's build <span className="text-highlight">together.</span>
        </h2>
        <p className="section-subtitle">
          Open to software engineering internships, junior developer roles, and technical
          collaborations.
        </p>
      </motion.div>

      <div className="contact-grid">
        {/* Left Column: Direct Info Cards */}
        <motion.div
          className="contact-info-column"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
        >
          {/* Email Card with Copy Feature */}
          <div className="contact-card email-highlight-card">
            <div className="contact-card-icon">
              <Mail size={22} aria-hidden="true" />
            </div>

            <div className="contact-card-content">
              <span className="contact-card-label font-mono">Direct Email</span>
              <a
                href={`mailto:${personalInfo.email}`}
                className="contact-email-link"
                title="Send email"
              >
                {personalInfo.email}
              </a>
              <span className="contact-subtext">
                ({personalInfo.emailPlaceholderNotice})
              </span>
            </div>

            <button
              type="button"
              className={`copy-email-btn ${copied ? "copied" : ""}`}
              onClick={handleCopyEmail}
              aria-label="Copy email address to clipboard"
            >
              {copied ? (
                <>
                  <Check size={14} aria-hidden="true" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Social Profiles Grid */}
          <div className="contact-channels-grid">
            {/* GitHub Card */}
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer noopener"
              className="channel-card"
              aria-label="Visit GitHub Profile (opens in new tab)"
            >
              <div className="channel-icon-box">
                <FaGithub size={20} aria-hidden="true" />
              </div>
              <div className="channel-info">
                <span className="channel-title">GitHub</span>
                <span className="channel-handle font-mono">github.com/AnusAfzal</span>
              </div>
              <ArrowUpRight size={17} className="channel-arrow" aria-hidden="true" />
            </a>

            {/* LinkedIn Card */}
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="channel-card"
              aria-label="Visit LinkedIn Profile (opens in new tab)"
            >
              <div className="channel-icon-box">
                <FaLinkedin size={20} aria-hidden="true" />
              </div>
              <div className="channel-info">
                <span className="channel-title">LinkedIn</span>
                <span className="channel-handle font-mono">Anus Afzal</span>
              </div>
              <ArrowUpRight size={17} className="channel-arrow" aria-hidden="true" />
            </a>
          </div>

          {/* Location & Status Card */}
          <div className="contact-card location-card">
            <div className="location-item">
              <MapPin size={17} className="location-icon" aria-hidden="true" />
              <div>
                <span className="location-label font-mono">Location</span>
                <p className="location-value">{personalInfo.location}</p>
              </div>
            </div>

            <div className="location-item">
              <Clock size={17} className="location-icon" aria-hidden="true" />
              <div>
                <span className="location-label font-mono">Current Status</span>
                <p className="location-value">
                  Software Engineering Student (UBIT) · Seeking Internships
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact Form */}
        <motion.div
          className="contact-form-column"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="contact-form-card">
            <div className="form-card-header">
              <h3 className="form-title">Send a Direct Message</h3>
              <p className="form-subtitle">
                Submissions are validated, rate-limited, and securely delivered via Supabase & Resend.
              </p>
            </div>

            {/* Backend Integration Architecture Note */}
            <div className="form-backend-notice" role="note">
              <Info size={16} className="notice-icon" aria-hidden="true" />
              <p>
                <strong>Backend Active:</strong> Powered by Supabase PostgreSQL and Edge Functions with automated spam prevention and rate limiting.
              </p>
            </div>

            {/* Live Success Banner */}
            {submitSuccess && (
              <div className="form-success-banner" role="status" aria-live="polite">
                <Check size={18} className="banner-icon" />
                <div>
                  <strong>Message Sent Successfully!</strong>
                  <p>{submitSuccess}</p>
                </div>
              </div>
            )}

            {/* Live Error Banner */}
            {submitError && (
              <div className="form-error-banner" role="alert" aria-live="assertive">
                <AlertCircle size={18} className="banner-icon error" />
                <div>
                  <strong>Submission Notice</strong>
                  <p>{submitError}</p>
                  <button
                    type="button"
                    onClick={openMailtoFallback}
                    className="error-fallback-link font-mono"
                  >
                    Click here to open email client directly →
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="contact-form"
              noValidate={false}
              aria-label="Direct message form"
            >
              {/* Spam Honeypot Field (Hidden from humans) */}
              <div style={{ display: "none" }} aria-hidden="true">
                <label htmlFor="contact-honeypot">Leave blank</label>
                <input
                  type="text"
                  id="contact-honeypot"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="contact-name" className="form-label">
                  Your Name <span className="label-required" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ali"
                  required
                  maxLength={100}
                  autoComplete="name"
                  enterKeyHint="next"
                  disabled={isSubmitting}
                  className="form-input font-mono"
                />
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="contact-email" className="form-label">
                  Your Email Address <span className="label-required" aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ali@example.com"
                  required
                  maxLength={255}
                  autoComplete="email"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  enterKeyHint="next"
                  disabled={isSubmitting}
                  className="form-input font-mono"
                />
              </div>

              {/* Subject Field */}
              <div className="form-group">
                <label htmlFor="contact-subject" className="form-label">
                  Subject <span className="label-required" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Internship Opportunity / Project Collaboration"
                  required
                  maxLength={200}
                  enterKeyHint="next"
                  disabled={isSubmitting}
                  className="form-input font-mono"
                />
              </div>

              {/* Message Field */}
              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">
                  Your Message <span className="label-required" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hello Anus, I came across your portfolio and would like to discuss..."
                  required
                  maxLength={5000}
                  disabled={isSubmitting}
                  className="form-textarea font-mono"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="button-primary form-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spin" aria-hidden="true" />
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
