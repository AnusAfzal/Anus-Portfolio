import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  FolderGit2,
  CheckCircle2,
  Clock,
  Trash2,
  Plus,
  RefreshCw,
  AlertTriangle,
  X,
  Mail,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import {
  getAdminContacts,
  toggleContactReadStatus,
  deleteContactMessage,
  getAdminDashboardMetrics,
} from "../../services/adminContactService";
import {
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/projectService";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Metrics
  const [metrics, setMetrics] = useState({
    totalContacts: 0,
    unreadContacts: 0,
    totalProjects: 0,
    featuredProjects: 0,
  });

  // Contacts State
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Projects State
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Notification Banner
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Dashboard Metrics
  const loadMetrics = useCallback(async () => {
    try {
      const data = await getAdminDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.warn("Failed to load metrics:", err.message);
    }
  }, []);

  // Fetch Contacts
  const loadContacts = useCallback(async () => {
    setLoadingContacts(true);
    try {
      const data = await getAdminContacts();
      setContacts(data);
    } catch (err) {
      console.error("Failed to load contacts:", err);
      showToast("Failed to fetch contact inquiries: " + err.message, "error");
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  // Fetch Projects
  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const data = await getAllProjectsAdmin();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
      showToast("Failed to fetch projects: " + err.message, "error");
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function initDashboard() {
      try {
        const [m, c, p] = await Promise.all([
          getAdminDashboardMetrics().catch(() => ({
            totalContacts: 0,
            unreadContacts: 0,
            totalProjects: 0,
            featuredProjects: 0,
          })),
          getAdminContacts().catch(() => []),
          getAllProjectsAdmin().catch(() => []),
        ]);
        if (isMounted) {
          setMetrics(m);
          setContacts(c);
          setProjects(p);
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
      }
    }
    initDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Mark Read / Unread
  const handleToggleRead = async (contact) => {
    try {
      const updated = await toggleContactReadStatus(contact.id, contact.is_read);
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, is_read: updated.is_read } : c))
      );
      if (selectedContact?.id === contact.id) {
        setSelectedContact((prev) => ({ ...prev, is_read: updated.is_read }));
      }
      loadMetrics();
      showToast(`Marked as ${updated.is_read ? "read" : "unread"}`);
    } catch (err) {
      showToast("Error updating message status: " + err.message, "error");
    }
  };

  // Handle Delete Contact
  const handleDeleteContact = (contact) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Contact Inquiry",
      message: `Are you sure you want to permanently delete the message from "${contact.name}" (${contact.email})? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteContactMessage(contact.id);
          setContacts((prev) => prev.filter((c) => c.id !== contact.id));
          if (selectedContact?.id === contact.id) setSelectedContact(null);
          loadMetrics();
          showToast("Message deleted successfully.");
        } catch (err) {
          showToast("Failed to delete contact: " + err.message, "error");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Handle Save Project (Create or Edit)
  const handleSaveProject = async (formData) => {
    try {
      if (editingProject?.id) {
        const updated = await updateProject(editingProject.id, formData);
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast("Project updated successfully.");
      } else {
        const created = await createProject(formData);
        setProjects((prev) => [created, ...prev]);
        showToast("Project created successfully.");
      }
      setIsProjectModalOpen(false);
      setEditingProject(null);
      loadMetrics();
    } catch (err) {
      showToast("Error saving project: " + err.message, "error");
    }
  };

  // Handle Toggle Featured
  const handleToggleFeatured = async (project) => {
    try {
      const updated = await updateProject(project.id, { featured: !project.featured });
      setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
      loadMetrics();
      showToast(`Project ${updated.featured ? "marked as featured" : "unmarked as featured"}`);
    } catch (err) {
      showToast("Failed to update featured status: " + err.message, "error");
    }
  };

  // Handle Delete Project
  const handleDeleteProject = (project) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Project",
      message: `Are you sure you want to delete "${project.title}"? This will remove it from the public portfolio.`,
      onConfirm: async () => {
        try {
          await deleteProject(project.id);
          setProjects((prev) => prev.filter((p) => p.id !== project.id));
          loadMetrics();
          showToast("Project deleted successfully.");
        } catch (err) {
          showToast("Failed to delete project: " + err.message, "error");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const filteredContacts = filterUnreadOnly
    ? contacts.filter((c) => !c.is_read)
    : contacts;

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast toast-${toast.type}`} role="status">
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} className="toast-close">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="admin-overview-view">
          <div className="admin-page-header">
            <div>
              <h2 className="admin-heading">Dashboard Overview</h2>
              <p className="admin-subheading font-mono">
                Real-time metrics and system statistics from Supabase PostgreSQL.
              </p>
            </div>
            <button
              type="button"
              className="admin-action-btn secondary font-mono"
              onClick={() => {
                loadMetrics();
                loadContacts();
                loadProjects();
                showToast("Data refreshed.");
              }}
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="admin-metrics-grid">
            <div className="admin-metric-card">
              <div className="metric-header">
                <span className="metric-label font-mono">Total Messages</span>
                <MessageSquare size={18} className="metric-icon" />
              </div>
              <div className="metric-value font-mono">{metrics.totalContacts}</div>
              <p className="metric-desc">Total inquiries captured</p>
            </div>

            <div className="admin-metric-card highlight">
              <div className="metric-header">
                <span className="metric-label font-mono">Unread Inquiries</span>
                <Clock size={18} className="metric-icon accent" />
              </div>
              <div className="metric-value font-mono text-accent">{metrics.unreadContacts}</div>
              <p className="metric-desc">Awaiting your response</p>
            </div>

            <div className="admin-metric-card">
              <div className="metric-header">
                <span className="metric-label font-mono">Total Projects</span>
                <FolderGit2 size={18} className="metric-icon" />
              </div>
              <div className="metric-value font-mono">{metrics.totalProjects}</div>
              <p className="metric-desc">Managed in database</p>
            </div>

            <div className="admin-metric-card">
              <div className="metric-header">
                <span className="metric-label font-mono">Featured Projects</span>
                <Star size={18} className="metric-icon star" />
              </div>
              <div className="metric-value font-mono">{metrics.featuredProjects}</div>
              <p className="metric-desc">Highlighted showcase items</p>
            </div>
          </div>

          {/* Quick Recent Messages & Projects */}
          <div className="admin-overview-columns">
            {/* Recent Inquiries */}
            <div className="admin-panel">
              <div className="panel-header">
                <h3 className="panel-title">Recent Inquiries</h3>
                <button
                  type="button"
                  className="panel-link font-mono"
                  onClick={() => setActiveTab("messages")}
                >
                  View All ({contacts.length})
                </button>
              </div>

              {contacts.length === 0 ? (
                <div className="admin-empty-state">
                  <p>No messages received yet.</p>
                </div>
              ) : (
                <div className="recent-list">
                  {contacts.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className={`recent-item ${!c.is_read ? "unread" : ""}`}
                      onClick={() => {
                        setSelectedContact(c);
                        setActiveTab("messages");
                      }}
                    >
                      <div className="recent-item-meta">
                        <span className="recent-author">{c.name}</span>
                        <span className="recent-date font-mono">
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="recent-subject">{c.subject}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Projects */}
            <div className="admin-panel">
              <div className="panel-header">
                <h3 className="panel-title">Active Projects</h3>
                <button
                  type="button"
                  className="panel-link font-mono"
                  onClick={() => setActiveTab("projects")}
                >
                  Manage ({projects.length})
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="admin-empty-state">
                  <p>No projects in database.</p>
                </div>
              ) : (
                <div className="recent-list">
                  {projects.slice(0, 4).map((p) => (
                    <div key={p.id} className="recent-item">
                      <div className="recent-item-meta">
                        <span className="recent-author">{p.title}</span>
                        <span className="project-badge font-mono">{p.category}</span>
                      </div>
                      <p className="recent-subject font-mono text-muted">
                        Status: {p.status} · Order: {p.display_order}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="admin-messages-view">
          <div className="admin-page-header">
            <div>
              <h2 className="admin-heading">Contact Messages</h2>
              <p className="admin-subheading font-mono">
                Inquiries securely stored in Supabase PostgreSQL via Edge Function.
              </p>
            </div>

            <div className="header-controls">
              <button
                type="button"
                className={`filter-pill-btn font-mono ${filterUnreadOnly ? "active" : ""}`}
                onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
              >
                <SlidersHorizontal size={13} />
                <span>Unread Only ({metrics.unreadContacts})</span>
              </button>

              <button
                type="button"
                className="admin-action-btn secondary font-mono"
                onClick={loadContacts}
                disabled={loadingContacts}
              >
                <RefreshCw size={14} className={loadingContacts ? "spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div className="admin-messages-layout">
            {/* Messages List Column */}
            <div className="messages-list-column">
              {loadingContacts ? (
                <div className="admin-loading-box font-mono">Loading inquiries...</div>
              ) : filteredContacts.length === 0 ? (
                <div className="admin-empty-card font-mono">
                  <p>No messages match the current filter.</p>
                </div>
              ) : (
                <div className="messages-list">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`message-card ${!contact.is_read ? "unread" : ""} ${
                        selectedContact?.id === contact.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="message-card-top">
                        <span className="message-sender">{contact.name}</span>
                        <span className="message-date font-mono">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="message-card-subject">{contact.subject}</p>
                      <p className="message-card-snippet">{contact.message.slice(0, 90)}...</p>

                      <div className="message-card-footer">
                        <span className="message-email font-mono">{contact.email}</span>
                        {!contact.is_read && (
                          <span className="unread-dot-badge font-mono">NEW</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Detail Column */}
            <div className="message-detail-column">
              {selectedContact ? (
                <div className="message-detail-card">
                  <div className="detail-header">
                    <div>
                      <span className="detail-date font-mono">
                        Received on {new Date(selectedContact.created_at).toLocaleString()}
                      </span>
                      <h3 className="detail-subject">{selectedContact.subject}</h3>
                    </div>

                    <div className="detail-actions">
                      <button
                        type="button"
                        className="admin-icon-action font-mono"
                        onClick={() => handleToggleRead(selectedContact)}
                        title={selectedContact.is_read ? "Mark as Unread" : "Mark as Read"}
                      >
                        {selectedContact.is_read ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                        <span>{selectedContact.is_read ? "Mark Unread" : "Mark Read"}</span>
                      </button>

                      <button
                        type="button"
                        className="admin-icon-action delete font-mono"
                        onClick={() => handleDeleteContact(selectedContact)}
                        title="Delete Message"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="detail-sender-box">
                    <div>
                      <strong className="sender-name">{selectedContact.name}</strong>
                      <a href={`mailto:${selectedContact.email}`} className="sender-email font-mono">
                        <Mail size={13} /> {selectedContact.email}
                      </a>
                    </div>
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(
                        selectedContact.subject
                      )}`}
                      className="admin-action-btn primary font-mono"
                    >
                      Reply via Email
                    </a>
                  </div>

                  <div className="detail-body">
                    <h4 className="detail-body-label font-mono">Message Contents:</h4>
                    <p className="detail-body-text">{selectedContact.message}</p>
                  </div>
                </div>
              ) : (
                <div className="message-detail-placeholder font-mono">
                  <MessageSquare size={36} className="placeholder-icon" />
                  <p>Select a message from the list to view its complete details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="admin-projects-view">
          <div className="admin-page-header">
            <div>
              <h2 className="admin-heading">Project Records</h2>
              <p className="admin-subheading font-mono">
                Manage showcase items, order, categories, and links in Supabase.
              </p>
            </div>

            <div className="header-controls">
              <button
                type="button"
                className="admin-action-btn primary font-mono"
                onClick={() => {
                  setEditingProject(null);
                  setIsProjectModalOpen(true);
                }}
              >
                <Plus size={15} />
                <span>Add Project</span>
              </button>

              <button
                type="button"
                className="admin-action-btn secondary font-mono"
                onClick={loadProjects}
                disabled={loadingProjects}
              >
                <RefreshCw size={14} className={loadingProjects ? "spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {loadingProjects ? (
            <div className="admin-loading-box font-mono">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="admin-empty-card font-mono">
              <p>No projects found in the database. Click "Add Project" to create one.</p>
            </div>
          ) : (
            <div className="admin-projects-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr className="font-mono">
                    <th>Order</th>
                    <th>Title / Slug</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Technologies</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="font-mono text-accent">#{project.display_order}</td>
                      <td>
                        <strong className="table-project-title">{project.title}</strong>
                        <span className="table-project-slug font-mono">/{project.slug}</span>
                      </td>
                      <td>
                        <span className="table-badge font-mono">{project.category}</span>
                      </td>
                      <td>
                        <span
                          className={`status-chip font-mono ${
                            project.status === "In Development" ? "dev" : "complete"
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`star-toggle-btn ${project.featured ? "active" : ""}`}
                          onClick={() => handleToggleFeatured(project)}
                          title="Toggle featured status"
                        >
                          <Star size={16} />
                        </button>
                      </td>
                      <td>
                        <div className="table-tech-chips font-mono">
                          {(project.technologies || []).slice(0, 3).map((t) => (
                            <span key={t} className="tech-chip">
                              {t}
                            </span>
                          ))}
                          {(project.technologies || []).length > 3 && (
                            <span className="tech-chip-more">
                              +{(project.technologies || []).length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="table-btn edit font-mono"
                            onClick={() => {
                              setEditingProject(project);
                              setIsProjectModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="table-btn delete"
                            onClick={() => handleDeleteProject(project)}
                            title="Delete project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isProjectModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setIsProjectModalOpen(false);
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
        />
      )}

      {/* Confirmation Dialog Modal */}
      {confirmModal.isOpen && (
        <div className="admin-modal-backdrop" onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}>
          <div className="admin-modal-card confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-box">
              <AlertTriangle size={24} className="text-warning" />
            </div>
            <h3 className="confirm-title">{confirmModal.title}</h3>
            <p className="confirm-message">{confirmModal.message}</p>
            <div className="confirm-actions">
              <button
                type="button"
                className="admin-action-btn secondary font-mono"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-action-btn danger font-mono"
                onClick={confirmModal.onConfirm}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// -----------------------------------------------------------------------------
// Sub-Component: Project Add / Edit Modal Form
// -----------------------------------------------------------------------------
function ProjectModal({ project, onClose, onSave }) {
  const isEditing = Boolean(project?.id);

  const [title, setTitle] = useState(project?.title || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [description, setDescription] = useState(project?.description || "");
  const [category, setCategory] = useState(project?.category || "Frontend");
  const [status, setStatus] = useState(project?.status || "Completed");
  const [technologies, setTechnologies] = useState(
    Array.isArray(project?.technologies) ? project.technologies.join(", ") : ""
  );
  const [githubUrl, setGithubUrl] = useState(project?.github_url || "");
  const [liveUrl, setLiveUrl] = useState(project?.live_url || "");
  const [featured, setFeatured] = useState(Boolean(project?.featured));
  const [displayOrder, setDisplayOrder] = useState(project?.display_order || 0);

  // Auto-generate slug from title if new
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!isEditing && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      slug,
      description,
      category,
      status,
      technologies,
      github_url: githubUrl,
      live_url: liveUrl,
      featured,
      display_order: Number(displayOrder) || 0,
    });
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card project-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title font-mono">
            {isEditing ? "Edit Project Record" : "Add New Project"}
          </h3>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="modal-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label font-mono">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. LiftLog"
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label font-mono">Slug (URL identifier) *</label>
              <input
                type="text"
                required
                pattern="^[a-z0-9-]+$"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="liftlog"
                className="admin-form-input font-mono"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label font-mono">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="admin-form-select font-mono"
              >
                <option value="Frontend">Frontend</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Mobile">Mobile</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label font-mono">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="admin-form-select font-mono"
              >
                <option value="Completed">Completed</option>
                <option value="In Development">In Development</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="admin-form-group full-span">
              <label className="admin-form-label font-mono">Technologies (comma separated)</label>
              <input
                type="text"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="React Native, Expo, Supabase, TypeScript"
                className="admin-form-input font-mono"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label font-mono">GitHub Repository URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/AnusAfzal/project"
                className="admin-form-input font-mono"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label font-mono">Live Demo URL</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://project-demo.com"
                className="admin-form-input font-mono"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label font-mono">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="admin-form-input font-mono"
              />
            </div>

            <div className="admin-form-group checkbox-group">
              <label className="checkbox-label font-mono">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span>Featured Project</span>
              </label>
            </div>

            <div className="admin-form-group full-span">
              <label className="admin-form-label font-mono">Project Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of what the project does and how it was engineered..."
                className="admin-form-textarea font-mono"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="admin-action-btn secondary font-mono">
              Cancel
            </button>
            <button type="submit" className="admin-action-btn primary font-mono">
              {isEditing ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
