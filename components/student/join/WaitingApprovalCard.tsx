import { Loader2 } from "lucide-react";

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
    <div role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-sm font-medium text-cyan-300">
        <Loader2 className="h-4 w-4 animate-spin" />
        Waiting for approval
      </div>

      <h1 className="mt-3 text-xl font-semibold tracking-tight text-white">
        Your request has been sent
      </h1>
      <p className="mt-1.5 text-sm leading-6 text-slate-400">
        Keep this page open. The quiz starts as soon as your teacher lets you in.
      </p>

      <dl className="mt-6 divide-y divide-line rounded-lg border border-line text-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <dt className="text-slate-500">Name</dt>
          <dd className="truncate font-medium text-slate-200">{studentName}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <dt className="text-slate-500">Quiz code</dt>
          <dd className="font-mono font-medium tracking-[0.15em] text-slate-200">{quizCode}</dd>
        </div>
      </dl>

      <Button type="button" variant="ghost" onClick={onCancel} className="mt-6 w-full">
        Cancel request
      </Button>
    </div>
  );
}
