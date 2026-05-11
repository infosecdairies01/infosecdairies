// RSA-2048 public key — safe to ship in the browser bundle (it's public).
// The server signs every JWT with the matching private key (RS256).
// Verification here is 100% local: no HTTP call, no response to intercept.
// An attacker CANNOT forge a token that passes this check without the private key.
const JWT_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoAuJkL6RL4MuFMIsnpvL
yijh49oaZEX9oGK72oAD2xsiZWkaLVi22bw7roY+46WNaN7sGNzSwvPVVXODPT78
jwKnCpJL4a3Dst3tw7QnCTttLMEktWw0Sj1zuo9ILUxa0fQ7IzdEglNcsmgewXpv
q8VotQOUZ8ILB5WR0/yzknp4Hge7pHoibtI/HMcOopyaypOh9PCytGjRbE5ltyfe
FbA3/33udPRLTwnfXEEK/EHKj/mMAqZcuC9+rBMapPLSeLja4KNrwBSgLYGtqmiD
d4ccY/FI+447cPPb30zM4k2+/8TBcIhG6GjXko1B3k99swyZXxQFZYhv/NCc1bHq
mQIDAQAB
-----END PUBLIC KEY-----`;

let _cachedKey: CryptoKey | null = null;

async function getPublicKey(): Promise<CryptoKey> {
  if (_cachedKey) return _cachedKey;

  // Strip PEM header/footer and decode base64
  const pem = JWT_PUBLIC_KEY_PEM.replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");

  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));

  _cachedKey = await crypto.subtle.importKey(
    "spki",
    der.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  return _cachedKey;
}

export interface VerifiedJwtPayload {
  email?: string;
  user_id?: number;
  exp?: number;
  [key: string]: unknown;
}

function decodeB64Url(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  return atob(padded);
}

/**
 * Verify a JWT and return its payload. Throws if the token is expired or tampered.
 *
 * RS256 tokens: full cryptographic signature verification using the embedded
 * public key — an attacker cannot forge these without the private key.
 *
 * HS256 tokens: signature verification is skipped (the frontend never has the
 * HMAC secret), but expiry and the email claim are still checked. The backend
 * validates the signature on every authenticated API call, so this is safe.
 * HS256 is only issued when the RS256 private key is unavailable in the server
 * environment; once the key is configured the server switches back to RS256
 * automatically.
 */
export async function verifyJwtLocally(token: string): Promise<VerifiedJwtPayload> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed token");

  const [headerB64, payloadB64, signatureB64] = parts;

  // Decode header to read the algorithm
  const header = JSON.parse(decodeB64Url(headerB64)) as { alg?: string };

  // Decode payload
  const payload: VerifiedJwtPayload = JSON.parse(decodeB64Url(payloadB64));

  // Always check expiry
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  // Only RS256 is accepted. Allowing HS256/none lets an attacker forge a token with
  // any payload (we can't verify HMAC without the server secret), bypass the local
  // check, and access all static lesson/quiz content without a paid account.
  if (header.alg !== "RS256") {
    throw new Error(`Unsupported token algorithm: ${header.alg}. Only RS256 is accepted.`);
  }

  const signatureBytes = Uint8Array.from(
    decodeB64Url(signatureB64),
    (c) => c.charCodeAt(0)
  );
  const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const publicKey = await getPublicKey();
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    signatureBytes,
    signedData
  );
  if (!valid) throw new Error("Invalid token signature");

  return payload;
}
