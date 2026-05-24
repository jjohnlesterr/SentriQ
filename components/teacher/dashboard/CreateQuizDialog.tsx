import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  title: string;
  description: string;
  isCreating: boolean;
  onOpenChange: (open: boolean) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCreate: () => void;
  hideTrigger?: boolean;
};

export default function CreateQuizDialog({
  open,
  title,
  description,
  isCreating,
  onOpenChange,
  onTitleChange,
  onDescriptionChange,
  onCreate,
  hideTrigger = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button
            type="button"
            data-create-quiz-trigger
            className="h-12 w-full cursor-pointer rounded-full px-6 text-sm font-semibold shadow-[0_20px_60px_rgba(59,130,246,0.25)] transition hover:scale-[1.01] md:h-14 md:w-auto md:min-w-[260px] md:text-base"
          >
            <Plus className="h-4 w-4" />
            Create New Quiz
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="w-[calc(100%-2rem)] border border-white/10 bg-slate-950/95 text-white backdrop-blur-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-2xl font-bold text-transparent">
            Create New Quiz
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Create a new quiz draft and add questions in the builder.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>

            <Input
              id="title"
              placeholder="e.g. Chemistry Quiz"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              placeholder="Optional instructions"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </div>

          <Button
            type="button"
            onClick={onCreate}
            disabled={isCreating || !title.trim()}
            className="w-full cursor-pointer"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Quiz
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
