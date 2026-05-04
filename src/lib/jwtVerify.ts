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

/**
 * Cryptographically verify a JWT signed with RS256 using the embedded public key.
 * Returns the decoded payload if valid, throws if tampered or expired.
 * This runs entirely in the browser — no network call, nothing to intercept.
 */
export async function verifyJwtLocally(token: string): Promise<VerifiedJwtPayload> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed token");

  const [headerB64, payloadB64, signatureB64] = parts;

  // Decode signature
  const signatureBytes = Uint8Array.from(
    atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0)
  );

  // The data that was signed is "header.payload" as UTF-8
  const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

  const publicKey = await getPublicKey();
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    signatureBytes,
    signedData
  );

  if (!valid) throw new Error("Invalid token signature");

  // Decode payload (safe to read — signature already verified)
  const padding = "=".repeat((4 - (payloadB64.length % 4)) % 4);
  const payload: VerifiedJwtPayload = JSON.parse(
    atob((payloadB64 + padding).replace(/-/g, "+").replace(/_/g, "/"))
  );

  // Check expiry
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
}
