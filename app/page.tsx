"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageShell from "@/components/layout/PageShell";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

import LandingHero from "@/components/landing/LandingHero";
import LandingDesktopPortals from "@/components/landing/LandingDesktopPortals";
import LandingMobilePortals from "@/components/landing/LandingMobilePortals";
import LandingMobileCards from "@/components/landing/LandingMobileCards";

export default function LandingPage() {
  const router = useRouter();

  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);

  function handleNavigate(key: string, href: string) {
    setLoadingTarget(key);
    router.push(href);
  }

  return (
    <PageShell>
      <div className="flex min-h-[100svh] flex-col">
        <SiteHeader />

        <main className="relative flex flex-1 overflow-hidden">
          <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="pointer-events-none absolute right-16 top-36 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

          <section className="relative mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-9 md:px-10 md:py-10 lg:px-16 lg:py-12">
            <div className="flex w-full flex-col justify-center">
              <LandingHero />

              <LandingMobilePortals
                loadingTarget={loadingTarget}
                onNavigate={handleNavigate}
              />

              <LandingDesktopPortals
                loadingTarget={loadingTarget}
                onNavigate={handleNavigate}
              />

              <LandingMobileCards />
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </PageShell>
  );
}