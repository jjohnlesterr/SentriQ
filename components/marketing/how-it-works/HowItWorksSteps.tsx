import {
  ClipboardList,
  KeyRound,
  MonitorCheck,
  ShieldCheck,
} from "lucide-react";

import StepCard from "@/components/marketing/how-it-works/StepCard";
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

export default function HowItWorksSteps() {
  return (
    <>
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
          <StepCard key={step.title} index={index} {...step} />
        ))}
      </div>
    </>
  );
}