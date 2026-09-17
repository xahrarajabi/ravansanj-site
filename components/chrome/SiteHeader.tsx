"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const NAV = [
  { href: "/personality", label: "آزمون تیپ" },
  { href: "/types", label: "۱۶ تیپ" },
  { href: "/articles", label: "مقالات" },
  { href: "/pricing", label: "بسته‌ها" },
  { href: "/about", label: "درباره" },
  { href: "/faq", label: "سوالات" },
];

export function SiteHeader({
  loggedIn = false,
  compact = false,
}: {
  loggedIn?: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-[var(--header-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:h-[4.25rem]">
        <Logo />

        {!compact ? (
          <nav className="hidden items-center gap-1 lg:flex" aria-label="منوی اصلی">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm font-bold text-text-secondary transition hover:bg-primary-soft hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loggedIn ? (
            <Link href="/dashboard">
              <Button variant="secondary" size="sm" className="!min-h-10">
                داشبورد
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login" className="hidden sm:inline-flex">
              <Button variant="secondary" size="sm" className="!min-h-10">
                ورود
              </Button>
            </Link>
          )}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-text lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-line bg-card px-4 py-4 lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="منوی موبایل">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-sm font-bold text-text hover:bg-primary-soft"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={loggedIn ? "/dashboard" : "/auth/login"}
              className="mt-2 rounded-xl bg-primary px-3 py-3 text-center text-sm font-bold text-white"
              onClick={() => setOpen(false)}
            >
              {loggedIn ? "داشبورد من" : "ورود / ثبت‌نام"}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
