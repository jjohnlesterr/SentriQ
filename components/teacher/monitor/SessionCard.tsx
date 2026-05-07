import {
  AlertTriangle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { QuizSession } from "@/lib/types";

type Props = {
  session: QuizSession;
  onView: (id: string) => void;
  formatTime: (value: Date | string | undefined) => string;
};

export default function SessionCard({
  session,
  onView,
  formatTime,
}: Props) {
  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-white">
              {session.studentName}
            </h3>

            <Badge
              className={
                session.status === "completed"
                  ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                  : "border-blue-400/20 bg-blue-500/10 text-blue-200"
              }
            >
              {session.status === "completed"
                ? "Completed"
                : "In Progress"}
            </Badge>

            {session.tabSwitches > 0 && (
              <Badge className="border-red-400/20 bg-red-500/10 text-red-200">
                <AlertTriangle className="mr-1 h-3 w-3" />
                {session.tabSwitches} tab switch
                {session.tabSwitches !== 1 ? "es" : ""}
              </Badge>
            )}
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-400">Current Question</p>

              <p className="mt-1 font-mono text-white">
                Q{session.currentQuestion + 1}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-400">Started</p>

              <p className="mt-1 text-white">
                {formatTime(session.startedAt)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-400">Tab Switches</p>

              <p
                className={
                  session.tabSwitches > 0
                    ? "mt-1 font-bold text-red-300"
                    : "mt-1 font-bold text-cyan-300"
                }
              >
                {session.tabSwitches}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={() => onView(session.id)}
          className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}