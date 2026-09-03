import * as jose from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "educational_platform_session";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "PARENT" | "ADMIN" | "BUSINESS_OWNER";
}

function getSecret(): Uint8Array {
  const jwtSecret = process.env.JWT_SECRET || "intelligent_learning_platform_secure_jwt_secret_2026_production_safe_token_key";
  return new TextEncoder().encode(jwtSecret);
}

export async function signToken(payload: {
  userId: string;
  email: string;
  role: string;
}): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{
  userId: string;
  email: string;
  role: string;
} | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getSecret());
    return payload as { userId: string; email: string; role: string };
  } catch (e) {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const user = await verifyToken(token);
  if (!user || !["STUDENT", "TEACHER", "PARENT", "ADMIN", "BUSINESS_OWNER"].includes(user.role)) return null;
  return user as AuthenticatedUser;
}

export async function requireRole(allowedRoles: AuthenticatedUser["role"][]): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("AUTHORIZATION_REQUIRED");
  }
  return user;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
