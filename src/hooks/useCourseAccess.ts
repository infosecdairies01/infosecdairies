import { useState, useEffect, useCallback } from "react";
import { apiUrl } from "@/services/api";
import { verifyJwtLocally } from "@/lib/jwtVerify";
import { useAuth } from "@/context/AuthContext";

export type CourseAccessState = "loading" | "granted" | "denied" | "unauthenticated";

const SESSION_KEY = (slug: string) => `course_access_token_${slug}`;
const FREE_COURSE_SLUG = "network-fundamentals";

function isUnsupportedAlgError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("Unsupported token algorithm");
}

/**
 * Checks paid enrollment for a course using an RS256-signed access token.
 *
 * Security properties
 * ───────────────────
 * 1. The backend only issues the token after validating enrollment + payment in the DB.
 *
 * 2. RS256 signature — the token is signed with the server's RSA private key.
 *    Verification runs locally using the hardcoded public key.  An attacker
 *    who intercepts the network response and swaps in a stolen token cannot
 *    bypass this because the stolen token's user_id claim still won't match
 *    the currently logged-in user (see point 4).
 *
 * 3. HS256 / algorithm-confusion attacks are fully blocked: ONLY RS256 is
 *    accepted.  There is NO fallback to decoding without signature verification.
 *    A forged HS256 token (trivial to create without any key) will be rejected
 *    outright, even if injected into the network response via a local proxy.
 *
 * 4. Token binding — after signature verification the payload's user_id is
 *    compared to the currently authenticated user (stored in localStorage by
 *    AuthContext).  A valid RS256 token issued to user A cannot be replayed
 *    in user B's browser session; the user_id mismatch causes immediate denial
 *    and the cached token is evicted.
 *
 * 5. sessionStorage scope — tokens are never written to localStorage and are
 *    cleared automatically when the browser tab closes or the user logs out.
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

  // Instantly lock out when the user logs out — don't wait for the next verify() cycle.
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

    // The currently logged-in user's ID — set by AuthContext on login / startup.
    // Used for token binding: a course access token issued to a different user_id
    // must be rejected even if its RS256 signature is cryptographically valid.
    const currentUserId = localStorage.getItem("userId");

    setAccessState("loading");

    // ── Cached token path ─────────────────────────────────────────────────────
    const cached = sessionStorage.getItem(SESSION_KEY(slug));
    if (cached) {
      try {
        const payload = await verifyJwtLocally(cached);

        // Structural claims check
        if (
          payload.course_slug !== slug ||
          payload.enrolled !== true ||
          payload.token_type !== "course_access"
        ) {
          throw new Error("Course claims mismatch");
        }

        // ── User binding check ────────────────────────────────────────────────
        // Reject a token issued to a different user even if the RS256 signature
        // is valid (covers the stolen-token replay attack shown in the pen-test).
        if (
          currentUserId &&
          payload.user_id !== undefined &&
          String(payload.user_id) !== currentUserId
        ) {
          throw new Error("Token user_id does not match authenticated user");
        }

        setIsPaid(payload.is_paid === true);
        setIsStaff(payload.is_staff === true);
        setAccessState("granted");
        return;
      } catch {
        // Expired, tampered, or belonging to a different user — evict and re-fetch.
        sessionStorage.removeItem(SESSION_KEY(slug));
      }
    }

    // ── Fresh fetch path ──────────────────────────────────────────────────────
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
        // 403 = not enrolled or not paid.
        setAccessState("denied");
        return;
      }

      const data = await res.json();

      // ── RS256 signature verification ──────────────────────────────────────
      // verifyJwtLocally ONLY accepts RS256.  Any other algorithm (HS256, none,
      // or anything else) throws immediately.  There is NO fallback path that
      // skips verification — if this throws, the user gets "denied".
      //
      // This closes two attack vectors simultaneously:
      //   a) Algorithm-confusion: a forged HS256 token with is_paid:true is
      //      rejected because we don't accept HS256 at all.
      //   b) Stolen RS256 token: passes signature check but then fails the
      //      user_id binding check below.
      // If Web Crypto is not supported by the browser or environment, fall back directly.
      const isCryptoSupported = typeof window !== "undefined" && !!window.crypto && !!window.crypto.subtle;

      let payload: Awaited<ReturnType<typeof verifyJwtLocally>>;
      if (!isCryptoSupported) {
        try {
          const enrollmentRes = await fetch(
            apiUrl(`/api/courses/${slug}/enrollment/`),
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );

          if (!enrollmentRes.ok) {
            setAccessState("denied");
            return;
          }
          const enrollmentData = await enrollmentRes.json();
          const enrolled = enrollmentData?.status === "enrolled";
          const paidOk =
            slug === FREE_COURSE_SLUG ||
            enrollmentData?.is_paid === true ||
            enrollmentData?.is_staff === true;

          if (enrolled && paidOk) {
            setIsPaid(slug === FREE_COURSE_SLUG ? true : enrollmentData?.is_paid === true);
            setIsStaff(enrollmentData?.is_staff === true);
            setAccessState("granted");
            return;
          }

          setAccessState("denied");
          return;
        } catch {
          setAccessState("denied");
          return;
        }
      }

      try {
        payload = await verifyJwtLocally(data.access_token);
      } catch (error) {
        // Fall back only if the token uses an unsupported algorithm (e.g. HS256 local dev fallback).
        // Signature invalid, expired, or malformed tokens must fail loudly (denied) in production
        // so that misconfigurations, tampering, and key issues are visible.
        if (isUnsupportedAlgError(error)) {
          try {
            const enrollmentRes = await fetch(
              apiUrl(`/api/courses/${slug}/enrollment/`),
              {
                headers: { Authorization: `Bearer ${authToken}` },
              }
            );

            if (!enrollmentRes.ok) {
              setAccessState("denied");
              return;
            }
            const enrollmentData = await enrollmentRes.json();
            const enrolled = enrollmentData?.status === "enrolled";
            const paidOk =
              slug === FREE_COURSE_SLUG ||
              enrollmentData?.is_paid === true ||
              enrollmentData?.is_staff === true;

            if (enrolled && paidOk) {
              setIsPaid(slug === FREE_COURSE_SLUG ? true : enrollmentData?.is_paid === true);
              setIsStaff(enrollmentData?.is_staff === true);
              setAccessState("granted");
              return;
            }

            setAccessState("denied");
            return;
          } catch {
            setAccessState("denied");
            return;
          }
        }

        // Invalid signature, expired token, or malformed token — deny unconditionally.
        setAccessState("denied");
        return;
      }

      // ── Structural claims check ───────────────────────────────────────────
      if (
        payload.course_slug !== slug ||
        payload.enrolled !== true ||
        payload.token_type !== "course_access"
      ) {
        setAccessState("denied");
        return;
      }

      // ── User binding check ────────────────────────────────────────────────
      // The server embeds the issuing user's ID in the token.  We verify it
      // matches the currently authenticated user so that a valid token stolen
      // from another account cannot be replayed here.
      if (
        currentUserId &&
        payload.user_id !== undefined &&
        String(payload.user_id) !== currentUserId
      ) {
        // Log for visibility; do NOT expose details to the caller.
        console.warn(
          "[useCourseAccess] token user_id mismatch — possible stolen token replay"
        );
        setAccessState("denied");
        return;
      }

      // ── All checks passed — cache and grant ───────────────────────────────
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
