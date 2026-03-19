import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LANGUAGE_NAMES: Record<string, string> = {
    en: "English",
    zu: "isiZulu",
    st: "Sesotho",
    af: "Afrikaans",
};

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

interface RequestBody {
    messages: ChatMessage[];
    lessonContent: string;
    language: string;
}

export async function POST(request: Request) {
    try {
        const { messages, lessonContent, language }: RequestBody =
            await request.json();

        const languageName = LANGUAGE_NAMES[language] ?? "English";

        const systemPrompt = `You are a friendly and encouraging AI tutor for South African high school students.

LESSON CONTEXT:
${lessonContent}

INSTRUCTIONS:
- You are helping the student understand the lesson content above.
- Always respond in ${languageName}. This is non-negotiable — even if the student writes in another language, reply in ${languageName}.
- Keep explanations clear, concise, and appropriate for a high school level.
- Use examples from the lesson context when relevant.
- Be encouraging and supportive.
- If asked something unrelated to the lesson, gently redirect the student back to the topic.

MATH FORMATTING:
- Always write mathematical expressions using LaTeX syntax.
- Wrap inline math with single dollar signs: $expression$
- Wrap block/display math with double dollar signs: $$expression$$
- Examples: $x^2 + y^2 = z^2$, $$F = ma$$, $a^m \\times a^n = a^{m+n}$
- Never write math as plain text (e.g. never write "x^2", always write "$x^2$").`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages,
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const reply = completion.choices[0]?.message?.content ?? "Sorry, I could not generate a response. Please try again.";

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("[ai-tutor] OpenAI error:", error);
        return NextResponse.json(
            { error: "Failed to get AI response. Please try again." },
            { status: 500 }
        );
    }
}
