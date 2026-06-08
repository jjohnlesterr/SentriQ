import { Code2, GraduationCap, ShieldCheck } from "lucide-react";

import { GlassCard } from "@/components/shared/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";

const cards = [
  {
    icon: ShieldCheck,
    title: "Purpose",
    description:
      "SentriQ helps reduce cheating, improve assessment control, and provide teachers with better monitoring tools during online examinations.",
    className: "text-cyan-300",
  },
  {
    icon: GraduationCap,
    title: "Target Users",
    description:
      "Designed for schools, educators, and students who require a secure and focused digital assessment experience.",
    className: "text-violet-300",
  },
  {
    icon: Code2,
    title: "Developer",
    description:
      "Developed by John Lester Tan as a modern platform for quiz monitoring, assessment management, and academic integrity.",
    className: "text-blue-300",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="space-y-5">
      <SectionHeading
        badge="About SentriQ"
        title="Built for fair and focused assessments"
        description="SentriQ is a digital assessment and monitoring platform designed to help teachers create, manage, and monitor online quizzes in a secure environment."
        variant="page"
        align="center"
        className="mx-auto max-w-3xl"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <GlassCard key={card.title} className="p-6">
              <Icon className={`mb-5 h-8 w-8 ${card.className}`} />

              <SectionHeading
                title={card.title}
                description={card.description}
                variant="card"
                descriptionClassName="mt-3 text-sm leading-6 text-slate-300"
              />
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="p-6 md:p-8">
        <SectionHeading
          title="Technology Stack"
          description="SentriQ is powered by Next.js and Supabase, providing secure authentication, PostgreSQL database management, and scalable real-time functionality."
          variant="card"
        />
      </GlassCard>
    </section>
  );
}