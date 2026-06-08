import {
  BarChart3,
  Eye,
  FileCheck2,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";

import { GlassCard } from "@/components/shared/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";

const features = [
  {
    icon: ShieldCheck,
    title: "Academic Integrity Monitoring",
    description:
      "Monitor assessment activity and help maintain fair online examinations.",
  },
  {
    icon: Eye,
    title: "Real-Time Monitoring",
    description:
      "Track student activity and quiz sessions through a centralized dashboard.",
  },
  {
    icon: Lock,
    title: "Secure Quiz Access",
    description:
      "Control assessment entry using unique quiz codes and approval workflows.",
  },
  {
    icon: FileCheck2,
    title: "Quiz Management",
    description:
      "Create, edit, publish, and manage assessments from one platform.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description:
      "Review performance, attempts, and assessment history efficiently.",
  },
  {
    icon: Users,
    title: "Built for Schools",
    description:
      "Designed specifically for teachers, students, and educational institutions.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features">
      <SectionHeading
        badge="Features"
        title="Tools for secure digital assessments"
        description="Everything teachers need to create quizzes, monitor activity, and manage assessments."
        variant="page"
        align="center"
        className="mx-auto mb-12 max-w-3xl"
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <GlassCard key={feature.title} className="p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                <Icon className="h-6 w-6" />
              </div>

              <SectionHeading
                title={feature.title}
                description={feature.description}
                variant="card"
                descriptionClassName="mt-3 text-sm leading-6 text-slate-300"
              />
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}