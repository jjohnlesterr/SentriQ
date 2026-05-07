import {
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import FeaturedBadge from "@/components/shared/FeaturedBadge";
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
    <Card className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="relative p-6 md:p-8">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="border border-white/10 bg-white/5 hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div>
              <FeaturedBadge
                icon={ShieldCheck}
                label="Live Monitoring Console"
                className="mb-3 border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-200"
                iconClassName="h-3.5 w-3.5"
              />

              <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
                Live Monitor
              </h1>

              <p className="mt-2 text-sm text-slate-300 md:text-base">
                {quiz?.title || "Quiz not found"}
              </p>

              {quiz?.published && (
                <p className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-sm text-cyan-200">
                  Join Code: {quiz.code}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-slate-400">
              Last updated:{" "}
              <span className="font-medium text-white">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </p>

            <Button
              variant="secondary"
              onClick={onRefresh}
              className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>

            <Button
              onClick={onToggleAutoRefresh}
              variant={autoRefresh ? "primary" : "secondary"}
            >
              Auto {autoRefresh ? "ON" : "OFF"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}