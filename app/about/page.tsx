import { Code2, GraduationCap, ShieldCheck } from "lucide-react";

import MarketingPageShell from "@/components/layout/MarketingPageShell";
import { GlassCard } from "@/components/shared/GlassCard";
import SectionHeading from "@/components/shared/SectionHeading";

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <SectionHeading
        badge="About SentriQ"
        title="Built for fair and focused assessments"
        description="SentriQ is a digital assessment and monitoring platform designed to help schools, teachers, and students create a more secure online examination environment."
        variant="page"
        align="center"
        className="mx-auto mb-10 max-w-3xl md:mb-14"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="p-6">
          <ShieldCheck className="mb-5 h-8 w-8 text-cyan-300" />

          <SectionHeading
            title="Purpose"
            description="SentriQ aims to reduce cheating, improve assessment control, and help teachers monitor online quizzes more effectively."
            variant="card"
            descriptionClassName="mt-3 text-sm leading-6 text-slate-300 md:text-sm"
          />
        </GlassCard>

        <GlassCard className="p-6">
          <GraduationCap className="mb-5 h-8 w-8 text-violet-300" />

          <SectionHeading
            title="Target Users"
            description="The platform is designed for schools, teachers, and students who need a focused and secure digital assessment experience."
            variant="card"
            descriptionClassName="mt-3 text-sm leading-6 text-slate-300 md:text-sm"
          />
        </GlassCard>

        <GlassCard className="p-6">
          <Code2 className="mb-5 h-8 w-8 text-blue-300" />

          <SectionHeading
            title="Developer"
            description="Developed by John Lester Tan, a BSIT student building SentriQ as a modern platform for quiz monitoring and academic integrity."
            variant="card"
            descriptionClassName="mt-3 text-sm leading-6 text-slate-300 md:text-sm"
          />
        </GlassCard>
      </div>

      <GlassCard className="mt-5 p-6 md:p-8">
        <SectionHeading
          title="Technology Direction"
          description="SentriQ is currently being developed with Next.js for the interface and will use Supabase for authentication, database, and real-time features as the platform grows."
          variant="card"
        />
      </GlassCard>
    </MarketingPageShell>
  );
}
