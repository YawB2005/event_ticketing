/**
 * Authentication API layer — connect to backend when NEXT_PUBLIC_API_URL is set.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/**
 * Request a password reset link. Always returns success message for security
 * (does not reveal whether the email exists).
 */
export async function requestPasswordReset(email) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Unable to process your request. Please try again.");
    return res.json();
  }

  await new Promise((r) => setTimeout(r, 800));
  return { success: true };
}

/**
 * Reset password using a token from the reset email link.
 */
export async function resetPassword(token, password) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (res.status === 400 || res.status === 401) {
      throw new Error("This reset link is invalid or has expired.");
    }
    if (!res.ok) throw new Error("Unable to reset your password. Please try again.");
    return res.json();
  }

  await new Promise((r) => setTimeout(r, 800));

  if (!token || token === "invalid" || token === "expired") {
    throw new Error("This reset link is invalid or has expired.");
  }

  return { success: true };
}
