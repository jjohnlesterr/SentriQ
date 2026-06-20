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

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-14 md:py-16"
    >
      <div className="w-full">

        {/* HEADER */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            How SentriQ Works
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-300 md:text-lg">
            From quiz setup to performance review, SentriQ keeps the assessment
            process simple, secure, and organized.
          </p>
        </div>

        {/* GRID */}
        <div className="mt-12 grid gap-5 grid-cols-2 lg:grid-cols-4">

          {steps.map((step, index) => {
            const Icon = step.icon;
            const stepNumber = String(index + 1).padStart(2, "0");
            const color = step.color as keyof typeof iconStyles;

            return (
              <article key={step.title} className="relative">

                {/* NUMBER */}
                <div className="mb-5 flex justify-center">
                  <div
                    className={`
                      flex
                      h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16
                      items-center justify-center
                      rounded-full border
                      text-sm sm:text-base lg:text-2xl
                      font-extrabold
                      ${numberStyles[color]}
                    `}
                  >
                    {stepNumber}
                  </div>
                </div>

                {/* CARD */}
                <div className="
                  rounded-2xl border border-white/10
                  bg-white/[0.025]
                  p-4 sm:p-5 lg:p-6
                  backdrop-blur-xl
                  transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]
                ">
                  {/* ICON */}
                  <div
                    className={`
                      mb-4 flex
                      h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14
                      items-center justify-center
                      rounded-2xl border
                      ${iconStyles[color]}
                    `}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                  </div>

                  {/* TITLE */}
                  <h3 className="text-sm sm:text-base lg:text-xl font-bold text-white">
                    {step.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-300">
                    {step.description}
                  </p>

                </div>

              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}