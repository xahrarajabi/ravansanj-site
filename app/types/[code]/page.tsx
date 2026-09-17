import { notFound } from "next/navigation";
import { TYPE_BY_CODE } from "@/lib/personality/types/catalog";
import { TypeChapterView } from "@/components/personality/types/TypeChapterView";
import { getSession } from "@/lib/auth";
import { userUnlockKeys } from "@/lib/access";
import { SiteHeader } from "@/components/chrome/SiteHeader";

export default async function TypeIntroPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = raw.toUpperCase();
  if (!TYPE_BY_CODE[code]) notFound();

  const session = await getSession();
  const keys = session ? await userUnlockKeys(session.userId) : new Set<string>();

  return (
    <div className="page-shell soft-glow min-h-screen">
      <SiteHeader loggedIn={Boolean(session)} />
      <TypeChapterView code={code} chapter="intro" unlockKeys={keys} />
    </div>
  );
}
