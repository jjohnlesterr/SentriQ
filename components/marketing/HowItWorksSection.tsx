import {
  ClipboardList,
  KeyRound,
  MonitorCheck,
  ShieldCheck,
} from "lucide-react";

import { GlassCard } from "@/components/shared/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";

const steps = [
  {
    title: "Create Quiz",
    description:
      "Teachers create assessments, add questions, and prepare quizzes for publishing.",
    icon: ClipboardList,
  },
  {
    title: "Share Quiz Code",
    description:
      "SentriQ generates a unique quiz code that students can use to request access.",
    icon: KeyRound,
  },
  {
    title: "Monitor Session",
    description:
      "Teachers track active quiz sessions and observe assessment activity in real time.",
    icon: MonitorCheck,
  },
  {
    title: "Review Results",
    description:
      "After the quiz, teachers review attempts, scores, and monitoring activity.",
    icon: ShieldCheck,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative">
      <SectionHeading
        badge="How It Works"
        title="From quiz creation to review in four simple steps"
        description="SentriQ keeps the assessment workflow simple, secure, and easy to manage."
        variant="section"
        align="center"
        className="mx-auto mb-12 max-w-3xl"
        titleClassName="text-3xl md:text-5xl"
      />

      <div className="mx-auto max-w-3xl space-y-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const stepNumber = String(index + 1).padStart(2, "0");

          return (
            <div key={step.title} className="relative">
              <span className="pointer-events-none absolute -left-16 top-1/2 hidden -translate-y-1/2 text-6xl font-bold text-cyan-500/10 lg:block">
                {stepNumber}
              </span>

              <GlassCard className="group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.07] md:p-7">
                <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl transition-all duration-300 group-hover:bg-cyan-400/20" />

                <div className="relative z-10 flex items-center justify-between gap-5">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/70 md:hidden">
                      Step {stepNumber}
                    </p>

                    <h3 className="text-lg font-semibold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                      {step.description}
                    </p>
                  </div>

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 shadow-lg shadow-cyan-950/20">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}