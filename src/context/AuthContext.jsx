import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { AuthContext } from "./authContextInstance";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // Checks server-controlled admin status via RPC
  const checkAdminStatus = async (currentUser) => {
    if (!currentUser || !isSupabaseConfigured) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc("is_admin");
      if (error) {
        console.warn("[Auth] Failed to verify admin status via RPC:", error.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(data));
      }
    } catch (err) {
      console.warn("[Auth] Admin check exception:", err);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    // Fetch active session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted) return;
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        checkAdminStatus(currentUser).finally(() => {
          if (isMounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen to auth state transitions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      const currentUser = newSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await checkAdminStatus(currentUser);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Please add your credentials to .env");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;

    // Verify admin privileges immediately
    const { data: adminCheck } = await supabase.rpc("is_admin");
    if (!adminCheck) {
      await supabase.auth.signOut();
      throw new Error("Access Denied: Your account does not have admin permissions.");
    }

    setIsAdmin(true);
    return data;
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    session,
    isAdmin,
    loading,
    signIn,
    signOut,
    isConfigured: isSupabaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
