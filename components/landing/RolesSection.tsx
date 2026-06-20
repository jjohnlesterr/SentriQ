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
      className="relative overflow-hidden py-14 md:py-16"
    >
      <div className="w-full">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Who Uses SentriQ?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            SentriQ is built for educators and learners, providing the right
            tools for a secure and seamless assessment experience.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:gap-6">
          {/* TEACHERS */}
          <article className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/[0.025] p-4 backdrop-blur-xl sm:p-5 lg:p-6">
            {/* Mobile / Tablet background image */}
            <Image
              src="/result-mascot.png"
              alt=""
              width={420}
              height={420}
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                bottom-[-55px]
                right-[-70px]
                w-[190px]
                opacity-5
                select-none
                sm:w-[230px]
                lg:hidden
              "
            />

            <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Desktop image */}
              <div className="relative hidden justify-center lg:flex">
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
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 sm:h-10 sm:w-10 lg:h-11 lg:w-11">
                    <UserRound className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>

                  <h3 className="text-base font-bold text-white sm:text-xl lg:text-2xl">
                    For Teachers
                  </h3>
                </div>

                <p className="text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">
                  Create, manage, and monitor assessments from a single
                  dashboard. Track activity in real time and review results with
                  confidence.
                </p>

                <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
                  {educatorItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2.5 text-xs leading-5 text-slate-300 sm:gap-3 sm:text-sm"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 sm:h-8 sm:w-8">
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </span>

                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>

          {/* STUDENTS */}
          <article className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-white/[0.025] p-4 backdrop-blur-xl sm:p-5 lg:p-6">
            {/* Mobile / Tablet background image */}
            <Image
              src="/quiz-mascot.png"
              alt=""
              width={420}
              height={420}
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                bottom-[-55px]
                right-[-70px]
                w-[190px]
                opacity-5
                select-none
                sm:w-[230px]
                lg:hidden
              "
            />

            <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Desktop image */}
              <div className="relative hidden justify-center lg:flex">
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
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-400/10 text-violet-300 sm:h-10 sm:w-10 lg:h-11 lg:w-11">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>

                  <h3 className="text-base font-bold text-white sm:text-xl lg:text-2xl">
                    For Students
                  </h3>
                </div>

                <p className="text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">
                  Join assessments quickly using secure quiz codes and complete
                  quizzes through a simple, distraction-free interface.
                </p>

                <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
                  {learnerItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2.5 text-xs leading-5 text-slate-300 sm:gap-3 sm:text-sm"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300 sm:h-8 sm:w-8">
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </span>

                        <span>{item.label}</span>
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