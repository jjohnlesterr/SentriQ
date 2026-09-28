import { ClipboardList, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  onAddQuestion?: () => void;
};

export default function EmptyQuestionState({ onAddQuestion }: Props) {
  return (
    <Card className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-line bg-white/[0.03] p-6 text-center md:min-h-[420px] md:p-10">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300 md:h-20 md:w-20">
          <ClipboardList className="h-8 w-8 md:h-10 md:w-10" />
        </div>

        <h2 className="text-lg font-bold text-white md:text-xl">
          No questions yet
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Add your first question to start building this quiz.
        </p>

        {onAddQuestion && (
          <Button
            type="button"
            onClick={onAddQuestion}
            className="mx-auto mt-6 h-11 rounded-xl px-6"
          >
            <Plus className="h-4 w-4" />
            Add First Question
          </Button>
        )}
      </div>
    </Card>
  );
}