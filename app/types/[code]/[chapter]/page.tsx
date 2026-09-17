import { notFound } from "next/navigation";
import { TYPE_BY_CODE, type ChapterKey } from "@/lib/personality/types/catalog";
import { TypeChapterView } from "@/components/personality/types/TypeChapterView";
import { getSession } from "@/lib/auth";
import { userUnlockKeys } from "@/lib/access";
import { SiteHeader } from "@/components/chrome/SiteHeader";

const ALLOWED = new Set([
  "strengths",
  "relationships",
  "friends",
  "parents",
  "careers",
  "workplace",
  "conclusion",
]);

export default async function TypeChapterPage({
  params,
}: {
  params: Promise<{ code: string; chapter: string }>;
}) {
  const { code: raw, chapter } = await params;
  const code = raw.toUpperCase();
  if (!TYPE_BY_CODE[code] || !ALLOWED.has(chapter)) notFound();

  const session = await getSession();
  const keys = session ? await userUnlockKeys(session.userId) : new Set<string>();

  return (
    <div className="page-shell soft-glow min-h-screen">
      <SiteHeader loggedIn={Boolean(session)} />
      <TypeChapterView
        code={code}
        chapter={chapter as ChapterKey}
        unlockKeys={keys}
      />
    </div>
  );
}
