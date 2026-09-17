import {
  LandingCta,
  LandingFaqPreview,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingHowItWorks,
  LandingJourneys,
  LandingManifesto,
} from "@/components/landing/LandingSections";

export default function HomePage() {
  return (
    <div className="page-shell soft-glow flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingHowItWorks />
        <LandingJourneys />
        <LandingManifesto />
        <LandingFaqPreview />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
