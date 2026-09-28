import { Check } from "lucide-react";

import OpenAuthModalButton from "@/components/landing/OpenAuthModalButton";

const roles = [
  {
    title: "For teachers",
    description: "Create, run and review assessments from one dashboard.",
    items: [
      "Build and publish quizzes",
      "Approve students before they start",
      "Monitor sessions in real time",
      "Review scores and activity timelines",
    ],
    cta: { label: "Create a teacher account", modal: "signup" as const, variant: "primary" as const },
  },
  {
    title: "For students",
    description: "No account needed. Join with the code your teacher gives you.",
    items: [
      "Join with a name and quiz code",
      "One question at a time, distraction-free",
      "Answers save as you go",
      "See your results once they are released",
    ],
    cta: { label: "Enter a quiz code", modal: "quiz" as const, variant: "ghost" as const },
  },
];

export default function RolesSection() {
  return (
    <section id="roles" className="scroll-mt-24 py-16 md:py-20">
      <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Built for both sides of the quiz
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <div
            key={role.title}
            className="flex flex-col rounded-lg border border-line bg-surface p-6 md:p-7"
          >
            <h3 className="text-lg font-medium text-slate-100">{role.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-400">{role.description}</p>

            <ul className="mt-5 space-y-2.5">
              {role.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <OpenAuthModalButton
                modal={role.cta.modal}
                variant={role.cta.variant}
                className="w-full sm:w-auto"
              >
                {role.cta.label}
              </OpenAuthModalButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
