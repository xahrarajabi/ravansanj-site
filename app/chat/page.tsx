import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ChatClient } from "@/components/chat/ChatClient";

export const metadata = { title: "چت پشتیبانی" };

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  return (
    <div className="min-h-screen bg-bg">
      <ChatClient />
    </div>
  );
}
