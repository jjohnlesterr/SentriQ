type Props = {
  children: React.ReactNode;
};

export default function PageShell({ children }: Props) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%)]" />

      <div className="absolute left-[-120px] top-[20%] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute right-[-120px] top-[10%] h-[320px] w-[320px] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}