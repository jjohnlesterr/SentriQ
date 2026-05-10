import {
  BarChart3,
  Eye,
  FileCheck2,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";

import MarketingPageShell from "@/components/layout/MarketingPageShell";
import PageTitle from "@/components/marketing/PageTitle";
import { Card } from "@/components/ui/card";

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
      <PageTitle
        eyebrow="Features"
        title="Tools for secure digital assessments"
        description="SentriQ provides teachers and schools with a modern way to manage quizzes, monitor student activity, and support academic integrity."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
              <feature.icon className="h-6 w-6" />
            </div>

            <h2 className="text-xl font-bold text-white">{feature.title}</h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </MarketingPageShell>
  );
}