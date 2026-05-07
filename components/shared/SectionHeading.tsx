type Props = {
  badge?: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  badge,
  title,
  description,
}: Props) {
  return (
    <div className="text-center">
      {badge && (
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
          {badge}
        </div>
      )}

      <h2 className="text-4xl font-bold tracking-tight">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          {description}
        </p>
      )}
    </div>
  );
}