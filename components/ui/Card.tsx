import { HTMLAttributes } from "react";

export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[var(--radius)] border border-line/80 bg-card shadow-[var(--shadow)] ${className}`}
      {...props}
    />
  );
}
