import { ClipboardList, Eye, KeyRound, MonitorCheck } from "lucide-react";

const steps = [
  {
    title: "Create & Publish Quiz",
    description:
      "Create questions, configure settings, and publish assessments in minutes.",
    icon: ClipboardList,
    color: "cyan",
  },
  {
    title: "Share Quiz Access",
    description:
      "Students enter a quiz code and request access to join the assessment.",
    icon: KeyRound,
    color: "blue",
  },
  {
    title: "Monitor Activity",
    description:
      "Track active sessions and student participation through a live dashboard.",
    icon: Eye,
    color: "violet",
  },
  {
    title: "Review Performance",
    description:
      "Analyze results, attempts, and assessment records after completion.",
    icon: MonitorCheck,
    color: "purple",
  },
];

const iconStyles = {
  cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
  blue: "border-blue-400/25 bg-blue-400/10 text-blue-300",
  violet: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  purple: "border-purple-400/25 bg-purple-400/10 text-purple-300",
};

const numberStyles = {
  cyan: "border-cyan-400 text-cyan-300",
  blue: "border-blue-400 text-blue-300",
  violet: "border-violet-400 text-violet-300",
  purple: "border-purple-400 text-purple-300",
};

const lineStyles = {
  cyan: "bg-cyan-400",
  blue: "bg-blue-400",
  violet: "bg-violet-400",
  purple: "bg-purple-400",
};

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative flex min-h-screen items-center overflow-hidden py-10"
    >
      <div className="w-full">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            How SentriQ Works
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            From quiz setup to performance review, SentriQ keeps the assessment
            process simple, secure, and organized.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const stepNumber = String(index + 1).padStart(2, "0");
            const color = step.color as keyof typeof iconStyles;

            return (
              <article key={step.title} className="relative">
                {/* Number */}
                <div className="relative mb-7 flex justify-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full border text-2xl font-extrabold ${
                      numberStyles[color]
                    }`}
                  >
                    {stepNumber}
                  </div>

                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 top-8 hidden w-full lg:block">
                      <div className="ml-10 h-px border-t border-dashed border-white/20" />
                    </div>
                  )}
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border ${
                      iconStyles[color]
                    }`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {step.description}
                  </p>

                  <div
                    className={`mt-6 h-1 w-14 rounded-full ${lineStyles[color]}`}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}