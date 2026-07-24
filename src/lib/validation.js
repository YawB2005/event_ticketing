const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email || !email.trim()) {
    return "Please enter your email address.";
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return "Please enter a valid email address.";
  }
  return null;
}

export function validateRequired(value, fieldName) {
  if (!value || !value.trim()) {
    return `Please enter your ${fieldName}.`;
  }
  return null;
}

export function validateMessage(message, minLength = 10) {
  if (!message || !message.trim()) {
    return "Please enter your message.";
  }
  if (message.trim().length < minLength) {
    return `Your message must be at least ${minLength} characters.`;
  }
  return null;
}

/** Password rules per SRS: 8+ chars, uppercase, number, special character */
export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "number", label: "One number", test: (p) => /\d/.test(p) },
  { id: "special", label: "One special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function validatePassword(password) {
  if (!password) return "Please enter a password.";
  const failed = PASSWORD_RULES.filter((r) => !r.test(password));
  if (failed.length > 0) {
    return "Password does not meet the requirements.";
  }
  return null;
}

export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
}

export function getPasswordStrength(password) {
  if (!password) return 0;
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  return passed;
}
