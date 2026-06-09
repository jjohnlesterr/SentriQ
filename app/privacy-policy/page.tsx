"use client";

import { useRouter } from "next/navigation";
import MarketingPageShell from "@/components/layout/MarketingPageShell";
import { GlassCard } from "@/components/shared/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <MarketingPageShell>
      <div className="mx-auto mb-6 max-w-3xl">
        <button
          onClick={() => router.back()}
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back
        </button>
      </div>

      <GlassCard className="mx-auto max-w-3xl p-8 text-center">
        <SectionHeading
          badge="🚧 Privacy Policy"
          title="Work in Progress"
          description="We're currently working on our Privacy Policy page. Please check back later for updates."
          variant="page"
          align="center"
        />
      </GlassCard>
    </MarketingPageShell>
  );
}