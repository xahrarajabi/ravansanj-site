import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });

  let thread = await prisma.chatThread.findFirst({
    where: { userId: session.userId, status: "open" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!thread) {
    thread = await prisma.chatThread.create({
      data: {
        userId: session.userId,
        messages: {
          create: {
            sender: "support",
            body: "سلام! به پشتیبانی روان‌سنج خوش آمدید. پیام خود را بنویسید.",
          },
        },
      },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  }

  return NextResponse.json({ data: thread });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });

  const body = await req.json();
  const text = String(body.body || "").trim();
  if (!text) return NextResponse.json({ error: "پیام خالی است" }, { status: 400 });

  let thread = await prisma.chatThread.findFirst({
    where: { userId: session.userId, status: "open" },
  });
  if (!thread) {
    thread = await prisma.chatThread.create({
      data: { userId: session.userId },
    });
  }

  await prisma.chatMessage.create({
    data: { threadId: thread.id, sender: "user", body: text },
  });

  // auto stub reply
  await prisma.chatMessage.create({
    data: {
      threadId: thread.id,
      sender: "support",
      body: "پیامتان دریافت شد. تیم روان‌سنج به‌زودی پاسخ می‌دهد. (پاسخ خودکار)",
    },
  });

  const full = await prisma.chatThread.findUnique({
    where: { id: thread.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json({ data: full });
}
