// =============================================================================
// Supabase Edge Function: submit-contact
// Handles secure validation, rate-limiting, DB storage, and Resend email alerts
// =============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Types
interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  honeypot?: string; // Bot trap field
}

// Allowed origins parser (supports comma-separated list in ALLOWED_ORIGIN secret)
function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") || "";
  const allowedOriginsEnv = Deno.env.get("ALLOWED_ORIGIN") || "";
  const allowedList = allowedOriginsEnv
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  // If in local development or if origin matches allowed list
  const isAllowed =
    allowedList.includes(origin) ||
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:") ||
    (allowedList.length === 0 && origin.includes("localhost"));

  const matchedOrigin = isAllowed ? origin : allowedList[0] || "http://localhost:5173";

  return {
    "Access-Control-Allow-Origin": matchedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

// Secure SHA-256 hasher for IP anonymization
async function hashIp(ip: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(ip + (Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "salt"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  // 1. Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 2. Enforce POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // 3. Parse JSON Body
    let body: ContactPayload;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Honeypot Check (Spam Bot Protection)
    if (body.honeypot && body.honeypot.trim().length > 0) {
      // Silently accept without processing to fool spam bots
      return new Response(
        JSON.stringify({ success: true, message: "Message received." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Input Sanitation & Validation
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();

    // Check empty fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields (name, email, subject, message) are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Length constraints
    if (name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name must not exceed 100 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (subject.length > 200) {
      return new Response(
        JSON.stringify({ error: "Subject must not exceed 200 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Message must not exceed 5000 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Email regex validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 6. Connect to Supabase using Service Role Key
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[submit-contact] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
      return new Response(
        JSON.stringify({ error: "Backend service is temporarily misconfigured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 7. Atomic Server-Side Rate Limiting via Postgres function
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "127.0.0.1";
    const ipHash = await hashIp(clientIp);

    const { data: isAllowed, error: rateLimitError } = await supabaseAdmin.rpc(
      "check_and_record_rate_limit",
      {
        p_ip_hash: ipHash,
        p_max_requests: 5,       // Max 5 messages
        p_window_seconds: 3600,  // Per hour
      }
    );

    if (rateLimitError) {
      console.error("[submit-contact] Rate limit check error:", rateLimitError.message);
      // Fallback: Proceed if rate limit function fails to avoid blocking genuine visitors
    } else if (isAllowed === false) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. You can send a maximum of 5 messages per hour. Please try again later.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 8. Store Contact Message in PostgreSQL
    const { data: insertedContact, error: insertError } = await supabaseAdmin
      .from("contacts")
      .insert({
        name,
        email,
        subject,
        message,
        is_read: false,
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("[submit-contact] Database insert failed:", insertError.message);
      return new Response(
        JSON.stringify({ error: "Failed to save message. Please try again or email directly." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 9. Dispatch Email Notification via Resend API (Safe & Non-blocking)
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const recipientEmail = Deno.env.get("CONTACT_NOTIFICATION_EMAIL");
    const senderEmail = Deno.env.get("CONTACT_VERIFIED_SENDER") || "onboarding@resend.dev";

    if (resendApiKey && recipientEmail) {
      try {
        const formattedTimestamp = new Date().toUTCString();
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 12px;">
            <div style="border-bottom: 1px solid #27272a; padding-bottom: 16px; margin-bottom: 20px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #c5f36b; font-weight: 700;">Portfolio Inquiry</span>
              <h1 style="font-size: 20px; margin: 8px 0 0; color: #ffffff;">${escapeHtml(subject)}</h1>
            </div>
            
            <div style="margin-bottom: 18px; font-size: 14px; line-height: 1.6;">
              <p style="margin: 0 0 6px;"><strong style="color: #a1a1aa;">Sender:</strong> ${escapeHtml(name)}</p>
              <p style="margin: 0 0 6px;"><strong style="color: #a1a1aa;">Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #c5f36b; text-decoration: none;">${escapeHtml(email)}</a></p>
              <p style="margin: 0;"><strong style="color: #a1a1aa;">Received At:</strong> ${formattedTimestamp}</p>
            </div>

            <div style="background-color: #121216; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 18px; margin-top: 16px;">
              <p style="margin: 0; font-size: 14px; line-height: 1.7; white-space: pre-wrap; color: #e4e4e7;">${escapeHtml(message)}</p>
            </div>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #27272a; font-size: 12px; color: #71717a;">
              <span>Submitted from Anus Afzal Portfolio Contact Form</span>
            </div>
          </div>
        `;

        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `Portfolio Contact <${senderEmail}>`,
            to: [recipientEmail],
            reply_to: email,
            subject: `[Portfolio Contact] ${subject} - from ${name}`,
            html: emailHtml,
          }),
        });

        if (!resendResponse.ok) {
          const resendErrText = await resendResponse.text();
          console.warn("[submit-contact] Resend email dispatch failed (message is safely preserved in DB):", resendErrText);
        } else {
          console.info("[submit-contact] Notification email successfully sent via Resend.");
        }
      } catch (emailErr) {
        // Do not fail the submission if email delivery encounters a network error
        console.warn("[submit-contact] Resend notification exception:", (emailErr as Error).message);
      }
    } else {
      console.info("[submit-contact] RESEND_API_KEY or CONTACT_NOTIFICATION_EMAIL not configured. Contact saved to database only.");
    }

    // 10. Return Safe Success Response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been securely sent! I will review it and get back to you shortly.",
        contactId: insertedContact?.id,
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[submit-contact] Unexpected error:", (err as Error).message);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred while submitting your message." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper to escape HTML characters in email notification
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
