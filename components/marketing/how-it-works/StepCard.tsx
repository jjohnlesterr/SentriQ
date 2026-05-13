import type { LucideIcon } from "lucide-react";

import { GlassCard } from "@/components/shared/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
};

export default function StepCard({ icon: Icon, title, description, index }: Props) {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
          <Icon className="h-6 w-6" />
        </div>

        <span className="text-sm font-semibold text-slate-500">
          Step {index + 1}
        </span>
      </div>

      <SectionHeading
        title={title}
        description={description}
        variant="card"
        descriptionClassName="mt-3 text-sm leading-7 text-slate-300 md:text-sm"
      />
    </GlassCard>
  );
}