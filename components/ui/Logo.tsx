import Link from "next/link";

export function Logo({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 no-underline ${className}`}
      aria-label="روان‌سنج"
    >
      <span
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary"
        aria-hidden
      >
        {/* Minimal abstract mark: concentric rings suggesting assessment / reflection */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        </svg>
      </span>
      {!compact ? (
        <span className="text-[1.2rem] font-bold tracking-tight text-text">
          روان‌سنج
        </span>
      ) : null}
    </Link>
  );
}
