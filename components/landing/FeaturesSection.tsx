import Image from "next/image";
import {
  AlertTriangle,
  BarChart3,
  ClipboardPenLine,
  GraduationCap,
  Lock,
  MonitorCheck,
} from "lucide-react";

const features = [
  {
    icon: MonitorCheck,
    title: "Live Monitoring",
    description: "Track student activity and quiz sessions from one dashboard.",
    color: "cyan",
  },
  {
    icon: AlertTriangle,
    title: "Activity Alerts",
    description:
      "Flag suspicious actions that may affect assessment integrity.",
    color: "rose",
  },
  {
    icon: Lock,
    title: "Secure Access",
    description: "Control quiz entry using codes and approval workflows.",
    color: "emerald",
  },
  {
    icon: ClipboardPenLine,
    title: "Quiz Management",
    description: "Create, edit, publish, and manage quizzes easily.",
    color: "violet",
  },
  {
    icon: BarChart3,
    title: "Reports",
    description: "Review attempts, results, and performance history.",
    color: "blue",
  },
  {
    icon: GraduationCap,
    title: "School Ready",
    description: "Built for teachers, students, and institutions.",
    color: "amber",
  },
];

const iconStyles = {
  cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
  rose: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  violet: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  blue: "border-blue-400/25 bg-blue-400/10 text-blue-300",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
};

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative flex min-h-screen items-center overflow-hidden py-8"
    >
      {/* ================= MOBILE + TABLET ROBOT (ONLY) ================= */}
      <Image
        src="/monitoring-mascot.png"
        alt="SentriQ mascot background mobile"
        width={600}
        height={600}
        aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[-40px]
            bottom-[-70px]
            w-[340px]
            opacity-40
            select-none
            lg:hidden
          "
      />

      <div className="relative grid w-full items-center gap-8 lg:grid-cols-[0.82fr_1.18fr]">

        {/* ================= DESKTOP ROBOT (UNCHANGED) ================= */}
        <div className="relative hidden justify-center lg:flex">
          <Image
            src="/monitoring-mascot.png"
            alt="SentriQ monitoring mascot"
            width={500}
            height={500}
            className="h-auto w-full max-w-[430px]"
          />
        </div>

        {/* CONTENT */}
        <div>
          <h2 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-5xl">
            Built for modern digital assessments
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Purpose-built tools that help teachers create, monitor, and manage
            quizzes with confidence.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                        iconStyles[feature.color as keyof typeof iconStyles]
                      }`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold leading-tight text-white">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}