import { prisma } from "@/lib/prisma";

export const UNLOCK_KEYS = {
  comprehensive: "comprehensive_report",
  growthPath: "growth_path",
  careerSuite: "career_suite",
  fullSuite: "full_suite",
} as const;

export type UnlockKey = (typeof UNLOCK_KEYS)[keyof typeof UNLOCK_KEYS];

const FREE_REPORT_TYPES = new Set(["initial", "detailed"]);

/** Chapters that require a paid unlock when viewing type encyclopedia */
export const PAID_CHAPTERS = new Set(["careers", "workplace"]);

export function getUnlockKeyFromProduct(product: {
  unlockKey?: string | null;
  metaJson?: string | null;
}): string | null {
  if (product.unlockKey) return product.unlockKey;
  try {
    const meta = JSON.parse(product.metaJson || "{}") as { unlockKey?: string };
    return meta.unlockKey || null;
  } catch {
    return null;
  }
}

export function unlockKeyForReportType(type: string): UnlockKey | null {
  if (type === "comprehensive") return UNLOCK_KEYS.comprehensive;
  if (type === "growth_path") return UNLOCK_KEYS.growthPath;
  return null;
}

export function hrefForUnlockKey(key: string): string {
  if (key === UNLOCK_KEYS.growthPath) return "/growth-path";
  if (key === UNLOCK_KEYS.careerSuite || key === UNLOCK_KEYS.fullSuite) {
    return "/profile/career";
  }
  return "/reports";
}

export async function userHasUnlock(userId: string, key: string) {
  const row = await prisma.contentUnlock.findUnique({
    where: { userId_key: { userId, key } },
  });
  return Boolean(row);
}

export async function userUnlockKeys(userId: string): Promise<Set<string>> {
  const rows = await prisma.contentUnlock.findMany({
    where: { userId },
    select: { key: true },
  });
  return new Set(rows.map((r) => r.key));
}

export function hasCareer(keys: Set<string>) {
  return keys.has(UNLOCK_KEYS.careerSuite) || keys.has(UNLOCK_KEYS.fullSuite);
}

export function hasFull(keys: Set<string>) {
  return keys.has(UNLOCK_KEYS.fullSuite);
}

export function canViewPaidChapter(chapter: string, keys: Set<string>) {
  if (!PAID_CHAPTERS.has(chapter)) return true;
  return hasCareer(keys);
}

export function isReportEntitled(
  report: { type: string; unlocked: boolean },
  unlockKeys: Set<string>
) {
  if (FREE_REPORT_TYPES.has(report.type) || report.unlocked) return true;
  const key = unlockKeyForReportType(report.type);
  return Boolean(key && unlockKeys.has(key));
}

export async function syncUnlocksForUser(userId: string, key: string) {
  if (key === UNLOCK_KEYS.comprehensive) {
    await prisma.report.updateMany({
      where: { userId, type: "comprehensive" },
      data: { unlocked: true },
    });
  }
  if (key === UNLOCK_KEYS.growthPath) {
    await prisma.report.updateMany({
      where: { userId, type: "growth_path" },
      data: { unlocked: true },
    });
  }
}

export async function grantUnlock(userId: string, key: string) {
  await prisma.contentUnlock.upsert({
    where: { userId_key: { userId, key } },
    create: { userId, key },
    update: {},
  });
  await syncUnlocksForUser(userId, key);
}

export async function canAccessReport(
  userId: string,
  report: { id: string; type: string; unlocked: boolean }
) {
  if (FREE_REPORT_TYPES.has(report.type) || report.unlocked) return true;

  const key = unlockKeyForReportType(report.type);
  if (!key) return false;

  const entitled = await userHasUnlock(userId, key);
  if (!entitled) return false;

  await prisma.report.update({
    where: { id: report.id },
    data: { unlocked: true },
  });
  return true;
}

/** Relative app paths only — blocks open redirects. */
export function sanitizeReturnTo(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const path = value.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  if (path.includes("://") || path.includes("\\") || path.includes("\n")) {
    return null;
  }
  if (!/^\/[a-zA-Z0-9/_?=&%-]*$/.test(path)) return null;
  return path;
}
