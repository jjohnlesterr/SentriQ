"use server";

import {
  GoogleGenerativeAI,
  GoogleGenerativeAIAbortError,
  GoogleGenerativeAIFetchError,
  type GenerationConfig,
  type ResponseSchema,
} from "@google/generative-ai";

import {
  buildGenerationPrompt,
  buildResponseSchema,
  generationRequestSchema,
  parseGeneratedQuestions,
} from "@/lib/ai/quiz-generation";
import type { Question } from "@/lib/shared/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { questionSchema } from "@/lib/validations/quiz.schema";

// Tried in order. The gemini-2.5 models are no longer available to new API keys.
const DEFAULT_MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
const REQUEST_TIMEOUT_MS = 30_000;
// Errors worth retrying on the next model (model missing, overloaded, server error).
const FALLBACK_STATUSES = new Set([404, 500, 502, 503, 504]);

function getModelChain() {
  const preferred = process.env.GEMINI_MODEL?.trim();

  return [...new Set([preferred, ...DEFAULT_MODELS].filter(Boolean))] as string[];
}

async function generateText(apiKey: string, prompt: string, generationConfig: GenerationConfig) {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown;

  for (const modelName of getModelChain()) {
    try {
      const model = genAI.getGenerativeModel(
        { model: modelName, generationConfig },
        { timeout: REQUEST_TIMEOUT_MS },
      );
      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (error) {
      lastError = error;

      const status = getErrorStatus(error);
      const canFallBack =
        error instanceof GoogleGenerativeAIAbortError ||
        (status !== null && FALLBACK_STATUSES.has(status));

      if (!canFallBack) throw error;

      logAIError(`model ${modelName} unavailable, trying next`, error);
    }
  }

  throw lastError;
}

async function isSignedIn() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return Boolean(user);
}

// Maps SDK/network failures to short messages; raw errors never reach the client.
function toFriendlyAIError(error: unknown) {
  if (error instanceof GoogleGenerativeAIAbortError) {
    return "The AI took too long to respond. Please try again.";
  }

  const status = getErrorStatus(error);

  if (status === 429) return "AI rate limit reached. Please wait a moment and try again.";
  if (status === 400) return "The AI couldn't process this request. Try a shorter or clearer topic.";
  if (status === 401 || status === 403) return "AI generation isn't configured correctly. Please contact the administrator.";
  if (status && status >= 500) return "The AI service is temporarily unavailable. Please try again.";

  return "AI is unavailable right now. Please try again.";
}

function logAIError(context: string, error: unknown) {
  // Log only non-sensitive metadata; never the key or the full request.
  console.error(`[ai] ${context}`, {
    name: error instanceof Error ? error.name : typeof error,
    status: getErrorStatus(error),
  });
}

type AIAction =
  | "chat"
  | "suggest_wrong_answers"
  | "generate_question_ideas"
  | "suggest_topics"
  | "write_question";

type GenerateAIResponseInput = {
  action: AIAction;
  message?: string;
  context: {
    quizTitle?: string;
    topicOverride?: string;
    questionType: string;
    questionText: string;
    correctAnswer?: string;
    options?: string[];
  };
};

type AIResponse =
  | { success: true; type: "chat"; message: string }
  | {
      success: true;
      type: "wrong_answers";
      message: string;
      wrongAnswers: string[];
    }
  | { success: false; message: string };

function cleanJsonResponse(value: string) {
  return value.replace(/```json/g, "").replace(/```/g, "").trim();
}

function getErrorStatus(error: unknown) {
  if (error instanceof GoogleGenerativeAIFetchError) return error.status ?? null;

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return null;
}

function getTopic(input: GenerateAIResponseInput) {
  return (
    input.context.topicOverride?.trim() ||
    input.context.quizTitle?.trim() ||
    input.context.questionText.trim()
  );
}

export async function generateAIResponse(
  input: GenerateAIResponseInput,
): Promise<AIResponse> {
  if (!(await isSignedIn())) {
    return { success: false, message: "Please log in to use the AI assistant." };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      message: "AI features aren't configured yet.",
    };
  }

  // Newer models spend part of the output budget on reasoning, so allow headroom.
  const chatConfig: GenerationConfig = { maxOutputTokens: 1024, temperature: 0.4 };

  let prompt = "";
  const topic = getTopic(input);

  if (input.action === "suggest_wrong_answers") {
    prompt = `
You are helping a teacher create a multiple choice quiz.

Question:
${input.context.questionText}

Correct answer:
${input.context.correctAnswer}

Existing choices:
${input.context.options?.join(", ") || "None"}

Generate exactly 3 plausible but incorrect answer choices.

Rules:
- Do NOT include the correct answer.
- Do NOT repeat existing choices.
- Keep answers short.
- Return ONLY valid JSON.
- No markdown.
- No explanation.

JSON format:
{
  "wrongAnswers": ["answer 1", "answer 2", "answer 3"]
}
`;
  }

  if (input.action === "generate_question_ideas") {
    prompt = `
You are helping a teacher create student-facing quiz questions.

Quiz title/topic:
${topic}

Question type:
${input.context.questionType}

Rules:
- Generate exactly 5 student-facing question ideas about the quiz title/topic.
- Treat broad but valid topics like Programming, Computer, Biology, Math, English, Science, RAM, CPU, Networking, Filipino, or Bacteriology as clear topics.
- Do NOT ask follow-up questions.
- Do NOT generate questions about quiz creation, assessment design, or how to write questions.
- Do NOT use button labels as the topic.
- Use a numbered list.
- No markdown bold.
`;
  }

  if (input.action === "suggest_topics") {
    prompt = `
You are helping a teacher choose quiz topics.

Quiz title/topic:
${topic}

Rules:
- Suggest exactly 10 related subtopics about the quiz title/topic.
- Treat broad but valid topics like Programming, Computer, Biology, Math, English, Science, RAM, CPU, Networking, Filipino, or Bacteriology as clear topics.
- Do NOT ask follow-up questions.
- Do NOT suggest topics about quiz creation or assessment writing.
- Use bullet points.
- No markdown bold.
`;
  }

  if (input.action === "write_question") {
    prompt = `
You are helping a teacher write student-facing quiz questions.

Quiz title/topic:
${topic}

Question type:
${input.context.questionType}

Rules:
- Generate exactly 5 multiple choice questions about the quiz title/topic.
- Include 4 answer choices for each question.
- Mark the correct answer clearly.
- Treat broad but valid topics like Programming, Computer, Biology, Math, English, Science, RAM, CPU, Networking, Filipino, or Bacteriology as clear topics.
- Do NOT ask follow-up questions.
- Do NOT generate questions about quiz creation, assessment design, or how to write questions.
- Do NOT use button labels as the topic.
- No markdown bold.
`;
  }

  if (input.action === "chat") {
    prompt = `
You are an AI assistant inside a quiz maker app.

Quiz title/topic: ${topic || "No topic yet"}
Question type: ${input.context.questionType}
Question text: ${input.context.questionText || "No question yet"}
Correct answer: ${input.context.correctAnswer || "No correct answer yet"}
Existing options: ${input.context.options?.join(", ") || "None"}

Teacher message:
${input.message || ""}

Rules:
- Answer directly and concisely.
- Base quiz suggestions on the quiz title/topic whenever possible.
- Do NOT generate questions about quiz creation unless the teacher explicitly asks for quiz-writing advice.
- No markdown bold.
`;
  }

  try {
    const text = await generateText(apiKey, prompt, chatConfig);

    if (input.action === "suggest_wrong_answers") {
      try {
        const parsed = JSON.parse(cleanJsonResponse(text));

        return {
          success: true,
          type: "wrong_answers",
          message: "Here are suggested wrong answers.",
          wrongAnswers: Array.isArray(parsed.wrongAnswers)
            ? parsed.wrongAnswers.slice(0, 3)
            : [],
        };
      } catch {
        return {
          success: false,
          message: "AI returned an invalid format. Please try again.",
        };
      }
    }

    return {
      success: true,
      type: "chat",
      message: text.trim(),
    };
  } catch (error: unknown) {
    logAIError("assistant request failed", error);

    return { success: false, message: toFriendlyAIError(error) };
  }
}

// --- Structured quiz generation -------------------------------------------

export type GenerateQuizQuestionsResult =
  | { success: true; questions: Question[]; skipped: number }
  | { success: false; message: string };

export async function generateQuizQuestions(
  input: unknown,
): Promise<GenerateQuizQuestionsResult> {
  if (!(await isSignedIn())) {
    return { success: false, message: "Please log in to generate questions." };
  }

  const parsedInput = generationRequestSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      message: parsedInput.error.issues[0]?.message ?? "Please check your input.",
    };
  }

  const request = parsedInput.data;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { success: false, message: "AI generation isn't configured yet." };
  }

  let text: string;

  try {
    text = await generateText(apiKey, buildGenerationPrompt(request), {
      temperature: 0.3,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: buildResponseSchema(request.types) as unknown as ResponseSchema,
    });
  } catch (error) {
    logAIError("quiz generation failed", error);
    return { success: false, message: toFriendlyAIError(error) };
  }

  const parsed = parseGeneratedQuestions(text, request);

  if (!parsed.ok) {
    logAIError(`quiz generation returned ${parsed.error} output`, null);
    return {
      success: false,
      message: "The AI returned an unusable response. Please try again.",
    };
  }

  // Final gate: the same schema the builder uses when saving and publishing.
  const questions: Question[] = [];
  let skipped = parsed.rejected.length;

  for (const candidate of parsed.questions) {
    const checked = questionSchema.safeParse({ ...candidate, id: crypto.randomUUID() });

    if (!checked.success) {
      skipped += 1;
      continue;
    }

    questions.push({ ...candidate, ...checked.data });
  }

  if (questions.length === 0) {
    return {
      success: false,
      message: "The AI couldn't produce valid questions for this request. Try rephrasing the topic.",
    };
  }

  return { success: true, questions, skipped };
}
