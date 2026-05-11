import {
  ClipboardList,
  KeyRound,
  MonitorCheck,
  ShieldCheck,
} from "lucide-react";

import MarketingPageShell from "@/components/layout/MarketingPageShell";
import { GlassCard } from "@/components/shared/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";

const steps = [
  {
    title: "Teacher creates a quiz",
    description:
      "Teachers can create assessments, add questions, set correct answers, and prepare the quiz for publishing.",
    icon: ClipboardList,
  },
  {
    title: "Quiz code is generated",
    description:
      "Once published, SentriQ provides a unique quiz code that students can use to request access.",
    icon: KeyRound,
  },
  {
    title: "Students take the assessment",
    description:
      "Students enter the quiz code and complete the exam in a focused digital environment.",
    icon: MonitorCheck,
  },
  {
    title: "Teacher monitors activity",
    description:
      "Teachers can monitor quiz sessions and review student activity to help protect academic integrity.",
    icon: ShieldCheck,
  },
];

export default function HowItWorksPage() {
  return (
    <MarketingPageShell>
      <SectionHeading
        badge="How It Works"
        title="A simple flow for secure digital assessments"
        description="SentriQ helps teachers create quizzes, allow students to join through a quiz code, and monitor assessment activity in one streamlined platform."
        variant="page"
        align="center"
        className="mx-auto mb-10 max-w-3xl md:mb-14"
      />

      <div className="grid gap-5 md:grid-cols-2">
        {steps.map((step, index) => (
          <GlassCard key={step.title} className="p-6 md:p-8">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                <step.icon className="h-6 w-6" />
              </div>

              <span className="text-sm font-semibold text-slate-500">
                Step {index + 1}
              </span>
            </div>

            <SectionHeading
              title={step.title}
              description={step.description}
              variant="card"
              descriptionClassName="mt-3 text-sm leading-7 text-slate-300 md:text-sm"
            />
          </GlassCard>
        ))}
      </div>
    </MarketingPageShell>
  );
}
