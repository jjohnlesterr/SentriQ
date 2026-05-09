import { ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";

import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Quiz } from "@/lib/types";

type Props = {
  quiz: Quiz | null;
  autoRefresh: boolean;
  lastUpdated: Date;
  onBack: () => void;
  onRefresh: () => void;
  onToggleAutoRefresh: () => void;
};

export default function MonitorHeader({
  quiz,
  autoRefresh,
  lastUpdated,
  onBack,
  onRefresh,
  onToggleAutoRefresh,
}: Props) {
  return (
    <Card className="mb-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:mb-6">
      <div className="relative p-5 md:p-8">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl md:h-32 md:w-32" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-10 w-10 shrink-0 border border-white/10 bg-white/5 p-0 hover:bg-white/10 md:h-11 md:w-11"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="min-w-0">
              <SectionHeading
                icon={ShieldCheck}
                badge="Live Monitoring Console"
                title="Live Monitor"
                description={quiz?.title || "Quiz not found"}
                variant="page"
                badgeClassName="mb-3 border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-200"
                iconClassName="h-3.5 w-3.5"
                titleClassName="text-3xl md:text-4xl"
                descriptionClassName="mt-2 text-sm text-slate-300 md:text-base"
              />

              {quiz?.published && (
                <p className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-200 md:text-sm">
                  Join Code: {quiz.code}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
            <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
              Last updated:{" "}
              <span className="font-medium text-white">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </p>

            <Button
              variant="secondary"
              onClick={onRefresh}
              className="h-11 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>

            <Button
              onClick={onToggleAutoRefresh}
              variant={autoRefresh ? "primary" : "secondary"}
              className="h-11"
            >
              Auto {autoRefresh ? "ON" : "OFF"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}