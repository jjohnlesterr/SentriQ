import { FileText } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

export default function QuizDetailsForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="mb-5 hidden items-center gap-3 sm:flex">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
          <FileText className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white">Quiz Details</h2>
          <p className="text-sm text-slate-500">
            Set the title and student instructions.
          </p>
        </div>
      </div>

      <div className="mb-4 sm:hidden">
        <h2 className="text-base font-bold text-white">Quiz Details</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quiz-title">Quiz Title</Label>

          <Input
            id="quiz-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Chemistry Quiz"
            className="h-12 rounded-2xl border-white/10 bg-slate-950/40 px-4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quiz-description">Description</Label>

          <Textarea
            id="quiz-description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Add instructions for students"
            rows={4}
            className="min-h-[132px] resize-none rounded-2xl border-white/10 bg-slate-950/40 px-4 py-3"
          />
        </div>
      </div>
    </section>
  );
}