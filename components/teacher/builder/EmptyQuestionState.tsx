import { CircleHelp, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  onAddQuestion: () => void;
};

export default function EmptyQuestionState({ onAddQuestion }: Props) {
  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-12">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300 md:h-16 md:w-16">
        <CircleHelp className="h-7 w-7 md:h-8 md:w-8" />
      </div>

      <p className="mb-5 text-sm text-slate-300 md:text-base">
        No questions yet
      </p>

      <Button
        type="button"
        onClick={onAddQuestion}
        className="h-11 w-full cursor-pointer bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Add First Question
      </Button>
    </Card>
  );
}