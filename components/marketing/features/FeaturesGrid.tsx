import {
  BarChart3,
  Eye,
  FileCheck2,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";

import FeatureCard from "@/components/marketing/features/FeatureCard";
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

export default function FeaturesGrid() {
  return (
    <>
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
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </>
  );
}