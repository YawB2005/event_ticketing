/**
 * Contact form API layer — connect to backend when NEXT_PUBLIC_API_URL is set.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function submitContactForm({ name, email, subject, message }) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (!res.ok) throw new Error("Unable to send your message. Please try again.");
    return res.json();
  }

  // No backend configured — simulate failure so we don't mislead users
  await new Promise((r) => setTimeout(r, 600));
  throw new Error(
    "Contact form submission is not yet connected to the backend. Your message was not sent."
  );
}
