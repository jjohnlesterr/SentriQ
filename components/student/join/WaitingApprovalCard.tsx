import { Clock3, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  studentName: string;
  quizCode: string;
  onCancel: () => void;
};

export default function WaitingApprovalCard({
  studentName,
  quizCode,
  onCancel,
}: Props) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
        <Clock3 className="h-8 w-8 animate-pulse" />
      </div>

      <h1 className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
        Waiting for Approval
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        Your request has been sent. Please wait for your teacher to approve your
        entry.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Student
        </p>

        <p className="mt-1 font-semibold text-white">{studentName}</p>

        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
          Quiz Code
        </p>

        <p className="mt-1 font-mono font-semibold text-cyan-200">
          {quizCode}
        </p>
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        className="mt-6 h-11 w-full border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
      >
        <XCircle className="h-4 w-4" />
        Cancel Request
      </Button>
    </div>
  );
}