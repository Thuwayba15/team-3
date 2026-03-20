import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LANGUAGE_NAMES: Record<string, string> = {
    en: "English",
    zu: "isiZulu",
    st: "Sesotho",
    af: "Afrikaans",
};

export async function POST(req: NextRequest) {
    const { question, lessonTitle, lessonContent, language = "en" } = await req.json() as {
        question: string;
        lessonTitle: string;
        lessonContent: string;
        language?: string;
    };

    if (!question?.trim()) {
        return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const languageName = LANGUAGE_NAMES[language] ?? "English";

    const systemPrompt = `You are a friendly AI tutor helping a student understand a lesson.
Always respond in ${languageName}.
Keep your answers concise, clear, and encouraging.
Base your answers strictly on the lesson content provided below.
If the student asks something outside the lesson, gently redirect them back to the topic.

Lesson: ${lessonTitle}

${lessonContent}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
        ],
        max_tokens: 500,
        temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content ?? "I'm sorry, I could not generate a response.";
    return NextResponse.json({ reply });
}
