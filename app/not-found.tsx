import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-extrabold text-text">صفحه پیدا نشد</h1>
      <p className="text-sm text-text-secondary">این آدرس وجود ندارد.</p>
      <Link href="/">
        <Button>بازگشت به خانه</Button>
      </Link>
    </div>
  );
}
