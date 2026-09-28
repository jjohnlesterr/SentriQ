type Props = {
  children: React.ReactNode;
};

export default function PageShell({ children }: Props) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-slate-200">
      {children}
    </div>
  );
}
