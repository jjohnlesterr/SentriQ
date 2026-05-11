import {
  BarChart3,
  Eye,
  FileCheck2,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";

import MarketingPageShell from "@/components/layout/MarketingPageShell";
import { GlassCard } from "@/components/shared/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";

const features = [
  {
    icon: ShieldCheck,
    title: "Academic Integrity Monitoring",
    description:
      "Support fair assessments by monitoring suspicious activity during online quizzes.",
  },
  {
    icon: Eye,
    title: "Real-time Teacher Dashboard",
    description:
      "View student activity, quiz progress, and monitoring signals from a focused control center.",
  },
  {
    icon: Lock,
    title: "Secure Quiz Access",
    description:
      "Students request access using quiz codes, helping teachers control who can enter an assessment.",
  },
  {
    icon: FileCheck2,
    title: "Quiz Management",
    description:
      "Create, edit, publish, and manage digital assessments in a streamlined workflow.",
  },
  {
    icon: BarChart3,
    title: "Reports & Review",
    description:
      "Review student performance, scores, and activity history after each assessment.",
  },
  {
    icon: Users,
    title: "Built for Schools",
    description:
      "Designed for teachers, students, and academic institutions moving toward digital assessments.",
  },
];

export default function FeaturesPage() {
  return (
    <MarketingPageShell>
      <SectionHeading
        badge="Features"
        title="Tools for secure digital assessments"
        description="SentriQ provides teachers and schools with a modern way to manage quizzes, monitor student activity, and support academic integrity."
        variant="page"
        align="center"
        className="mx-auto mb-10 max-w-3xl md:mb-14"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <GlassCard key={feature.title} className="p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
              <feature.icon className="h-6 w-6" />
            </div>

            <SectionHeading
              title={feature.title}
              description={feature.description}
              variant="card"
              descriptionClassName="mt-3 text-sm leading-6 text-slate-300 md:text-sm"
            />
          </GlassCard>
        ))}
      </div>
    </MarketingPageShell>
  );
}
