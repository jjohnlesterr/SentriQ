type Props = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function PageTitle({ eyebrow, title, description }: Props) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          {eyebrow}
        </p>
      )}

      <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl">
        {title}
      </h1>

      <p className="mt-4 text-sm leading-7 text-slate-300 md:text-lg">
        {description}
      </p>
    </div>
  );
}