import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "@/services/api";
import { verifyJwtLocally } from "@/lib/jwtVerify";

export type CourseAccessState = "loading" | "granted" | "denied" | "unauthenticated";

const SESSION_KEY = (slug: string) => `course_access_token_${slug}`;

/**
 * Checks paid enrollment for a course using an RS256-signed access token.
 *
 * Attack resistance:
 * - The backend only issues the token after validating enrollment + payment.
 * - The token is RS256-signed with the server private key.
 * - The frontend verifies the signature locally using the hardcoded public key.
 * - Intercepting the response and modifying enrolled/is_paid fields makes
 *   the RSA signature invalid → local verify throws → access denied.
 * - A 403 from the backend cannot be spoofed into a 200 with a valid token
 *   because the attacker doesn't have the RSA private key to sign one.
 */
export function useCourseAccess(slug: string | undefined): {
  accessState: CourseAccessState;
  isPaid: boolean;
  recheck: () => void;
} {
  const [accessState, setAccessState] = useState<CourseAccessState>("loading");
  const [isPaid, setIsPaid] = useState(false);

  const verify = useCallback(async () => {
    if (!slug) {
      setAccessState("denied");
      return;
    }

    const authToken = localStorage.getItem("accessToken");
    if (!authToken) {
      setAccessState("unauthenticated");
      return;
    }

    setAccessState("loading");

    // Check sessionStorage for a cached + valid course access token first
    const cached = sessionStorage.getItem(SESSION_KEY(slug));
    if (cached) {
      try {
        const payload = await verifyJwtLocally(cached);
        if (
          payload.course_slug === slug &&
          payload.enrolled === true &&
          payload.token_type === "course_access"
        ) {
          setIsPaid(payload.is_paid === true);
          setAccessState("granted");
          return;
        }
      } catch {
        // Expired or tampered — fall through to re-fetch
        sessionStorage.removeItem(SESSION_KEY(slug));
      }
    }

    // Fetch a fresh signed token from the backend
    try {
      const res = await fetch(apiUrl(`/api/courses/${slug}/access-token/`), {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        setAccessState("unauthenticated");
        return;
      }

      if (!res.ok) {
        // 403 = not enrolled or not paid. Never trust a modified response —
        // without a valid signed token there is nothing to verify.
        setAccessState("denied");
        return;
      }

      const data = await res.json();

      // CRITICAL: verify the RSA signature locally.
      // If an attacker intercepted the response and changed the JSON fields,
      // the signature will not match → this throws → access denied.
      const payload = await verifyJwtLocally(data.access_token);

      if (
        payload.course_slug !== slug ||
        payload.enrolled !== true ||
        payload.token_type !== "course_access"
      ) {
        setAccessState("denied");
        return;
      }

      // Valid — cache in sessionStorage so we don't hit the backend on every render
      sessionStorage.setItem(SESSION_KEY(slug), data.access_token);
      setIsPaid(payload.is_paid === true);
      setAccessState("granted");
    } catch {
      // Network error OR signature verification failed
      setAccessState("denied");
    }
  }, [slug]);

  useEffect(() => {
    verify();
  }, [verify]);

  return { accessState, isPaid, recheck: verify };
}
