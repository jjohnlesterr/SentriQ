import MarketingPageShell from "@/components/layout/MarketingPageShell";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import LandingHero from "@/components/landing/LandingHero";
import RolesSection from "@/components/landing/RolesSection";

export default function LandingPage() {
  return (
    <MarketingPageShell contentClassName="py-0 md:py-0">
      <LandingHero />
      <FeaturesSection />
      <HowItWorksSection />
      <RolesSection />
    </MarketingPageShell>
  );
}
