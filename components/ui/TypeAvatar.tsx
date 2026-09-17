import { ROLE_META, type RoleKey } from "@/lib/personality/types/catalog";

export function TypeAvatar({
  code,
  role,
  size = 160,
}: {
  code: string;
  role: RoleKey;
  size?: number;
}) {
  const color = ROLE_META[role].color;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      aria-hidden
      className="mx-auto"
    >
      <rect width="160" height="160" rx="28" fill={color} opacity="0.15" />
      <circle cx="80" cy="58" r="22" fill={color} />
      <rect x="42" y="88" width="76" height="44" rx="22" fill={color} />
      <text
        x="80"
        y="152"
        textAnchor="middle"
        fontSize="11"
        fill={color}
        fontFamily="Vazirmatn, sans-serif"
      >
        {code}
      </text>
    </svg>
  );
}
