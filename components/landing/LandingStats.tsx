import { FileText, GraduationCap, UsersRound } from "lucide-react";

const stats = [
  {
    icon: FileText,
    value: "500+",
    label: "Quizzes Created",
  },
  {
    icon: UsersRound,
    value: "100+",
    label: "Teachers Registered",
  },
  {
    icon: GraduationCap,
    value: "2,500+",
    label: "Students Assessed",
  },
];

export default function LandingStats() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 md:px-10 lg:px-16">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/[0.02] px-6 py-8 backdrop-blur-xl">
        <div className="relative grid gap-6 md:grid-cols-3">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="relative flex items-center gap-4 md:justify-center"
              >
                {index > 0 && (
                  <div className="absolute left-0 hidden h-16 w-px bg-white/10 md:block" />
                )}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-300">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <div className="text-3xl font-extrabold leading-none text-white sm:text-4xl">
                    {item.value}
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-400">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}