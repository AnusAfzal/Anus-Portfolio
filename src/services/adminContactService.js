import { supabase } from "../lib/supabase";

/**
 * Fetches all contact submissions for the admin dashboard
 */
export async function getAdminContacts() {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Updates is_read flag for a contact message
 */
export async function toggleContactReadStatus(id, currentStatus) {
  const { data, error } = await supabase
    .from("contacts")
    .update({ is_read: !currentStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Deletes a contact message
 */
export async function deleteContactMessage(id) {
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) throw error;
  return true;
}

/**
 * Computes dashboard metric numbers
 */
export async function getAdminDashboardMetrics() {
  const [contactsResult, unreadResult, projectsResult, featuredResult] = await Promise.all([
    supabase.from("contacts").select("id", { count: "exact", head: true }),
    supabase.from("contacts").select("id", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("featured", true),
  ]);

  return {
    totalContacts: contactsResult.count || 0,
    unreadContacts: unreadResult.count || 0,
    totalProjects: projectsResult.count || 0,
    featuredProjects: featuredResult.count || 0,
  };
}
