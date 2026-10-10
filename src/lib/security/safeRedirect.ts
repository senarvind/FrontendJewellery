/** Only allow redirects to paths on this site (blocks "//evil.com", "https://evil.com", "/\\evil.com"). */
export function safeRedirect(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "/";
  try {
    const url = new URL(raw, "https://www.kesharjewellers.com");
    return url.origin === "https://www.kesharjewellers.com" ? url.pathname + url.search + url.hash : "/";
  } catch {
    return "/";
  }
}
