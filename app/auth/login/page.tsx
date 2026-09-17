import { LoginForm } from "@/components/auth/LoginForm";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "ورود",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-bg">
      <LoginForm />
    </div>
  );
}
