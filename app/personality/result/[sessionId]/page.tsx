import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession, readGuestId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResultView } from "@/components/personality/ResultView";
import type { TypeResult } from "@/lib/personality/scoring";
import { SiteHeader } from "@/components/chrome/SiteHeader";

export default async function PersonalityResultPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const guestId = await readGuestId();
  const auth = await getSession();

  const row = await prisma.personalitySession.findFirst({
    where: {
      id: sessionId,
      status: "completed",
      OR: [
        ...(guestId ? [{ guestId }] : []),
        ...(auth ? [{ userId: auth.userId }] : []),
      ],
    },
  });
  if (!row?.resultJson) notFound();

  let result: TypeResult;
  try {
    result = JSON.parse(row.resultJson) as TypeResult;
  } catch {
    notFound();
  }

  return (
    <div className="page-shell soft-glow min-h-screen">
      <SiteHeader loggedIn={Boolean(auth)} compact />
      <div className="mx-auto flex max-w-3xl justify-end gap-3 px-4 pt-4 text-sm">
        {!auth ? (
          <Link
            href={`/auth/login?next=/personality/result/${sessionId}`}
            className="font-bold text-primary"
          >
            ذخیره با ورود
          </Link>
        ) : (
          <Link href="/dashboard" className="font-bold text-primary">
            داشبورد
          </Link>
        )}
      </div>
      <ResultView result={result} />
    </div>
  );
}
