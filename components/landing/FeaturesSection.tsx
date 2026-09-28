import {
  BarChart3,
  ClipboardPenLine,
  Eye,
  KeyRound,
  ShieldAlert,
  Timer,
} from "lucide-react";

const features = [
  {
    icon: ClipboardPenLine,
    title: "Quiz builder",
    description:
      "Multiple choice, true/false and identification questions, with optional hints and a time limit.",
  },
  {
    icon: KeyRound,
    title: "Controlled entry",
    description:
      "Students join with a code and wait for your approval. Lock joining once the class is in.",
  },
  {
    icon: Eye,
    title: "Live monitoring",
    description:
      "See who is answering, how far along they are, and who has gone idle, updated in real time.",
  },
  {
    icon: ShieldAlert,
    title: "Integrity signals",
    description:
      "Tab switches, fullscreen exits, copy and paste attempts are recorded on each student's timeline.",
  },
  {
    icon: Timer,
    title: "Timed sessions",
    description:
      "When time runs out, answers are saved and the attempt is closed automatically.",
  },
  {
    icon: BarChart3,
    title: "Results you control",
    description:
      "Release scores or full answer reviews to students only when you are ready.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 py-16 md:py-20">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Everything a teacher needs to run a fair quiz
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-400">
          SentriQ covers the whole assessment, from writing questions to
          reviewing each attempt afterwards.
        </p>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <li key={feature.title} className="rounded-lg border border-line bg-surface p-5">
              <Icon className="h-5 w-5 text-cyan-300" aria-hidden="true" />
              <h3 className="mt-3 font-medium text-slate-100">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-400">{feature.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
