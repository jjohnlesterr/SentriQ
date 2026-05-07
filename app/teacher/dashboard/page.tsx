"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Edit,
  Eye,
  FileText,
  LogOut,
  Loader2,
  Plus,
  ShieldCheck,
} from "lucide-react";

import PageShell from "@/components/layout/PageShell";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { createQuiz, getTeacherQuizzes } from "@/lib/actions";
import type { Quiz } from "@/lib/types";

export default function TeacherDashboardPage() {
  const router = useRouter();

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizDescription, setNewQuizDescription] = useState("");

  useEffect(() => {
    const storedTeacherId = sessionStorage.getItem("teacherId");
    const storedTeacherName = sessionStorage.getItem("teacherName");

    if (!storedTeacherId) {
      router.push("/teacher/login");
      return;
    }

    setTeacherId(storedTeacherId);
    setTeacherName(storedTeacherName || "Teacher");
    loadQuizzes(storedTeacherId);
  }, [router]);

  async function loadQuizzes(id: string) {
    setIsLoading(true);

    try {
      const data = await getTeacherQuizzes(id);
      setQuizzes(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateQuiz() {
    if (!newQuizTitle.trim() || !teacherId) {
      alert("Quiz title is required.");
      return;
    }

    setIsCreating(true);

    try {
      const quiz = await createQuiz(
        newQuizTitle.trim(),
        newQuizDescription.trim(),
        teacherId
      );

      setQuizzes((prev) => [...prev, quiz]);
      setNewQuizTitle("");
      setNewQuizDescription("");
      setDialogOpen(false);

      router.push(`/teacher/quiz/${quiz.id}/builder`);
    } catch {
      alert("Failed to create quiz.");
    } finally {
      setIsCreating(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("teacherId");
    sessionStorage.removeItem("teacherName");
    router.push("/");
  }

  const publishedQuizzes = quizzes.filter((quiz) => quiz.published);
  const draftQuizzes = quizzes.filter((quiz) => !quiz.published);

  function QuizList({ items }: { items: Quiz[] }) {
    if (items.length === 0) {
      return (
        <Card className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
          <p className="text-slate-300">No quizzes found.</p>
          <p className="mt-2 text-sm text-slate-500">
            Create your first quiz to get started.
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((quiz) => (
          <Card
            key={quiz.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{quiz.title}</h3>

                  <span
                    className={
                      quiz.published
                        ? "rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200"
                        : "rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200"
                    }
                  >
                    {quiz.published ? "Published" : "Draft"}
                  </span>
                </div>

                <p className="text-sm text-slate-400">
                  {quiz.description || "No description provided."}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                  <span>Questions: {quiz.questions.length}</span>
                  <span>Status: {quiz.published ? "Published" : "Draft"}</span>

                  {quiz.published && (
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-cyan-200">
                      Code: {quiz.code}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/teacher/quiz/${quiz.id}/builder`)}
                  className="cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>

                {quiz.published && (
                  <Button
                    type="button"
                    onClick={() =>
                      router.push(`/teacher/quiz/${quiz.id}/monitor`)
                    }
                    className="cursor-pointer hover:scale-[1.02]"
                  >
                    <Eye className="h-4 w-4" />
                    Monitor
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-16">
        <Card className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="relative p-6 md:p-8">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Teacher Control Center
                </div>

                <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                  Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-300 md:text-base">
                  Welcome back,{" "}
                  <span className="font-medium text-white">{teacherName}</span>
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </Card>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <BookOpen className="mb-4 h-8 w-8 text-cyan-300" />
            <p className="text-sm text-slate-400">Total Quizzes</p>
            <p className="mt-2 text-3xl font-bold text-white">{quizzes.length}</p>
          </Card>

          <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <Eye className="mb-4 h-8 w-8 text-blue-300" />
            <p className="text-sm text-slate-400">Published</p>
            <p className="mt-2 text-3xl font-bold text-blue-300">
              {publishedQuizzes.length}
            </p>
          </Card>

          <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <FileText className="mb-4 h-8 w-8 text-violet-300" />
            <p className="text-sm text-slate-400">Drafts</p>
            <p className="mt-2 text-3xl font-bold text-violet-300">
              {draftQuizzes.length}
            </p>
          </Card>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="h-full min-h-[120px] w-full cursor-pointer rounded-3xl hover:scale-[1.02] lg:min-w-[220px]"
              >
                <Plus className="h-4 w-4" />
                Create New Quiz
              </Button>
            </DialogTrigger>

            <DialogContent className="border border-white/10 bg-slate-950/95 text-white backdrop-blur-2xl">
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
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Optional instructions"
                    value={newQuizDescription}
                    onChange={(e) => setNewQuizDescription(e.target.value)}
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleCreateQuiz}
                  disabled={isCreating || !newQuizTitle.trim()}
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
        </div>

        {isLoading ? (
          <Card className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
              Loading quizzes...
            </div>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 h-auto rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl">
              <TabsTrigger value="all" className="cursor-pointer rounded-xl px-4 py-2">
                All Quizzes ({quizzes.length})
              </TabsTrigger>
              <TabsTrigger value="published" className="cursor-pointer rounded-xl px-4 py-2">
                Published ({publishedQuizzes.length})
              </TabsTrigger>
              <TabsTrigger value="drafts" className="cursor-pointer rounded-xl px-4 py-2">
                Drafts ({draftQuizzes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <QuizList items={quizzes} />
            </TabsContent>

            <TabsContent value="published">
              <QuizList items={publishedQuizzes} />
            </TabsContent>

            <TabsContent value="drafts">
              <QuizList items={draftQuizzes} />
            </TabsContent>
          </Tabs>
        )}
      </section>
    </PageShell>
  );
}