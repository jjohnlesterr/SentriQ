"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CircleHelp,
  Copy,
  FileText,
  Loader2,
  Plus,
  Rocket,
  Save,
  Trash2,
} from "lucide-react";

import PageShell from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { getQuizById, publishQuiz, updateQuiz } from "@/lib/actions";
import type { Question, Quiz } from "@/lib/types";

export default function QuizBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      const data = await getQuizById(quizId);

      if (!data) {
        router.push("/teacher/dashboard");
        return;
      }

      setQuiz(data);
      setTitle(data.title);
      setDescription(data.description);
      setQuestions(data.questions);
      setIsLoading(false);
    }

    loadQuiz();
  }, [quizId, router]);

  async function handleSaveQuiz() {
    if (!title.trim()) {
      alert("Quiz title is required.");
      return;
    }

    setIsSaving(true);

    try {
      const updated = await updateQuiz(quizId, title, description, questions);
      setQuiz(updated);
      alert("Draft saved successfully.");
    } catch {
      alert("Failed to save draft.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublishQuiz() {
    if (!title.trim()) {
      alert("Quiz title is required.");
      return;
    }

    if (questions.length === 0) {
      alert("Add at least one question before publishing.");
      return;
    }

    setIsPublishing(true);

    try {
      await updateQuiz(quizId, title, description, questions);
      const published = await publishQuiz(quizId);

      setQuiz(published);
      setShowCodeDialog(true);
    } catch {
      alert("Failed to publish quiz.");
    } finally {
      setIsPublishing(false);
    }
  }

  function addQuestion() {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setActiveQuestion(questions.length);
  }

  function updateQuestion(index: number, updates: Partial<Question>) {
    const updated = [...questions];

    updated[index] = {
      ...updated[index],
      ...updates,
    };

    setQuestions(updated);
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  }

  function removeQuestion(index: number) {
    const updated = questions.filter((_, questionIndex) => questionIndex !== index);

    setQuestions(updated);
    setActiveQuestion(Math.max(0, index - 1));
  }

  function addOption(questionIndex: number) {
    const updated = [...questions];
    updated[questionIndex].options.push("");
    setQuestions(updated);
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    const updated = [...questions];

    if (updated[questionIndex].options.length <= 2) return;

    updated[questionIndex].options.splice(optionIndex, 1);

    if (updated[questionIndex].correctAnswer >= updated[questionIndex].options.length) {
      updated[questionIndex].correctAnswer = updated[questionIndex].options.length - 1;
    }

    setQuestions(updated);
  }

  async function handleCopyCode() {
    if (!quiz?.code) return;

    await navigator.clipboard.writeText(quiz.code);
    alert("Quiz code copied.");
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-slate-200 backdrop-blur-md">
            <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
            Loading quiz...
          </div>
        </div>
      </PageShell>
    );
  }

  const currentQuestion = questions[activeQuestion];

  return (
    <PageShell>
      <div className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6 md:px-10 lg:px-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/teacher/dashboard")}
              className="cursor-pointer rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                Quiz Builder
              </h1>
              <p className="text-sm text-slate-300">
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleSaveQuiz}
              disabled={isSaving}
              variant="outline"
              className="cursor-pointer border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Draft
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={handlePublishQuiz}
              disabled={isPublishing || questions.length === 0}
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:from-blue-600 hover:to-cyan-600"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : quiz?.published ? (
                "Published"
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  Publish Quiz
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <section className="relative mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-16">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6 border border-white/10 bg-white/5 backdrop-blur-md">
            <TabsTrigger value="details" className="cursor-pointer">
              Quiz Details
            </TabsTrigger>
            <TabsTrigger value="questions" className="cursor-pointer">
              Questions ({questions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                  <FileText className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">Quiz Details</h2>
                  <p className="text-sm text-slate-300">
                    Set your quiz title and instructions.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="quiz-title">Quiz Title</Label>
                  <Input
                    id="quiz-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Chemistry Quiz"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiz-description">Description</Label>
                  <Textarea
                    id="quiz-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add instructions for students"
                    rows={4}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <Card className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                  <div className="mb-4 space-y-2">
                    {questions.map((question, index) => (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => setActiveQuestion(index)}
                        className={`w-full cursor-pointer rounded-2xl border p-3 text-left transition-all ${
                          activeQuestion === index
                            ? "border-blue-400/40 bg-blue-500/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                          Q{index + 1}
                        </p>
                        <p className="truncate text-sm text-white">
                          {question.text || "Untitled question"}
                        </p>
                      </button>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={addQuestion}
                    className="w-full cursor-pointer bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Question
                  </Button>
                </Card>
              </div>

              <div className="md:col-span-2">
                {questions.length === 0 ? (
                  <Card className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                      <CircleHelp className="h-8 w-8" />
                    </div>

                    <p className="mb-5 text-slate-300">No questions yet</p>

                    <Button
                      type="button"
                      onClick={addQuestion}
                      className="cursor-pointer bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
                    >
                      <Plus className="h-4 w-4" />
                      Add First Question
                    </Button>
                  </Card>
                ) : currentQuestion ? (
                  <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-white md:text-xl">
                        Question {activeQuestion + 1}
                      </h3>

                      <Button
                        type="button"
                        onClick={() => removeQuestion(activeQuestion)}
                        variant="destructive"
                        size="sm"
                        className="cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Textarea
                          value={currentQuestion.text}
                          onChange={(e) =>
                            updateQuestion(activeQuestion, {
                              text: e.target.value,
                            })
                          }
                          placeholder="Enter your question"
                          rows={3}
                        />
                      </div>

                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <Label>Answer Options</Label>

                          <Button
                            type="button"
                            onClick={() => addOption(activeQuestion)}
                            variant="outline"
                            size="sm"
                            className="cursor-pointer border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                          >
                            <Plus className="h-3 w-3" />
                            Add Option
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {currentQuestion.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                            >
                              <Checkbox
                                checked={currentQuestion.correctAnswer === optionIndex}
                                onCheckedChange={() =>
                                  updateQuestion(activeQuestion, {
                                    correctAnswer: optionIndex,
                                  })
                                }
                                className="cursor-pointer"
                              />

                              <Input
                                value={option}
                                onChange={(e) =>
                                  updateOption(
                                    activeQuestion,
                                    optionIndex,
                                    e.target.value
                                  )
                                }
                                placeholder={`Option ${optionIndex + 1}`}
                                className="flex-1 bg-transparent"
                              />

                              {currentQuestion.options.length > 2 && (
                                <Button
                                  type="button"
                                  onClick={() =>
                                    removeOption(activeQuestion, optionIndex)
                                  }
                                  variant="ghost"
                                  size="icon"
                                  className="cursor-pointer hover:bg-white/10"
                                >
                                  <Trash2 className="h-4 w-4 text-red-400" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                        <p className="text-sm text-emerald-100">
                          Correct answer:{" "}
                          <span className="font-semibold text-emerald-300">
                            {currentQuestion.options[currentQuestion.correctAnswer] ||
                              "No answer selected"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Card>
                ) : null}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="border-white/10 bg-slate-950/95 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Quiz Published!</DialogTitle>
            <DialogDescription className="text-slate-300">
              Share this code with students so they can join the quiz.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-6 text-center">
              <p className="mb-2 text-sm text-slate-300">Join Code</p>
              <p className="font-mono text-4xl font-bold tracking-[0.3em] text-violet-200">
                {quiz?.code}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleCopyCode}
              variant="outline"
              className="w-full cursor-pointer border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
            >
              <Copy className="h-4 w-4" />
              Copy Code
            </Button>

            <Button
              type="button"
              onClick={() => router.push(`/teacher/quiz/${quizId}/monitor`)}
              className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
            >
              Go to Monitor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}