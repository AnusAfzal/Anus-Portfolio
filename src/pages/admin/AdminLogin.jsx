import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Shield, Lock, Mail, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import "./admin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signIn, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";
  const stateError = location.state?.error;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isConfigured) {
      setError("Supabase credentials are not configured in your .env file.");
      return;
    }

    setSubmitting(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Admin sign in failed:", err);
      setError(err.message || "Failed to authenticate. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <Link to="/" className="admin-back-link font-mono">
            <ArrowLeft size={14} /> Back to Portfolio
          </Link>
          <div className="admin-icon-shield">
            <Shield size={28} />
          </div>
          <h1 className="admin-login-title">Admin Console</h1>
          <p className="admin-login-subtitle">
            Authenticated management portal for contact inquiries and project records.
          </p>
        </div>

        {/* Configuration Notice if .env is missing */}
        {!isConfigured && (
          <div className="admin-alert-banner alert-warning" role="alert">
            <AlertCircle size={18} className="alert-icon" />
            <div>
              <strong>Supabase Not Configured</strong>
              <p>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file to enable live authentication.</p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {(error || stateError) && (
          <div className="admin-alert-banner alert-error" role="alert">
            <AlertCircle size={18} className="alert-icon" />
            <div>
              <strong>Authentication Error</strong>
              <p>{error || stateError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="admin-email" className="admin-form-label font-mono">
              Admin Email
            </label>
            <div className="admin-input-wrapper">
              <Mail size={16} className="admin-input-icon" aria-hidden="true" />
              <input
                type="email"
                id="admin-email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="admin-form-input font-mono"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password" className="admin-form-label font-mono">
              Password
            </label>
            <div className="admin-input-wrapper">
              <Lock size={16} className="admin-input-icon" aria-hidden="true" />
              <input
                type="password"
                id="admin-password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="admin-form-input font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !isConfigured}
            className="admin-submit-btn font-mono"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="spinner-icon" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="admin-security-footer">
          <p className="admin-notice-text">
            Security policy: Admin accounts are provisioned strictly via Supabase Dashboard. Public registration is permanently disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
