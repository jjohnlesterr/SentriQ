import { Loader2 } from "lucide-react";

export default function WaitingApprovalState() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div role="status" aria-live="polite" className="w-full max-w-sm rounded-xl border border-line bg-surface p-8 text-center">
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-cyan-300" />

        <h1 className="mt-4 text-lg font-semibold tracking-tight text-white">
          Waiting for approval
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Your teacher hasn&apos;t let you in yet. This page updates on its own.
        </p>
      </div>
    </div>
  );
}
