import { prisma } from "@/lib/prisma";
import {
  buildAllReportPayloads,
  buildGrowthPathPayload,
} from "@/lib/report-builder";
import { computeResult, type ScoredResult } from "@/lib/scoring";

export async function gatherOtherAnswers(userId: string, testId: string) {
  const invites = await prisma.invite.findMany({
    where: {
      inviterId: userId,
      testId,
      status: "completed",
    },
    include: {
      responses: { include: { option: true, question: true } },
    },
  });
  return invites.flatMap((inv) =>
    inv.responses.map((r) => ({ trait: r.question.trait, score: r.option.score }))
  );
}

export async function scoreSession(sessionId: string): Promise<{
  scored: ScoredResult;
  test: { id: string; title: string; category: string; slug: string };
  userId: string;
} | null> {
  const testSession = await prisma.testSession.findUnique({
    where: { id: sessionId },
    include: {
      test: true,
      answers: { include: { option: true, question: true } },
    },
  });
  if (!testSession) return null;

  const selfAnswers = testSession.answers
    .filter((a) => a.question.perspective === "self")
    .map((a) => ({ trait: a.question.trait, score: a.option.score }));

  const otherAnswers = await gatherOtherAnswers(
    testSession.userId,
    testSession.testId
  );

  const scored = computeResult(selfAnswers, otherAnswers);
  return {
    scored,
    test: {
      id: testSession.test.id,
      title: testSession.test.title,
      category: testSession.test.category,
      slug: testSession.test.slug,
    },
    userId: testSession.userId,
  };
}

export async function persistSessionReports(
  sessionId: string,
  userId: string,
  scored: ScoredResult,
  test: { title: string; category: string; slug: string }
) {
  const unlock = await prisma.contentUnlock.findUnique({
    where: {
      userId_key: { userId, key: "comprehensive_report" },
    },
  });

  const payloads = buildAllReportPayloads(scored, test);

  await prisma.report.deleteMany({ where: { sessionId } });

  const created = await prisma.$transaction([
    prisma.report.create({
      data: {
        userId,
        sessionId,
        type: "initial",
        title: payloads.titles.initial,
        payloadJson: JSON.stringify(payloads.initial),
        unlocked: true,
      },
    }),
    prisma.report.create({
      data: {
        userId,
        sessionId,
        type: "detailed",
        title: payloads.titles.detailed,
        payloadJson: JSON.stringify(payloads.detailed),
        unlocked: true,
      },
    }),
    prisma.report.create({
      data: {
        userId,
        sessionId,
        type: "comprehensive",
        title: payloads.titles.comprehensive,
        payloadJson: JSON.stringify(payloads.comprehensive),
        unlocked: Boolean(unlock),
      },
    }),
  ]);

  return { reports: created, initialId: created[0].id };
}

export async function recomputeLatestSessionForTest(
  userId: string,
  testId: string
) {
  const latest = await prisma.testSession.findFirst({
    where: { userId, testId, status: "completed" },
    orderBy: { completedAt: "desc" },
  });
  if (!latest) return null;

  const scoredData = await scoreSession(latest.id);
  if (!scoredData) return null;

  await prisma.testSession.update({
    where: { id: latest.id },
    data: { resultJson: JSON.stringify(scoredData.scored) },
  });

  await persistSessionReports(
    latest.id,
    userId,
    scoredData.scored,
    scoredData.test
  );

  return latest.id;
}

export async function upsertGrowthPathReport(userId: string) {
  const sessions = await prisma.testSession.findMany({
    where: { userId, status: "completed" },
    include: { test: { select: { slug: true, title: true } } },
    orderBy: { completedAt: "desc" },
  });

  const payload = buildGrowthPathPayload(
    sessions.map((s) => ({
      testSlug: s.test.slug,
      testTitle: s.test.title,
      resultJson: s.resultJson,
    }))
  );

  const existing = await prisma.report.findFirst({
    where: { userId, type: "growth_path", sessionId: null },
    orderBy: { createdAt: "desc" },
  });

  const unlock = await prisma.contentUnlock.findUnique({
    where: { userId_key: { userId, key: "growth_path" } },
  });

  if (existing) {
    return prisma.report.update({
      where: { id: existing.id },
      data: {
        title: "مسیر رشد ۳۰ روزه",
        payloadJson: JSON.stringify(payload),
        unlocked: Boolean(unlock),
      },
    });
  }

  return prisma.report.create({
    data: {
      userId,
      sessionId: null,
      type: "growth_path",
      title: "مسیر رشد ۳۰ روزه",
      payloadJson: JSON.stringify(payload),
      unlocked: Boolean(unlock),
    },
  });
}
