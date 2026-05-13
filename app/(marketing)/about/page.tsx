import MarketingPageShell from "@/components/layout/MarketingPageShell";
import AboutHero from "@/components/marketing/about/AboutHero";
import AboutMission from "@/components/marketing/about/AboutMission";

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <AboutHero />
      <AboutMission />
    </MarketingPageShell>
  );
}