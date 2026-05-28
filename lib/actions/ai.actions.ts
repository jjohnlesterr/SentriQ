"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

type AIAction =
  | "chat"
  | "suggest_wrong_answers"
  | "generate_question_ideas"
  | "suggest_topics"
  | "write_question"
  | "create_outline";

type GenerateAIResponseInput = {
  action: AIAction;
  message?: string;
  context: {
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

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "AI is unavailable right now.";
}

function getErrorStatus(error: unknown) {
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

export async function generateAIResponse(
  input: GenerateAIResponseInput,
): Promise<AIResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      message: "Missing GEMINI_API_KEY in .env.local.",
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
      maxOutputTokens: 250,
      temperature: 0.7,
    },
  });

  let prompt = "";

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
- Do NOT ask follow-up questions.
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
Generate 5 quiz question ideas.

Topic/context:
${input.context.questionText || input.message || "General knowledge"}

Question type:
${input.context.questionType}

Rules:
- Do NOT ask follow-up questions.
- Give direct suggestions.
- Keep each question short.
- Use numbered list.
`;
  }

  if (input.action === "suggest_topics") {
    prompt = `
Suggest 10 quiz topics for a teacher.

Context:
${input.context.questionText || input.message || "General classroom quiz"}

Rules:
- Do NOT ask follow-up questions.
- Give direct topic ideas only.
- Use bullet points.
`;
  }

  if (input.action === "write_question") {
    prompt = `
Write 5 quiz questions based on this topic:

${input.message || input.context.questionText || "General knowledge"}

Rules:
- Do NOT ask follow-up questions.
- Include answer after each question.
- Keep it concise.
`;
  }

  if (input.action === "create_outline") {
    prompt = `
Create a short quiz outline.

Topic:
${input.message || input.context.questionText || "General knowledge"}

Rules:
- Do NOT ask follow-up questions.
- Include 5 sections.
- Include sample questions.
`;
  }

  if (input.action === "chat") {
    prompt = `
You are an AI assistant inside a quiz maker app.

Current quiz context:
Question type: ${input.context.questionType}
Question text: ${input.context.questionText || "No question yet"}
Correct answer: ${input.context.correctAnswer || "No correct answer yet"}
Existing options: ${input.context.options?.join(", ") || "None"}

Teacher message:
${input.message || ""}

Answer directly. Do NOT ask follow-up questions unless absolutely impossible.
Keep your answer concise and useful.
`;
  }

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

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
    console.error("Gemini AI error:", error);

    return {
      success: false,
      message:
        getErrorStatus(error) === 429
          ? "AI quota/rate limit reached. Please wait a few seconds and try again."
          : getErrorMessage(error),
    };
  }
}