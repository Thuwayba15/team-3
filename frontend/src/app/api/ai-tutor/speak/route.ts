import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { text } = await req.json() as { text?: string };

    if (!text?.trim()) {
        return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    try {
        const speech = await openai.audio.speech.create({
            model: "tts-1",
            voice: "nova",
            input: text,
        });

        const audioBuffer = Buffer.from(await speech.arrayBuffer());

        return new NextResponse(audioBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": audioBuffer.length.toString(),
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Speech synthesis failed.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
