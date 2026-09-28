/**
 * STRICT INPUT VALIDATION MODULE
 * Validates every user input against strict schema rules (Type, Length, Format).
 * Rejects invalid data outright rather than relying solely on escaping.
 */

export interface ValidationRuleResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

/**
 * Validates Indian 10-digit mobile phone numbers
 */
export function validatePhone(phone: string): ValidationRuleResult {
  if (!phone) {
    return { isValid: false, error: "Phone number is required." };
  }

  const cleanPhone = phone.trim().replace(/[\s\-\(\)\+]/g, "").replace(/^91/, "");

  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return {
      isValid: false,
      error: "Please enter a valid 10-digit Indian mobile number (e.g., 9827415111).",
    };
  }

  return { isValid: true, sanitizedValue: cleanPhone };
}

/**
 * Validates email addresses
 */
export function validateEmail(email: string): ValidationRuleResult {
  if (!email) {
    return { isValid: false, error: "Email address is required." };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail.length > 100) {
    return { isValid: false, error: "Email address is too long (max 100 characters)." };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }

  return { isValid: true, sanitizedValue: cleanEmail };
}

/**
 * Validates user full names
 */
export function validateName(name: string): ValidationRuleResult {
  if (!name) {
    return { isValid: false, error: "Name is required." };
  }

  const cleanName = name.trim();
  if (cleanName.length < 2 || cleanName.length > 50) {
    return { isValid: false, error: "Name must be between 2 and 50 characters." };
  }

  if (!/^[a-zA-Z\s.'-]+$/.test(cleanName)) {
    return { isValid: false, error: "Name can only contain letters, spaces, dots, and hyphens." };
  }

  return { isValid: true, sanitizedValue: cleanName };
}

/**
 * Validates passwords
 */
export function validatePassword(password: string): ValidationRuleResult {
  if (!password) {
    return { isValid: false, error: "Password is required." };
  }

  if (password.length < 6 || password.length > 64) {
    return { isValid: false, error: "Password must be between 6 and 64 characters long." };
  }

  return { isValid: true, sanitizedValue: password };
}

/**
 * Validates Order IDs and Search queries
 */
export function validateSearchQuery(query: string): ValidationRuleResult {
  if (!query) {
    return { isValid: false, error: "Search query is empty." };
  }

  const cleanQuery = query.trim();
  if (cleanQuery.length > 50) {
    return { isValid: false, error: "Search query exceeds maximum 50 characters limit." };
  }

  // Reject malicious script tags or SQL injection tokens outright
  if (/<script|SELECT|INSERT|DELETE|UPDATE|DROP|--|;/i.test(cleanQuery)) {
    return { isValid: false, error: "Invalid characters detected in search query." };
  }

  return { isValid: true, sanitizedValue: cleanQuery };
}
