import { getEdgeFunctionUrl, isSupabaseConfigured } from "../lib/supabase";

/**
 * Submits a contact inquiry to the Supabase Edge Function
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.email
 * @param {string} payload.subject
 * @param {string} payload.message
 * @param {string} [payload.honeypot]
 * @returns {Promise<{success: boolean, message?: string, error?: string, isUnconfigured?: boolean}>}
 */
export async function submitContactMessage({ name, email, subject, message, honeypot = "" }) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      isUnconfigured: true,
      error: "Supabase backend is not configured in local environment variables (.env).",
    };
  }

  const endpoint = getEdgeFunctionUrl("submit-contact");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        honeypot: honeypot.trim(),
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Server responded with status ${response.status}`,
      };
    }

    return {
      success: true,
      message: data.message || "Your message has been securely submitted! Thank you.",
    };
  } catch (err) {
    console.error("[contactService] Failed to submit message:", err);
    return {
      success: false,
      error: "Network error: Unable to reach the contact backend service. Please check your connection or send a direct email.",
    };
  }
}
