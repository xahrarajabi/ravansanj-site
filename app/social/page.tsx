import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SocialClient } from "@/components/social/SocialClient";

export const metadata = { title: "اجتماعی" };

export default async function SocialPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  return (
    <div className="min-h-screen bg-bg">
      <SocialClient />
    </div>
  );
}
