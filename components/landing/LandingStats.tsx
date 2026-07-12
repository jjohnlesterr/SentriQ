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
    <section className="relative mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-10 lg:px-16">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/[0.02] backdrop-blur-xl">
        <div
          className="
          flex gap-3 overflow-x-auto px-3 py-4
          md:grid md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10
        "
        >
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="
                  relative
                  flex-shrink-0
                  min-w-[240px]
                  md:min-w-0

                  flex items-center justify-center gap-2
                  px-3 py-3
                "
              >
                {index < stats.length - 1 && (
                  <div className="absolute right-0 top-1/2 h-10 w-px -translate-y-1/2 bg-white/10 md:hidden" />
                )}

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-cyan-300 md:h-10 md:w-10">
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>

                <div className="leading-tight">
                  <div className="text-xl md:text-2xl font-extrabold text-white">
                    {item.value}
                  </div>

                  <p className="text-xs md:text-sm text-slate-400">
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
