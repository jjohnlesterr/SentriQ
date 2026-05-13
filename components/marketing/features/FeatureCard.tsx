import type { LucideIcon } from "lucide-react";

import { GlassCard } from "@/components/shared/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function FeatureCard({ icon: Icon, title, description }: Props) {
  return (
    <GlassCard className="p-6">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
        <Icon className="h-6 w-6" />
      </div>

      <SectionHeading
        title={title}
        description={description}
        variant="card"
        descriptionClassName="mt-3 text-sm leading-6 text-slate-300 md:text-sm"
      />
    </GlassCard>
  );
}