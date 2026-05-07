export default function GradientBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_40%)]" />

      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
    </>
  );
}