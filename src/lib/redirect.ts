/**
 * Check if a redirect path is safe (relative, not protocol-relative).
 * Prevents open-redirect attacks.
 */
export function isSafeRedirect(path: string): boolean {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.startsWith("/\\")
  );
}
