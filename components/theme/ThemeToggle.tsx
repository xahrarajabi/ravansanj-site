"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, resolved, cycle } = useTheme();
  const label =
    theme === "system"
      ? `حالت سیستم (${resolved === "dark" ? "تیره" : "روشن"})`
      : theme === "dark"
        ? "حالت تیره"
        : "حالت روشن";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`تغییر پوسته — ${label}`}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-text transition hover:border-primary/40 hover:bg-primary-soft ${className}`}
    >
      {resolved === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 14.3A8.5 8.5 0 0 1 9.7 3 7 7 0 1 0 21 14.3Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
