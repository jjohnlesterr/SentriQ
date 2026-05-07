type Props = {
  children: React.ReactNode;
};

export default function PageShell({ children }: Props) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.15),transparent_40%)]" />

      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}