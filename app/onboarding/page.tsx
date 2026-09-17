import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export const metadata = { title: "آشنایی اولیه" };

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (user?.onboardedAt) redirect("/dashboard");

  const questions = await prisma.demographicQuestion.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen bg-bg">
      <OnboardingForm
        questions={questions.map((q) => ({
          id: q.id,
          key: q.key,
          text: q.text,
        }))}
      />
    </div>
  );
}
