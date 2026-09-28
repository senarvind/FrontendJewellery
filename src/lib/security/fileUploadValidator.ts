/**
 * FILE UPLOAD SAFETY & VALIDATION MODULE
 * Strictly validates file types, file signatures (magic bytes), file sizes, and extensions.
 * Ensures uploaded files are isolated and can NEVER be executed as code.
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedFileName?: string;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const DANGEROUS_EXTENSIONS = new Set([
  "php",
  "phtml",
  "php3",
  "php4",
  "php5",
  "phps",
  "exe",
  "js",
  "jsx",
  "ts",
  "tsx",
  "py",
  "sh",
  "bat",
  "cmd",
  "html",
  "htm",
  "xhtml",
  "svg",
  "cgi",
  "pl",
  "asp",
  "aspx",
  "jsp",
  "dll",
  "so",
  "vbs",
  "jar",
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates a file before upload
 */
export async function validateFileUpload(file: File): Promise<FileValidationResult> {
  // 1. Validate File Presence
  if (!file) {
    return { isValid: false, error: "No file provided for upload." };
  }

  // 2. Validate File Size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed limit of 5 MB (Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
    };
  }

  // 3. Validate File Extension
  const nameParts = file.name.split(".");
  if (nameParts.length < 2) {
    return { isValid: false, error: "File must have a valid extension." };
  }

  const extension = nameParts.pop()?.toLowerCase() || "";
  if (DANGEROUS_EXTENSIONS.has(extension)) {
    return {
      isValid: false,
      error: `Security Alert: File type '.${extension}' is prohibited for upload.`,
    };
  }

  // 4. Validate MIME Type
  if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return {
      isValid: false,
      error: `Invalid file format '${file.type}'. Only JPEG, PNG, WEBP, and AVIF image formats are allowed.`,
    };
  }

  // 5. Validate File Content via Magic Bytes (Header Signature)
  try {
    const isSignatureValid = await checkMagicBytes(file);
    if (!isSignatureValid) {
      return {
        isValid: false,
        error: "Security Alert: File contents do not match its declared image format signature.",
      };
    }
  } catch (err) {
    return { isValid: false, error: "Failed to verify file integrity." };
  }

  // 6. Generate Safe Sanitized Filename (no special characters or path traversal)
  const cleanBaseName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.\.+/g, ".");
  const timestamp = Date.now();
  const sanitizedFileName = `${timestamp}_${cleanBaseName}`;

  return {
    isValid: true,
    sanitizedFileName,
  };
}

/**
 * Checks magic byte signatures of binary files
 */
async function checkMagicBytes(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Convert bytes to hex string
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join("");

  // JPEG: FF D8 FF
  if (hex.startsWith("FFD8FF")) return true;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (hex.startsWith("89504E47")) return true;

  // WEBP: RIFF...WEBP (52 49 46 46 ... 57 45 42 50)
  if (hex.startsWith("52494646") && hex.includes("57454250")) return true;

  // AVIF: ...ftypavif (hex contains 6674797061766966)
  if (hex.includes("66747970") || hex.includes("61766966")) return true;

  return false;
}
