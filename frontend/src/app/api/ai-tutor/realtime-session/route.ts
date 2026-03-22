import { NextRequest, NextResponse } from "next/server";

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
    en: "Always respond in English.",
    zu: "Always respond in isiZulu.",
    st: "Always respond in Sesotho.",
    af: "Always respond in Afrikaans.",
};

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { language = "en", lessonTitle, lessonContent } = await req.json() as {
        language?: string;
        lessonTitle?: string;
        lessonContent?: string;
    };

    const languageInstruction = LANGUAGE_INSTRUCTIONS[language] ?? LANGUAGE_INSTRUCTIONS["en"];

    const instructions = `You are a friendly AI tutor helping a student understand a lesson.
${languageInstruction}
Keep your answers concise, clear, and encouraging.
Base your answers strictly on the lesson content provided below.
If the student asks something outside the lesson, gently redirect them back to the topic.

Lesson: ${lessonTitle ?? "this lesson"}

${lessonContent ?? ""}`;

    try {
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2024-12-17",
                voice: "verse",
                instructions,
                input_audio_transcription: { model: "whisper-1" },
                turn_detection: {
                    type: "server_vad",
                    threshold: 0.5,
                    prefix_padding_ms: 300,
                    silence_duration_ms: 600,
                },
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json({ error }, { status: response.status });
        }

        const data = await response.json() as unknown;
        return NextResponse.json(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create session.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
