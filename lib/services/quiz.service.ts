import { supabase } from "@/lib/supabase/client";
import type { Question, Quiz } from "@/lib/shared/types";

type QuizRow = {
  id: string;
  title: string;
  description: string;
  code: string;
  created_by: string;
  published: boolean;
  status: "draft" | "published";
  created_at: string;
  questions?: QuestionRow[];
};

type QuestionRow = {
  id: string;
  quiz_id: string;
  type: Question["type"];
  text: string;
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
    questions:
      row.questions
        ?.sort((a, b) => a.position - b.position)
        .map(mapQuestionRow) || [],
  };
}

export async function createQuizService(
  title: string,
  description: string,
  teacherId: string
): Promise<Quiz> {
  const code = await generateUniqueQuizCode();

  const { data, error } = await supabase
    .from("quizzes")
    .insert({
      title,
      description,
      code,
      created_by: teacherId,
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
  questions: Question[]
): Promise<Quiz> {
  const { data: quizData, error: quizError } = await supabase
    .from("quizzes")
    .update({
      title,
      description,
    })
    .eq("id", quizId)
    .select("*")
    .single();

  if (quizError) {
    throw new Error(quizError.message);
  }

  const { error: deleteError } = await supabase
    .from("questions")
    .delete()
    .eq("quiz_id", quizId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (questions.length > 0) {
    const { error: insertError } = await supabase.from("questions").insert(
      questions.map((question, index) => ({
        id: question.id,
        quiz_id: quizId,
        type: question.type,
        text: question.text,
        options: question.options || [],
        correct_answer: question.correctAnswer || 0,
        correct_text_answer: question.correctTextAnswer || "",
        position: index,
      }))
    );

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  return {
    ...mapQuizRow({ ...quizData, questions: [] }),
    questions,
  };
}

export async function publishQuizService(quizId: string): Promise<Quiz> {
  const { data, error } = await supabase
    .from("quizzes")
    .update({
      published: true,
      status: "published",
    })
    .eq("id", quizId)
    .select("*, questions(*)")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapQuizRow(data);
}

export async function deleteQuizService(quizId: string): Promise<void> {
  const { error } = await supabase
    .from("quizzes")
    .delete()
    .eq("id", quizId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getTeacherQuizzesService(
  teacherId: string
): Promise<Quiz[]> {
  const { data, error } = await supabase
    .from("quizzes")
    .select(`
      id,
      title,
      description,
      code,
      created_by,
      published,
      status,
      created_at
    `)
    .eq("created_by", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((quiz) =>
    mapQuizRow({
      ...quiz,
      questions: [],
    })
  );
}

export async function getQuizByIdService(
  quizId: string
): Promise<Quiz | null> {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(*)")
    .eq("id", quizId)
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