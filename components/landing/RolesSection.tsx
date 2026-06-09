import Image from "next/image";
import {
  BarChart3,
  CheckSquare,
  FilePenLine,
  GraduationCap,
  MonitorCheck,
  MousePointerClick,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const educatorItems = [
  { icon: FilePenLine, label: "Create and publish quizzes" },
  { icon: MonitorCheck, label: "Monitor live quiz sessions" },
  { icon: BarChart3, label: "Review reports and results" },
  { icon: ShieldCheck, label: "Detect suspicious activity" },
];

const learnerItems = [
  { icon: MousePointerClick, label: "Easy quiz access" },
  { icon: ShieldCheck, label: "Secure assessment entry" },
  { icon: CheckSquare, label: "Simple quiz experience" },
  { icon: Send, label: "Instant answer submission" },
];

export default function RolesSection() {
  return (
    <section
      id="roles"
      className="relative flex min-h-screen items-center overflow-hidden py-10"
    >
      <div className="w-full">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Who Uses SentriQ?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
            SentriQ is built for educators and learners, providing the right
            tools for a secure and seamless assessment experience.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/[0.025] p-6 backdrop-blur-xl">
            <div className="grid items-center gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative">
                <Image
                  src="/result-mascot.png"
                  alt="SentriQ educator mascot"
                  width={360}
                  height={360}
                  className="h-auto w-full max-w-[280px]"
                />
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    For Teachers
                  </h3>
                </div>

                <p className="text-sm leading-6 text-slate-300">
                  Create, manage, and monitor assessments from a single
                  dashboard. Track activity in real time and review results with
                  confidence.
                </p>

                <div className="mt-6 space-y-3">
                  {educatorItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 text-sm text-slate-300"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                          <Icon className="h-4 w-4" />
                        </span>
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-white/[0.025] p-6 backdrop-blur-xl">
            <div className="grid items-center gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative">
                <Image
                  src="/quiz-mascot.png"
                  alt="SentriQ learner mascot"
                  width={360}
                  height={360}
                  className="h-auto w-full max-w-[280px]"
                />
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-400/10 text-violet-300">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    For Students
                  </h3>
                </div>

                <p className="text-sm leading-6 text-slate-300">
                  Join assessments quickly using secure quiz codes and complete
                  quizzes through a simple, distraction-free interface.
                </p>

                <div className="mt-6 space-y-3">
                  {learnerItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 text-sm text-slate-300"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300">
                          <Icon className="h-4 w-4" />
                        </span>
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}