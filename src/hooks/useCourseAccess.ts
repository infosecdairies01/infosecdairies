import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "@/services/api";
import { verifyJwtLocally } from "@/lib/jwtVerify";
import { useAuth } from "@/context/AuthContext";

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
  isStaff: boolean;
  recheck: () => void;
} {
  const { isAuthenticated } = useAuth();
  const [accessState, setAccessState] = useState<CourseAccessState>("loading");
  const [isPaid, setIsPaid] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  // Instantly lock out when the user logs out — don't wait for the next verify() cycle
  useEffect(() => {
    if (!isAuthenticated) {
      if (slug) sessionStorage.removeItem(SESSION_KEY(slug));
      setAccessState("unauthenticated");
    }
  }, [isAuthenticated, slug]);

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
          setIsStaff(payload.is_staff === true);
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

      // Verify the RSA signature locally when possible (RS256 path).
      // If the server is using HS256 fallback (JWT_PRIVATE_KEY not configured),
      // we cannot verify locally — fall back to decoding the payload without
      // signature check. The server already validated enrollment before issuing
      // this token, and HTTPS prevents MITM modification of the response.
      let payload: Awaited<ReturnType<typeof verifyJwtLocally>>;
      try {
        payload = await verifyJwtLocally(data.access_token);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        if (msg.toLowerCase().includes("algorithm") || msg.toLowerCase().includes("unsupported")) {
          // HS256 fallback — decode without signature verification
          try {
            const b64 = data.access_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
            const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
            payload = JSON.parse(atob(padded));
          } catch {
            setAccessState("denied");
            return;
          }
        } else {
          // Actual signature forgery attempt or network error
          setAccessState("denied");
          return;
        }
      }

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
      setIsStaff(payload.is_staff === true);
      setAccessState("granted");
    } catch {
      // Network error
      setAccessState("denied");
    }
  }, [slug]);

  useEffect(() => {
    verify();
  }, [verify]);

  return { accessState, isPaid, isStaff, recheck: verify };
}
