import AppLogo from "@/components/shared/AppLogo";

export default function LoginTransitionLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Preparing your dashboard"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-canvas px-6"
    >
      <div className="flex w-full max-w-[220px] flex-col items-center text-center">
        <AppLogo className="text-2xl" />

        <div className="mt-6 h-0.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <div className="sentriq-loading-bar h-full w-1/2 rounded-full bg-cyan-400" />
        </div>

        <p className="mt-4 text-sm text-slate-500">Preparing your dashboard…</p>
      </div>
    </div>
  );
}
