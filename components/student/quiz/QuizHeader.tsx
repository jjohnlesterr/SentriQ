import { ShieldAlert } from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import { Card } from "@/components/ui/card";

type QuizHeaderProps = {
  title: string;
  studentName: string;
  currentIndex: number;
  totalQuestions: number;
  progress: number;
};

export default function QuizHeader({
  title,
  studentName,
  currentIndex,
  totalQuestions,
  progress,
}: QuizHeaderProps) {
  return (
    <Card className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:mb-6">
      <div className="relative p-5 md:p-8">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl md:h-32 md:w-32" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SectionHeading
            icon={ShieldAlert}
            badge="Monitored Assessment"
            title={title}
            description={
              <>
                Student:{" "}
                <span className="font-semibold text-white">{studentName}</span>
              </>
            }
            variant="page"
            badgeClassName="mb-3 border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200"
            iconClassName="h-3.5 w-3.5"
            titleClassName="text-3xl md:text-4xl"
            descriptionClassName="mt-2 text-sm text-slate-300 md:text-base"
          />

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
        </div>

        <div className="relative z-10 mt-5 md:mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}