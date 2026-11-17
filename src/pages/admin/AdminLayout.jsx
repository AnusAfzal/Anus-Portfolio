import { useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft, Shield, MessageSquare, FolderGit2, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import "./admin.css";

export default function AdminLayout({ children, activeTab, onTabChange }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="admin-app">
      {/* Top Navigation Bar */}
      <header className="admin-navbar">
        <div className="admin-nav-left">
          <a href="/" className="admin-brand-link" aria-label="Return to public portfolio">
            anus<span className="accent-dot">.</span>
            <span className="admin-brand-badge font-mono">ADMIN</span>
          </a>

          <div className="admin-divider" />

          <nav className="admin-tab-nav" aria-label="Admin Sections">
            <button
              type="button"
              className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => onTabChange("overview")}
            >
              <LayoutDashboard size={15} />
              <span>Overview</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => onTabChange("messages")}
            >
              <MessageSquare size={15} />
              <span>Messages</span>
            </button>

            <button
              type="button"
              className={`admin-tab-btn ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => onTabChange("projects")}
            >
              <FolderGit2 size={15} />
              <span>Projects</span>
            </button>
          </nav>
        </div>

        <div className="admin-nav-right">
          <div className="admin-user-info font-mono">
            <Shield size={13} className="text-accent" />
            <span className="admin-user-email">{user?.email || "admin"}</span>
          </div>

          <a href="/" className="admin-view-site-btn font-mono" title="Go to public website">
            <ArrowLeft size={14} />
            <span>View Site</span>
          </a>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Sign out of Admin"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-container">
        {children}
      </main>
    </div>
  );
}
