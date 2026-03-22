import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Maps platform language codes to Whisper-compatible ISO-639-1 codes. */
const WHISPER_LANGUAGE_CODES: Record<string, string> = {
    en: "en",
    zu: "zu",
    st: "st",
    af: "af",
};

export async function POST(req: NextRequest): Promise<NextResponse> {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const language = (formData.get("language") as string | null) ?? "en";

    if (!audioFile) {
        return NextResponse.json({ error: "Audio file is required." }, { status: 400 });
    }

    const whisperLanguage = WHISPER_LANGUAGE_CODES[language] ?? "en";

    try {
        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-1",
            language: whisperLanguage,
        });

        return NextResponse.json({ transcript: transcription.text });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Transcription failed.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
