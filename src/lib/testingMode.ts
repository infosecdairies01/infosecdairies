// LOCAL TESTING ONLY. Requires VITE_TESTING_MODE=true in .env.local (gitignored,
// never present in Vercel/production env vars) AND import.meta.env.DEV, which Vite
// hardcodes to false for any production build (`vite build`). So even if this file
// were committed and deployed, TESTING_MODE evaluates to false on the live site
// regardless of what's in someone's local .env.local.
export const TESTING_MODE =
  import.meta.env.DEV && import.meta.env.VITE_TESTING_MODE === "true";
