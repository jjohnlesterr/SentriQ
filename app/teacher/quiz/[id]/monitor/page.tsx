"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getQuizById, getQuizSessions } from "@/lib/actions";
import type { Quiz, QuizSession } from "@/lib/types";

export default function TeacherMonitorPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  async function loadData() {
    try {
      const quizData = await getQuizById(quizId);
      const sessionData = await getQuizSessions(quizId);

      setQuiz(quizData);
      setSessions(sessionData);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    if (!autoRefresh) return;

    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [quizId, autoRefresh]);

  const inProgress = sessions.filter((s) => s.status === "in-progress");
  const completed = sessions.filter((s) => s.status === "completed");
  const suspicious = sessions.filter((s) => s.tabSwitches > 0);

  function formatTime(value: Date | string | undefined) {
    if (!value) return "—";
    return new Date(value).toLocaleTimeString();
  }

  function SessionCard({ session }: { session: QuizSession }) {
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
                {session.status === "completed" ? "Completed" : "In Progress"}
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
                <p className="mt-1 text-white">{formatTime(session.startedAt)}</p>
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

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
              >
                View Details
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl border-white/10 bg-slate-950/95 text-white">
              <DialogHeader>
                <DialogTitle>{session.studentName} - Session Details</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Real-time monitoring information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 font-semibold text-white">Activity Log</h4>

                  <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {session.events.length === 0 ? (
                      <p className="text-sm text-slate-400">No events recorded.</p>
                    ) : (
                      session.events.map((event, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                        >
                          {event.type === "started" && (
                            <Clock className="h-4 w-4 text-blue-300" />
                          )}
                          {event.type === "tab-left" && (
                            <AlertTriangle className="h-4 w-4 text-red-300" />
                          )}
                          {event.type === "completed" && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          )}

                          <div>
                            <p className="text-sm capitalize text-white">
                              {event.type === "tab-left"
                                ? "Tab Left"
                                : event.type}
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatTime(event.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold text-white">
                    Answers Provided
                  </h4>

                  <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
                    {Array.from({ length: quiz?.questions.length || 0 }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className={
                            session.answers[index] !== undefined
                              ? "flex aspect-square items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-sm font-bold text-blue-200"
                              : "flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-slate-500"
                          }
                        >
                          {index + 1}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-200 backdrop-blur-md">
            <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
            Loading monitor...
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-16">
        <Card className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="relative p-6 md:p-8">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/teacher/dashboard")}
                  className="border border-white/10 bg-white/5 hover:bg-white/10"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Live Monitoring Console
                  </div>

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
                  variant="outline"
                  onClick={loadData}
                  className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>

                <Button
                  onClick={() => setAutoRefresh((prev) => !prev)}
                  variant={autoRefresh ? "primary" : "outline"}
                >
                  Auto {autoRefresh ? "ON" : "OFF"}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <Eye className="mb-3 h-8 w-8 text-blue-300" />
            <p className="text-sm text-slate-400">Total Sessions</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {sessions.length}
            </p>
          </Card>

          <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <Activity className="mb-3 h-8 w-8 text-indigo-300" />
            <p className="text-sm text-slate-400">In Progress</p>
            <p className="mt-2 text-3xl font-bold text-indigo-300">
              {inProgress.length}
            </p>
          </Card>

          <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <CheckCircle2 className="mb-3 h-8 w-8 text-emerald-300" />
            <p className="text-sm text-slate-400">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">
              {completed.length}
            </p>
          </Card>

          <Card className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <AlertTriangle className="mb-3 h-8 w-8 text-red-300" />
            <p className="text-sm text-slate-400">Suspicious Activity</p>
            <p className="mt-2 text-3xl font-bold text-red-300">
              {suspicious.length}
            </p>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 h-auto rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl">
            <TabsTrigger value="all" className="rounded-xl px-4 py-2">
              All Sessions ({sessions.length})
            </TabsTrigger>
            <TabsTrigger value="progress" className="rounded-xl px-4 py-2">
              In Progress ({inProgress.length})
            </TabsTrigger>
            <TabsTrigger value="suspicious" className="rounded-xl px-4 py-2">
              Suspicious ({suspicious.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {sessions.length === 0 ? (
              <Card className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
                <p className="text-slate-300">
                  No students have joined this quiz yet.
                </p>
              </Card>
            ) : (
              sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {inProgress.length === 0 ? (
              <Card className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
                <p className="text-slate-300">No active sessions.</p>
              </Card>
            ) : (
              inProgress.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            )}
          </TabsContent>

          <TabsContent value="suspicious" className="space-y-4">
            {suspicious.length === 0 ? (
              <Card className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
                <p className="text-slate-300">
                  No suspicious activity detected.
                </p>
              </Card>
            ) : (
              suspicious.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </section>
    </PageShell>
  );
}