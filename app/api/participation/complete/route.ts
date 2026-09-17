import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { computeResult } from "@/lib/scoring";
import { notifyUser } from "@/lib/notify";
import {
  gatherOtherAnswers,
  persistSessionReports,
} from "@/lib/report-persist";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
  }

  const body = await req.json();
  const sessionId = String(body.sessionId || "");
  const answers = Array.isArray(body.answers) ? body.answers : [];

  if (!sessionId || answers.length === 0) {
    return NextResponse.json({ error: "داده ناقص است" }, { status: 400 });
  }

  const testSession = await prisma.testSession.findFirst({
    where: { id: sessionId, userId: session.userId },
    include: {
      test: {
        include: {
          questions: { include: { options: true } },
        },
      },
    },
  });

  if (!testSession) {
    return NextResponse.json({ error: "نشست یافت نشد" }, { status: 404 });
  }

  if (testSession.status === "completed" && testSession.resultJson) {
    const existingInitial = await prisma.report.findFirst({
      where: { sessionId, type: "initial" },
      orderBy: { createdAt: "desc" },
    });
    let scored;
    try {
      scored = JSON.parse(testSession.resultJson);
    } catch {
      scored = null;
    }
    return NextResponse.json({
      data: {
        sessionId,
        result: scored,
        reportId: existingInitial?.id,
        alreadyCompleted: true,
      },
    });
  }

  for (const a of answers) {
    const questionId = String(a.questionId);
    const optionId = String(a.optionId);
    const question = testSession.test.questions.find((q) => q.id === questionId);
    if (!question || question.perspective !== "self") continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;

    await prisma.answer.upsert({
      where: { sessionId_questionId: { sessionId, questionId } },
      create: { sessionId, questionId, optionId },
      update: { optionId },
    });
  }

  const selfQuestions = testSession.test.questions.filter(
    (q) => q.perspective === "self"
  );
  const saved = await prisma.answer.findMany({
    where: { sessionId },
    include: { option: true, question: true },
  });

  if (saved.length < selfQuestions.length) {
    return NextResponse.json(
      { error: "همه سؤالات باید پاسخ داده شوند" },
      { status: 400 }
    );
  }

  const otherAnswers = await gatherOtherAnswers(
    session.userId,
    testSession.testId
  );

  const scored = computeResult(
    saved.map((a) => ({ trait: a.question.trait, score: a.option.score })),
    otherAnswers
  );

  await prisma.testSession.update({
    where: { id: sessionId },
    data: {
      status: "completed",
      completedAt: new Date(),
      resultJson: JSON.stringify(scored),
    },
  });

  const { initialId } = await persistSessionReports(
    sessionId,
    session.userId,
    scored,
    {
      title: testSession.test.title,
      category: testSession.test.category,
      slug: testSession.test.slug,
    }
  );

  await notifyUser(
    session.userId,
    "گزارش آماده است",
    `نتیجه «${testSession.test.title}» ثبت شد.`,
    `/reports/${initialId}`
  );

  return NextResponse.json({
    data: { sessionId, result: scored, reportId: initialId },
  });
}
