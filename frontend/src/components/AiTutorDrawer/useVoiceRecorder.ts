"use client";

import { useCallback, useRef, useState } from "react";

export interface IVoiceRecorderResult {
    isRecording: boolean;
    isSupported: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob | null>;
}

/** Captures microphone audio via the browser's MediaRecorder API. */
export function useVoiceRecorder(): IVoiceRecorderResult {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const isSupported =
        typeof window !== "undefined" &&
        typeof navigator !== "undefined" &&
        Boolean(navigator.mediaDevices?.getUserMedia);

    const startRecording = useCallback(async (): Promise<void> => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
            }
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
    }, []);

    const stopRecording = useCallback((): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const mediaRecorder = mediaRecorderRef.current;

            if (!mediaRecorder || mediaRecorder.state === "inactive") {
                setIsRecording(false);
                resolve(null);
                return;
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
                mediaRecorder.stream.getTracks().forEach((track) => track.stop());
                setIsRecording(false);
                resolve(blob);
            };

            mediaRecorder.stop();
        });
    }, []);

    return { isRecording, isSupported, startRecording, stopRecording };
}
