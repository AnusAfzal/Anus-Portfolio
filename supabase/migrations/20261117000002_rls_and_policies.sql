-- =============================================================================
-- Migration 02: Row Level Security (RLS) & Access Control Policies
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Contacts Table RLS
-- Public submissions are routed via Edge Function (service role).
-- Direct client access is strictly limited to verified admins.
-- -----------------------------------------------------------------------------
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Deny all public/anon operations by default.
-- Only authenticated users with an entry in app_admin_users can read, update, or delete.
DROP POLICY IF EXISTS admin_read_contacts ON public.contacts;
CREATE POLICY admin_read_contacts
    ON public.contacts
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS admin_update_contacts ON public.contacts;
CREATE POLICY admin_update_contacts
    ON public.contacts
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS admin_delete_contacts ON public.contacts;
CREATE POLICY admin_delete_contacts
    ON public.contacts
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 2. Projects Table RLS
-- Public visitors can read active projects.
-- Only verified admins can create, update, or delete projects.
-- -----------------------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read_projects ON public.projects;
CREATE POLICY public_read_projects
    ON public.projects
    FOR SELECT
    TO anon, authenticated
    USING (
        status IN ('Completed', 'In Development') 
        OR public.is_admin()
    );

DROP POLICY IF EXISTS admin_insert_projects ON public.projects;
CREATE POLICY admin_insert_projects
    ON public.projects
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS admin_update_projects ON public.projects;
CREATE POLICY admin_update_projects
    ON public.projects
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS admin_delete_projects ON public.projects;
CREATE POLICY admin_delete_projects
    ON public.projects
    FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 3. Contact Rate Limits Table RLS
-- Managed atomically by Edge Functions / SECURITY DEFINER functions.
-- -----------------------------------------------------------------------------
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_read_rate_limits ON public.contact_rate_limits;
CREATE POLICY admin_read_rate_limits
    ON public.contact_rate_limits
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. App Admin Users Table RLS
-- Protected server-side allowlist; only existing admins can view admin memberships.
-- -----------------------------------------------------------------------------
ALTER TABLE public.app_admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_read_admin_users ON public.app_admin_users;
CREATE POLICY admin_read_admin_users
    ON public.app_admin_users
    FOR SELECT
    TO authenticated
    USING (public.is_admin());
