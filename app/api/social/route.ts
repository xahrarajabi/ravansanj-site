import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });

  const mode = req.nextUrl.searchParams.get("mode") || "me";

  if (mode === "me") {
    const profile = await prisma.socialProfile.findUnique({
      where: { userId: session.userId },
      include: {
        _count: { select: { followers: true, following: true, likesRecv: true } },
      },
    });
    return NextResponse.json({ data: profile });
  }

  const profiles = await prisma.socialProfile.findMany({
    where: { visibility: "public", NOT: { userId: session.userId } },
    take: 30,
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ data: profiles });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });

  const body = await req.json();
  const username = String(body.username || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
  const displayName = String(body.displayName || "").trim();
  const bio = String(body.bio || "").trim();
  const visibility = body.visibility === "private" ? "private" : "public";

  if (username.length < 3 || !displayName) {
    return NextResponse.json({ error: "نام کاربری یا نمایشی نامعتبر است" }, { status: 400 });
  }

  const exists = await prisma.socialProfile.findFirst({
    where: { username, NOT: { userId: session.userId } },
  });
  if (exists) {
    return NextResponse.json({ error: "این نام کاربری گرفته شده" }, { status: 400 });
  }

  // pull latest trait averages from completed sessions
  const sessions = await prisma.testSession.findMany({
    where: { userId: session.userId, status: "completed" },
    select: { resultJson: true },
    take: 10,
  });
  const traits: Record<string, number> = {};
  for (const s of sessions) {
    if (!s.resultJson) continue;
    try {
      const parsed = JSON.parse(s.resultJson);
      for (const t of parsed.traits || []) {
        traits[t.key] = t.score;
      }
    } catch {
      /* ignore */
    }
  }

  const profile = await prisma.socialProfile.upsert({
    where: { userId: session.userId },
    create: {
      userId: session.userId,
      username,
      displayName,
      bio,
      visibility,
      traitsJson: JSON.stringify(traits),
    },
    update: {
      username,
      displayName,
      bio,
      visibility,
      traitsJson: JSON.stringify(traits),
    },
  });

  return NextResponse.json({ data: profile });
}
