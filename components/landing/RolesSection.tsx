import { Check } from "lucide-react";

import OpenAuthModalButton from "@/components/landing/OpenAuthModalButton";

const roles = [
  {
    title: "For teachers",
    description:
      "Create, run and review assessments from one dashboard.",
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
    description:
      "No account needed — join with the code your teacher gives you.",
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
    <section id="roles" className="scroll-mt-24 border-t border-line py-20 md:py-24">
      <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        Built for both sides of the quiz
      </h2>

      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-0 md:divide-x md:divide-line">
        {roles.map((role, index) => (
          <div key={role.title} className={index === 0 ? "md:pr-12" : "md:pl-12"}>
            <h3 className="text-lg font-medium text-white">{role.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{role.description}</p>

            <ul className="mt-6 space-y-3">
              {role.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <OpenAuthModalButton
              modal={role.cta.modal}
              variant={role.cta.variant}
              className="mt-8"
            >
              {role.cta.label}
            </OpenAuthModalButton>
          </div>
        ))}
      </div>
    </section>
  );
}
