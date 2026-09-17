"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";

type Msg = { id: string; sender: string; body: string };

export function ChatClient() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  async function load() {
    const res = await fetch("/api/chat");
    const data = await res.json();
    setMessages(data.data?.messages || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });
    const data = await res.json();
    setMessages(data.data?.messages || []);
    setText("");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Logo />
        <Link href="/dashboard" className="text-sm text-primary">
          داشبورد
        </Link>
      </div>
      <Card className="flex flex-1 flex-col p-4">
        <h1 className="mb-4 font-extrabold">چت پشتیبانی</h1>
        <div className="mb-4 flex max-h-[60vh] flex-1 flex-col gap-2 overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                m.sender === "user"
                  ? "self-start bg-primary text-white"
                  : "self-end bg-neutral text-text"
              }`}
            >
              {m.body}
            </div>
          ))}
        </div>
        <form onSubmit={send} className="flex gap-2">
          <input
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="پیام..."
          />
          <Button type="submit">ارسال</Button>
        </form>
      </Card>
    </div>
  );
}
