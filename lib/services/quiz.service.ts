import { supabase } from "@/lib/supabase/client";
import type { Question, Quiz } from "@/lib/shared/types";
import {
  createQuizSchema,
  publishQuizSchema,
  updateQuizSchema,
} from "@/lib/validations/quiz.schema";

type QuizRow = {
  id: string;
  title: string;
  description: string;
  code: string;
  created_by: string;
  published: boolean;
  status: "draft" | "published";
  created_at: string;
  time_limit_minutes?: number | null;
  questions?: QuestionRow[];
};

type QuestionRow = {
  id: string;
  quiz_id: string;
  type: Question["type"];
  text: string;
  hint: string;
  options: string[];
  correct_answer: number;
  correct_text_answer: string;
  position: number;
};

function generateCode(length: number = 6): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

async function generateUniqueQuizCode(): Promise<string> {
  let code = generateCode();

  while (true) {
    const { data, error } = await supabase
      .from("quizzes")
      .select("id")
      .eq("code", code)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) return code;

    code = generateCode();
  }
}

function mapQuestionRow(row: QuestionRow): Question {
  return {
    id: row.id,
    type: row.type,
    text: row.text,
    hint: row.hint || "",
    options: row.options || [],
    correctAnswer: row.correct_answer,
    correctTextAnswer: row.correct_text_answer,
  };
}

function mapQuizRow(row: QuizRow): Quiz {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    code: row.code,
    createdBy: row.created_by,
    published: row.published,
    status: row.status,
    createdAt: new Date(row.created_at),
    timeLimitMinutes: row.time_limit_minutes ?? null,
    questions:
      row.questions
        ?.sort((a, b) => a.position - b.position)
        .map(mapQuestionRow) || [],
  };
}

export async function createQuizService(
  title: string,
  description: string,
  teacherId: string,
): Promise<Quiz> {
  const validated = createQuizSchema.parse({
    title,
    description,
    teacherId,
  });

  const code = await generateUniqueQuizCode();

  const { data, error } = await supabase
    .from("quizzes")
    .insert({
      title: validated.title,
      description: validated.description,
      code,
      created_by: validated.teacherId,
      published: false,
      status: "draft",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapQuizRow({ ...data, questions: [] });
}

export async function updateQuizService(
  quizId: string,
  title: string,
  description: string,
  questions: Question[],
  timeLimitMinutes?: number | null,
): Promise<Quiz> {
  const validated = {
    quizId,
    title: title.trim(),
    description: description.trim(),
    questions,
    timeLimitMinutes: timeLimitMinutes ?? null,
  };

  const { data: quizData, error: quizError } = await supabase
    .from("quizzes")
    .update({
      title: validated.title,
      description: validated.description,
      time_limit_minutes: validated.timeLimitMinutes,
    })
    .eq("id", validated.quizId)
    .select("*")
    .single();

  if (quizError) {
    throw new Error(quizError.message);
  }

  const { error: deleteError } = await supabase
    .from("questions")
    .delete()
    .eq("quiz_id", validated.quizId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (validated.questions.length > 0) {
    const { error: insertError } = await supabase.from("questions").insert(
      validated.questions.map((question, index) => ({
        id: question.id,
        quiz_id: validated.quizId,
        type: question.type,
        text: question.text,
        hint: question.hint || "",
        options: question.options || [],
        correct_answer: question.correctAnswer || 0,
        correct_text_answer: question.correctTextAnswer || "",
        position: index,
      })),
    );

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  return {
    ...mapQuizRow({ ...quizData, questions: [] }),
    questions: validated.questions,
  };
}
export async function publishQuizService(quizId: string): Promise<Quiz> {
  const validated = publishQuizSchema.parse({ quizId });

  const existingQuiz = await getQuizByIdService(validated.quizId);

  if (!existingQuiz) {
    throw new Error("Quiz not found.");
  }

  if (existingQuiz.questions.length === 0) {
    throw new Error("Quiz must have at least 1 question before publishing.");
  }

  updateQuizSchema.parse({
    quizId: existingQuiz.id,
    title: existingQuiz.title,
    description: existingQuiz.description,
    questions: existingQuiz.questions,
  });

  const { data, error } = await supabase
    .from("quizzes")
    .update({
      published: true,
      status: "published",
    })
    .eq("id", validated.quizId)
    .select("*, questions(*)")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapQuizRow(data);
}

export async function deleteQuizService(quizId: string): Promise<void> {
  const validated = publishQuizSchema.parse({ quizId });

  const { error } = await supabase
    .from("quizzes")
    .delete()
    .eq("id", validated.quizId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getTeacherQuizzesService(
  teacherId: string,
): Promise<Quiz[]> {
  if (!teacherId) {
    throw new Error("Teacher ID is required.");
  }

  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(*)")
    .eq("created_by", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(mapQuizRow);
}

export async function getQuizByIdService(quizId: string): Promise<Quiz | null> {
  const validated = publishQuizSchema.parse({ quizId });

  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(*)")
    .eq("id", validated.quizId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return mapQuizRow(data);
}

export async function getAllQuizzesWithSessionsService() {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((quiz) => ({
    ...mapQuizRow(quiz),
    sessions: [],
  }));
}
