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
    <section id="how-it-works" className="scroll-mt-24 border-t border-line py-20 md:py-24">
      <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
        How it works
      </h2>

      <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t border-line-strong pt-5">
            <span className="text-sm font-medium tabular-nums text-cyan-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-medium text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
