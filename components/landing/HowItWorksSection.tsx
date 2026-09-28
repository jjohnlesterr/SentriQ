const steps = [
  {
    title: "Create and publish",
    description:
      "Write your questions, set a time limit if you need one, and publish to get a quiz code.",
  },
  {
    title: "Share the code",
    description:
      "Students enter their name and the code, then wait for you to approve them.",
  },
  {
    title: "Monitor live",
    description:
      "Follow each session as it happens and step in when something looks off.",
  },
  {
    title: "Review and release",
    description:
      "Check scores and timelines, then decide what each student gets to see.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-16 md:py-20">
      <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">How it works</h2>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-lg border border-line bg-surface p-5">
            <span className="text-xs font-medium tabular-nums text-cyan-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-medium text-slate-100">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-400">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
