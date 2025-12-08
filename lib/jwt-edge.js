// lib/jwt-edge.js

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export async function verifyAccessToken(token) {
  const [headerB64, payloadB64, signatureB64] = token.split(".");

  const encoder = new TextEncoder();
  const data = `${headerB64}.${payloadB64}`;

  const signature = Uint8Array.from(atob(signatureB64), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "raw",
    ACCESS_SECRET,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(data)
  );

  if (!isValid) throw new Error("Invalid signature");

  const payloadJson = atob(payloadB64);
  return JSON.parse(payloadJson);
}
