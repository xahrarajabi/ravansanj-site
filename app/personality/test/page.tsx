import { SiteHeader } from "@/components/chrome/SiteHeader";
import { getSession, readGuestId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PersonalityTestFlow } from "@/components/personality/PersonalityTestFlow";

export default async function PersonalityTestPage() {
  const guestId = await readGuestId();
  const auth = await getSession();

  let session = guestId
    ? await prisma.personalitySession.findFirst({
        where: {
          status: "in_progress",
          OR: [
            { guestId },
            ...(auth ? [{ userId: auth.userId }] : []),
          ],
        },
        orderBy: { startedAt: "desc" },
      })
    : null;

  if (!session) {
    const gid = guestId || crypto.randomUUID();
    session = await prisma.personalitySession.create({
      data: { guestId: gid, userId: auth?.userId ?? null },
    });
  }

  let answers: Record<string, number> = {};
  try {
    answers = JSON.parse(session.answersJson || "{}") as Record<string, number>;
  } catch {
    answers = {};
  }

  return (
    <div className="page-shell soft-glow min-h-screen">
      <SiteHeader loggedIn={Boolean(auth)} compact />
      <PersonalityTestFlow sessionId={session.id} initialAnswers={answers} />
    </div>
  );
}
