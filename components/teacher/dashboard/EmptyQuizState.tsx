import { Card } from "@/components/ui/card";

export default function EmptyQuizState() {
  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
      <p className="text-slate-300">No quizzes found.</p>
      <p className="mt-2 text-sm text-slate-500">
        Create your first quiz to get started.
      </p>
    </Card>
  );
}