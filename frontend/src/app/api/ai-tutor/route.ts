import { NextResponse } from "next/server";

interface IChatMessage {
    role: "user" | "assistant";
    text: string;
}

interface ITutorRequest {
    messages: IChatMessage[];
    language: string;
    subjectName?: string;
    topicName?: string;
    lessonTitle?: string;
    latestDiagnostic?: {
        scorePercent: number;
        recommendation: string;
    } | null;
    promptConfiguration?: {
        generalPrompt?: string;
        lifeSciencesPrompt?: string;
        responseStyle?: string;
        masteryThreshold?: number;
        retryLimit?: number;
    } | null;
}

function fallbackReply(request: ITutorRequest): string {
    const latestUserMessage = request.messages.at(-1)?.text ?? "your question";
    const context = [request.subjectName, request.topicName, request.lessonTitle].filter(Boolean).join(" - ");
    const languageLabel = request.language || "en";

    return [
        `I am responding in ${languageLabel} mode for ${context || "Life Sciences"}.`,
        `Here is a focused explanation for: "${latestUserMessage}".`,
        request.latestDiagnostic
            ? `Your latest diagnostic score was ${request.latestDiagnostic.scorePercent}%, so I will keep this explanation supportive and step by step.`
            : "I will keep this explanation supportive and step by step.",
        "Start with the core definition, then connect it to one concrete example, and finally test yourself with a short question."
    ].join("\n\n");
}

export async function POST(request: Request) {
    const body = (await request.json()) as ITutorRequest;
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL ?? "gpt-5-mini";

    if (!apiKey) {
        return NextResponse.json({ reply: fallbackReply(body), provider: "fallback" });
    }

    const systemPrompt = [
        body.promptConfiguration?.generalPrompt,
        body.promptConfiguration?.lifeSciencesPrompt,
        `Response style: ${body.promptConfiguration?.responseStyle ?? "supportive-step-by-step"}`,
        `Target language code: ${body.language}`,
        `Subject: ${body.subjectName ?? "Life Sciences"}`,
        `Topic: ${body.topicName ?? "Unknown topic"}`,
        `Lesson: ${body.lessonTitle ?? "Unknown lesson"}`,
        body.latestDiagnostic
            ? `Latest diagnostic score: ${body.latestDiagnostic.scorePercent}. Recommendation: ${body.latestDiagnostic.recommendation}`
            : "No diagnostic context supplied."
    ]
        .filter(Boolean)
        .join("\n");

    const input = [
        {
            role: "system",
            content: [{ type: "input_text", text: systemPrompt }],
        },
        ...body.messages.map((message) => ({
            role: message.role,
            content: [{ type: "input_text", text: message.text }],
        })),
    ];

    try {
        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                input,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { reply: fallbackReply(body), provider: "fallback", error: errorText },
                { status: 200 }
            );
        }

        const data = await response.json() as { output_text?: string };
        const reply = data.output_text?.trim() || fallbackReply(body);

        return NextResponse.json({ reply, provider: "openai" });
    } catch (error) {
        return NextResponse.json(
            {
                reply: fallbackReply(body),
                provider: "fallback",
                error: error instanceof Error ? error.message : "Unknown AI tutor error",
            },
            { status: 200 }
        );
    }
}
