import GradientBackground from "@/components/layout/GradientBackground";

type Props = {
  children: React.ReactNode;
};

export default function PageShell({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060816] text-white">
      <GradientBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}