"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

type Profile = {
  username: string;
  displayName: string;
  bio: string;
  visibility: string;
  traitsJson: string;
};

export function SocialClient() {
  const [me, setMe] = useState<Profile | null>(null);
  const [others, setOthers] = useState<Profile[]>([]);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const mine = await fetch("/api/social?mode=me").then((r) => r.json());
    if (mine.data) {
      setMe(mine.data);
      setUsername(mine.data.username);
      setDisplayName(mine.data.displayName);
      setBio(mine.data.bio || "");
    }
    const list = await fetch("/api/social?mode=discover").then((r) => r.json());
    setOthers(list.data || []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, displayName, bio }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "خطا");
      return;
    }
    setMsg("ذخیره شد");
    await load();
  }

  async function act(u: string, action: "follow" | "like") {
    await fetch("/api/social/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, action }),
    });
    setMsg(action === "like" ? "پسندیده شد" : "دنبال شد");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Logo />
        <Link href="/dashboard" className="text-sm text-primary">
          داشبورد
        </Link>
      </div>
      <Card className="mb-6 p-6">
        <h1 className="mb-4 text-xl font-extrabold">پروفایل اجتماعی</h1>
        <form onSubmit={save} className="flex flex-col gap-3">
          <Input
            id="username"
            label="نام کاربری (لاتین)"
            dir="ltr"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            id="displayName"
            label="نام نمایشی"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <label className="text-sm font-semibold">
            بیو
            <textarea
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>
          <Button type="submit">ذخیره پروفایل</Button>
        </form>
        {msg ? <p className="mt-2 text-xs text-text-secondary">{msg}</p> : null}
        {me ? (
          <p className="mt-3 text-xs text-primary">پروفایل فعال: @{me.username}</p>
        ) : null}
      </Card>
      <h2 className="mb-3 font-bold">کشف دیگران</h2>
      <div className="flex flex-col gap-3">
        {others.map((p) => (
          <Card key={p.username} className="p-4">
            <p className="font-extrabold">{p.displayName}</p>
            <p className="text-xs text-text-secondary" dir="ltr">
              @{p.username}
            </p>
            <p className="mt-2 text-sm text-text-secondary">{p.bio}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" onClick={() => act(p.username, "follow")}>
                دنبال کردن
              </Button>
              <Button variant="ghost" onClick={() => act(p.username, "like")}>
                پسند
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
