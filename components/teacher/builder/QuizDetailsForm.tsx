import { FileText } from "lucide-react";

import { Card } from "@/components/ui/card";
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
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-5 md:p-6">
      <div className="mb-5 flex items-center gap-3 md:mb-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300 md:h-12 md:w-12">
          <FileText className="h-5 w-5 md:h-6 md:w-6" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white md:text-xl">
            Quiz Details
          </h2>

          <p className="text-sm text-slate-300">
            Set your quiz title and instructions.
          </p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-5">
        <div className="space-y-2">
          <Label htmlFor="quiz-title">Quiz Title</Label>

          <Input
            id="quiz-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Chemistry Quiz"
            className="h-11"
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
            className="min-h-[120px]"
          />
        </div>
      </div>
    </Card>
  );
}