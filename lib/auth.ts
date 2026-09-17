import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { prisma } from "./prisma";

export const SESSION_COOKIE = "mizoon_session";
export const GUEST_COOKIE = "mizoon_guest";

function getSecret() {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET / AUTH_SECRET must be set in production");
    }
    console.warn("[auth] Using insecure development JWT secret");
    return new TextEncoder().encode("mizoon-dev-secret-change-me");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId: string, phone: string) {
  return new SignJWT({ userId, phone })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const userId = payload.userId as string;
    if (!userId) return null;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    return {
      userId: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      theme: user.theme,
      avatarGender: user.avatarGender,
      onboarded: Boolean(user.onboardedAt),
    };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function readGuestId() {
  const headerStore = await headers();
  const fromHeader = headerStore.get("x-guest-id");
  if (fromHeader) return fromHeader;
  const cookieStore = await cookies();
  return cookieStore.get(GUEST_COOKIE)?.value || null;
}

export async function getOrCreateGuestId() {
  const existing = await readGuestId();
  if (existing) return existing;
  const id = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(GUEST_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
  return id;
}

export function normalizeIranPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let phone = digits;

  if (phone.startsWith("98") && phone.length === 12) {
    phone = "0" + phone.slice(2);
  }
  if (phone.startsWith("9") && phone.length === 10) {
    phone = "0" + phone;
  }

  if (!/^09\d{9}$/.test(phone)) return null;
  return phone;
}

export async function mergeGuestSessions(userId: string, guestId: string | null) {
  if (!guestId) return;
  await prisma.personalitySession.updateMany({
    where: { guestId, userId: null },
    data: { userId },
  });
  await prisma.extraSession.updateMany({
    where: { guestId, userId: null },
    data: { userId },
  });
}
