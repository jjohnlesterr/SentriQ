import { ClipboardList } from "lucide-react";

import { Card } from "@/components/ui/card";

export default function EmptyQuestionState() {
  return (
    <Card className="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:min-h-[420px] md:p-10">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-violet-300 md:h-20 md:w-20">
          <ClipboardList className="h-8 w-8 md:h-10 md:w-10" />
        </div>

        <h2 className="text-lg font-bold text-white md:text-xl">
          No questions yet
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Add your first question to start building this quiz.
        </p>
      </div>
    </Card>
  );
}