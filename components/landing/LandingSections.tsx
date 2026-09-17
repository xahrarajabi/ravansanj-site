"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { landingContent } from "@/lib/landing";

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export function LandingHeader({ loggedIn = false }: { loggedIn?: boolean }) {
  return <SiteHeader loggedIn={loggedIn} />;
}

export function LandingHero() {
  const { hero } = landingContent;

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-10 md:pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10 soft-glow" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-right">
          <motion.p
            {...fade}
            transition={{ duration: 0.45 }}
            className="mb-4 text-sm font-bold text-text-secondary"
          >
            {landingContent.tagline}
          </motion.p>
          <motion.h1
            {...fade}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-4 text-4xl font-bold leading-tight tracking-tight text-text md:text-5xl lg:text-[3.25rem]"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            {...fade}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-8 max-w-xl text-base font-medium leading-8 text-text-secondary md:text-lg lg:mx-0"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href={hero.ctaLink}>
              <Button size="lg">{hero.ctaText}</Button>
            </Link>
            <Link href={hero.secondaryCtaLink}>
              <Button size="lg" variant="secondary">
                {hero.secondaryCtaText}
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="relative mx-auto flex w-full max-w-md items-center justify-center"
          aria-hidden
        >
          <div className="absolute inset-6 rounded-[2rem] bg-primary/10 blur-2xl" />
          <div className="relative w-full rounded-[2rem] border border-line bg-card p-8 shadow-[var(--shadow)] md:p-10">
            <svg viewBox="0 0 320 240" className="h-auto w-full" fill="none">
              <rect x="24" y="28" width="272" height="184" rx="28" fill="var(--primary-soft)" />
              <circle cx="160" cy="108" r="52" stroke="var(--primary)" strokeWidth="2" opacity="0.35" />
              <circle cx="160" cy="108" r="32" stroke="var(--primary)" strokeWidth="2.2" opacity="0.7" />
              <circle cx="160" cy="108" r="10" fill="var(--primary)" />
              <rect x="72" y="172" width="176" height="10" rx="5" fill="var(--primary)" opacity="0.25" />
              <rect x="96" y="190" width="128" height="8" rx="4" fill="var(--primary)" opacity="0.15" />
            </svg>
            <p className="mt-2 text-center text-sm font-bold text-muted">
              فضای آرام برای ارزیابی ساخت‌یافته
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function LandingHowItWorks() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-center text-2xl font-bold text-text md:text-3xl">
          مسیر ارزیابی چگونه است؟
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-7 text-muted md:text-base">
          سه گام ساده تا تصویری روشن‌تر از الگوهای فکری و ارتباطی‌تان.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {landingContent.howItWorks.map((item, i) => (
            <Card
              key={i}
              className="p-6 transition duration-200 hover:-translate-y-0.5 hover:border-primary/30"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-sm font-bold text-primary">
                {i + 1}
              </div>
              <h3 className="mb-2 text-lg font-bold text-text">{item.title}</h3>
              <p className="text-sm leading-7 text-text-secondary">{item.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingJourneys() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-center text-2xl font-bold text-text md:text-3xl">
          حوزه‌های ارزیابی
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-7 text-muted">
          از تیپ شخصیت تا روابط و رشد — هر مسیر یک هدف روشن دارد.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {landingContent.journeys.map((j, i) => (
            <Card key={i} className="border-primary/10 p-6">
              <h3 className="mb-2 text-lg font-bold text-primary">{j.title}</h3>
              <p className="text-sm leading-7 text-text-secondary">{j.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingManifesto() {
  const lines = landingContent.manifesto.content.split("\n\n");
  return (
    <section className="px-4 py-16">
      <Card className="mx-auto max-w-3xl p-8 md:p-12">
        <h2 className="mb-5 text-xl font-bold text-text md:text-2xl">
          {landingContent.manifesto.title}
        </h2>
        {lines.map((line, i) => (
          <p
            key={i}
            className="mb-4 text-sm leading-8 text-text-secondary last:mb-0 md:text-base"
          >
            {line}
          </p>
        ))}
      </Card>
    </section>
  );
}

export function LandingFaqPreview() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-text md:text-3xl">
          سوالات پرتکرار
        </h2>
        <div className="flex flex-col gap-3">
          {landingContent.faqPreview.map((f, i) => (
            <Card key={i} className="p-5">
              <h3 className="mb-2 font-bold text-text">{f.q}</h3>
              <p className="text-sm leading-7 text-text-secondary">{f.a}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/faq" className="text-sm font-bold text-primary hover:underline">
            مشاهده همه سوالات
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingCta() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[var(--radius)] border border-primary/20 bg-primary px-8 py-12 text-center text-white shadow-[var(--shadow)]">
        <h2 className="mb-3 text-2xl font-bold">آماده‌اید شروع کنید؟</h2>
        <p className="mb-8 text-sm leading-7 text-white/90">
          آزمون تیپ را بدون ورود آغاز کنید، یا با موبایل وارد شوید و مسیر کامل را
          ادامه دهید.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/personality">
            <Button className="!bg-white !text-primary hover:!bg-neutral" size="lg">
              شروع آزمون رایگان
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button
              variant="outline"
              size="lg"
              className="!border-white/50 !text-white hover:!bg-white/10"
            >
              ورود به حساب
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return <SiteFooter />;
}
