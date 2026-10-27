import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "super-secret-key-cospace",
);
const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "super-refresh-key-cospace",
);
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export async function createAccessToken(payload: {
  userId: string;
  role: string;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(ACCESS_TOKEN_EXPIRES_IN)
    .sign(JWT_ACCESS_SECRET);
}

export async function createRefreshToken(payload: { userId: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(REFRESH_TOKEN_EXPIRES_IN)
    .sign(JWT_REFRESH_SECRET);
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_ACCESS_SECRET);
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    return payload as { userId: string };
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}
