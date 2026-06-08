import PageShell from "@/components/layout/PageShell";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

import LandingHero from "@/components/landing/LandingHero";
import AboutSection from "@/components/marketing/AboutSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";

export default function LandingPage() {
  return (
    <PageShell>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />

        <main className="relative flex-1 overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute right-16 top-28 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16">
            <LandingHero />
          </div>

          <div className="relative mx-auto w-full max-w-7xl space-y-24 px-4 pb-24 sm:px-6 md:px-10 lg:px-16">
            <FeaturesSection />
            <HowItWorksSection />
            <AboutSection />
          </div>
        </main>

        <SiteFooter />
      </div>
    </PageShell>
  );
}