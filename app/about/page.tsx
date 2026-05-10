import { Code2, GraduationCap, ShieldCheck } from "lucide-react";

import MarketingPageShell from "@/components/layout/MarketingPageShell";
import PageTitle from "@/components/marketing/PageTitle";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <PageTitle
        eyebrow="About SentriQ"
        title="Built for fair and focused assessments"
        description="SentriQ is a digital assessment and monitoring platform designed to help schools, teachers, and students create a more secure online examination environment."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <ShieldCheck className="mb-5 h-8 w-8 text-cyan-300" />
          <h2 className="text-xl font-bold text-white">Purpose</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            SentriQ aims to reduce cheating, improve assessment control, and
            help teachers monitor online quizzes more effectively.
          </p>
        </Card>

        <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <GraduationCap className="mb-5 h-8 w-8 text-violet-300" />
          <h2 className="text-xl font-bold text-white">Target Users</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The platform is designed for schools, teachers, and students who
            need a focused and secure digital assessment experience.
          </p>
        </Card>

        <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <Code2 className="mb-5 h-8 w-8 text-blue-300" />
          <h2 className="text-xl font-bold text-white">Developer</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Developed by John Lester Tan, a BSIT student building SentriQ as a
            modern platform for quiz monitoring and academic integrity.
          </p>
        </Card>
      </div>

      <Card className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <h2 className="text-2xl font-bold text-white">Technology Direction</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">
          SentriQ is currently being developed with Next.js for the interface
          and will use Supabase for authentication, database, and real-time
          features as the platform grows.
        </p>
      </Card>
    </MarketingPageShell>
  );
}