"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

type AIAction = "chat" | "suggest_wrong_answers";

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
  | {
      success: true;
      type: "chat";
      message: string;
    }
  | {
      success: true;
      type: "wrong_answers";
      message: string;
      wrongAnswers: string[];
    }
  | {
      success: false;
      message: string;
    };

function cleanJsonResponse(value: string) {
  return value
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
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
    model: "gemini-2.0-flash",
  });

  const prompt =
    input.action === "suggest_wrong_answers"
      ? `
You are an AI assistant for a quiz maker app.

Question:
${input.context.questionText}

Correct answer:
${input.context.correctAnswer}

Existing choices:
${input.context.options?.join(", ") || "None"}

Suggest exactly 3 plausible but incorrect answer choices.

Rules:
- Do not include the correct answer.
- Do not repeat existing choices.
- Keep answers short.
- Return ONLY valid JSON.
- No markdown.
- No explanation.

JSON format:
{
  "wrongAnswers": ["answer 1", "answer 2", "answer 3"]
}
`
      : `
You are an AI assistant inside a quiz maker app.

Help the teacher create better quiz questions.

Current context:
Question type: ${input.context.questionType}
Question text: ${input.context.questionText || "No question yet"}
Correct answer: ${input.context.correctAnswer || "No correct answer yet"}
Existing options: ${input.context.options?.join(", ") || "None"}

Teacher message:
${input.message}

If the teacher has not provided enough details, ask one short follow-up question.
Keep your answer concise and helpful.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (input.action === "suggest_wrong_answers") {
      const parsed = JSON.parse(cleanJsonResponse(text));

      return {
        success: true,
        type: "wrong_answers",
        message: "Here are suggested wrong answers.",
        wrongAnswers: Array.isArray(parsed.wrongAnswers)
          ? parsed.wrongAnswers.slice(0, 3)
          : [],
      };
    }

    return {
      success: true,
      type: "chat",
      message: text.trim(),
    };
  } catch (error) {
    console.error("Gemini AI error:", error);

    return {
      success: false,
      message:
        "AI is unavailable right now. Please check your Gemini API quota or billing.",
    };
  }
}
