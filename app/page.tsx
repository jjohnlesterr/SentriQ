import PageShell from "@/components/layout/PageShell";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import LandingHero from "@/components/landing/LandingHero";
import LandingStats from "@/components/landing/LandingStats";
import RolesSection from "@/components/landing/RolesSection";

export default function LandingPage() {
  return (
    <PageShell>
      <div className="min-h-screen">

        <section className="flex h-screen flex-col overflow-hidden">
          <SiteHeader />

          <main className="relative flex-1 overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="pointer-events-none absolute right-16 top-28 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative mx-auto h-full w-full max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16">
              <LandingHero />
            </div>
          </main>
        </section>

        <LandingStats />

        <main className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:px-10 lg:px-16">

          <div className="space-y-12 md:space-y-14 lg:space-y-16">

            <FeaturesSection />
            <HowItWorksSection />
            <RolesSection />

          </div>

        </main>

        <SiteFooter />

      </div>
    </PageShell>
  );
}