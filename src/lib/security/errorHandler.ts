/**
 * ERROR HANDLING & INFORMATION LEAKAGE PROTECTION MODULE
 * Ensures users NEVER see raw stack traces, internal server file paths,
 * or raw database errors. Converts errors to clean, safe user messages.
 */

export interface SafeErrorResponse {
  userMessage: string;
  isSanitized: boolean;
}

/**
 * Sanitizes any error before presenting it to the user.
 * Prevents information leakage of stack traces, DB credentials, file paths, or raw exceptions.
 */
export function sanitizeUserError(error: any, fallbackMessage = "An unexpected issue occurred. Please try again."): SafeErrorResponse {
  if (!error) {
    return { userMessage: fallbackMessage, isSanitized: true };
  }

  // Extract raw message string if available
  const rawMsg = typeof error === "string" ? error : error?.message || String(error);

  // Log full error details in development mode for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("[Internal Error Audit]:", error);
  }

  // Check for dangerous sensitive keywords (Database, Stack trace, File paths, Environment keys)
  const SENSITIVE_PATTERNS = [
    /mongodb/i,
    /mongoose/i,
    /postgres/i,
    /mysql/i,
    /sql/i,
    /at\s+.*:\d+:\d+/i, // Stack trace line
    /[C-Z]:\\/i,        // Windows file path
    /\/home\//i,       // Linux file path
    /\/usr\//i,
    /jwt\s+secret/i,
    /key/i,
    /token\s+expired/i,
    /connection\s+refused/i,
    /ETIMEDOUT/i,
    /ECONNREFUSED/i,
    /syntaxerror/i,
  ];

  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(rawMsg)) {
      return {
        userMessage: "A temporary service error occurred. Please refresh or contact customer support.",
        isSanitized: true,
      };
    }
  }

  // Safe user-friendly business error messages can pass through
  const SAFE_BUSINESS_ERRORS = [
    "invalid credentials",
    "password must be at least",
    "email is required",
    "phone number is invalid",
    "out of stock",
    "payment canceled",
    "order not found",
  ];

  const lowerMsg = rawMsg.toLowerCase();
  for (const safeError of SAFE_BUSINESS_ERRORS) {
    if (lowerMsg.includes(safeError)) {
      return { userMessage: rawMsg, isSanitized: false };
    }
  }

  return { userMessage: fallbackMessage, isSanitized: true };
}
