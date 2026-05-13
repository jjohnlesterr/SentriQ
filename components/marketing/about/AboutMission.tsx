import { Code2, GraduationCap, ShieldCheck } from "lucide-react";

import { GlassCard } from "@/components/shared/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";

const cards = [
  {
    icon: ShieldCheck,
    title: "Purpose",
    description:
      "SentriQ aims to reduce cheating, improve assessment control, and help teachers monitor online quizzes more effectively.",
    className: "text-cyan-300",
  },
  {
    icon: GraduationCap,
    title: "Target Users",
    description:
      "The platform is designed for schools, teachers, and students who need a focused and secure digital assessment experience.",
    className: "text-violet-300",
  },
  {
    icon: Code2,
    title: "Developer",
    description:
      "Developed by John Lester Tan, a BSIT student building SentriQ as a modern platform for quiz monitoring and academic integrity.",
    className: "text-blue-300",
  },
];

export default function AboutMission() {
  return (
    <>
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
                descriptionClassName="mt-3 text-sm leading-6 text-slate-300 md:text-sm"
              />
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="mt-5 p-6 md:p-8">
        <SectionHeading
          title="Technology Direction"
          description="SentriQ is currently being developed with Next.js for the interface and will use Supabase for authentication, database, and real-time features as the platform grows."
          variant="card"
        />
      </GlassCard>
    </>
  );
}