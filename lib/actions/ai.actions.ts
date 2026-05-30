"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

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
      maxOutputTokens: 280,
      temperature: 0.4,
    },
  });

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
          ? "AI rate limit reached. Please wait a few seconds and try again."
          : getErrorMessage(error),
    };
  }
}