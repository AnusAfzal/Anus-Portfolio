import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { projectsData as staticProjects } from "../data/portfolioData";

/**
 * Normalizes database project row into frontend-compatible format
 */
function normalizeProject(dbRow, index) {
  return {
    id: dbRow.id,
    number: String(dbRow.display_order || index + 1).padStart(2, "0"),
    name: dbRow.title,
    title: dbRow.title,
    slug: dbRow.slug,
    category: dbRow.category,
    categoryLabel: `${dbRow.category} Project`,
    status: dbRow.status,
    statusType: dbRow.status === "In Development" ? "progress" : "complete",
    shortDescription: dbRow.description,
    description: dbRow.description,
    technologies: Array.isArray(dbRow.technologies) ? dbRow.technologies : [],
    githubUrl: dbRow.github_url || "https://github.com/AnusAfzal",
    githubPlaceholder: !dbRow.github_url,
    demoUrl: dbRow.live_url || null,
    featured: Boolean(dbRow.featured),
    displayOrder: dbRow.display_order || 0,
    highlights: [
      `Engineered with ${Array.isArray(dbRow.technologies) ? dbRow.technologies.slice(0, 3).join(", ") : "modern tools"}`,
      `Category: ${dbRow.category}`,
      dbRow.status === "In Development" ? "Currently under active development" : "Stable release ready",
    ],
  };
}

/**
 * Fetches published projects for public display.
 * Falls back seamlessly to static portfolioData if Supabase is unconfigured or unavailable.
 */
export async function getPublishedProjects() {
  if (!isSupabaseConfigured) {
    return { data: staticProjects, isFallback: true };
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .in("status", ["Completed", "In Development"])
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn("[projectService] Supabase fetch error, using fallback:", error.message);
      }
      return { data: staticProjects, isFallback: true };
    }

    const formatted = data.map((row, idx) => normalizeProject(row, idx));
    return { data: formatted, isFallback: false };
  } catch (err) {
    console.warn("[projectService] Fetch exception, using static fallback:", err);
    return { data: staticProjects, isFallback: true };
  }
}

/**
 * Admin: Fetches all projects (including drafts/archived)
 */
export async function getAllProjectsAdmin() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Admin: Creates a new project
 */
export async function createProject(project) {
  const payload = {
    title: project.title.trim(),
    slug: project.slug.trim().toLowerCase(),
    description: project.description.trim(),
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : project.technologies.split(",").map((t) => t.trim()).filter(Boolean),
    github_url: project.github_url?.trim() || null,
    live_url: project.live_url?.trim() || null,
    category: project.category || "Frontend",
    status: project.status || "Completed",
    featured: Boolean(project.featured),
    display_order: Number(project.display_order) || 0,
  };

  const { data, error } = await supabase
    .from("projects")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Updates an existing project
 */
export async function updateProject(id, updates) {
  const payload = { ...updates };
  if (typeof payload.technologies === "string") {
    payload.technologies = payload.technologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  if (payload.github_url === "") payload.github_url = null;
  if (payload.live_url === "") payload.live_url = null;

  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Deletes a project
 */
export async function deleteProject(id) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
  return true;
}
