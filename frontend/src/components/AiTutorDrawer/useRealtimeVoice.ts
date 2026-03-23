"use client";

import { useCallback, useRef, useState } from "react";

/** A transcript message produced during a realtime session. */
export interface IRealtimeMessage {
    role: "user" | "ai";
    text: string;
}

export interface IRealtimeVoiceCallbacks {
    lessonTitle: string;
    lessonContent: string;
    language: string;
    /** Called when a completed user or AI transcript is available. */
    onMessage: (message: IRealtimeMessage) => void;
    /** Called whenever the AI starts or stops speaking. */
    onAiSpeakingChange: (speaking: boolean) => void;
}

export interface IRealtimeVoiceResult {
    isConnected: boolean;
    isConnecting: boolean;
    isMuted: boolean;
    isSupported: boolean;
    connect: (callbacks: IRealtimeVoiceCallbacks) => Promise<void>;
    disconnect: () => void;
    toggleMute: () => void;
}

/** Manages a live bidirectional voice session with the OpenAI Realtime API via WebRTC. */
export function useRealtimeVoice(): IRealtimeVoiceResult {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const micTrackRef = useRef<MediaStreamTrack | null>(null);

    const isSupported =
        typeof window !== "undefined" &&
        Boolean(window.RTCPeerConnection) &&
        Boolean(navigator.mediaDevices?.getUserMedia);

    const disconnect = useCallback((): void => {
        dataChannelRef.current?.close();
        peerConnectionRef.current?.close();

        if (audioElementRef.current) {
            audioElementRef.current.srcObject = null;
            audioElementRef.current.remove();
        }

        micTrackRef.current?.stop();

        dataChannelRef.current = null;
        peerConnectionRef.current = null;
        audioElementRef.current = null;
        micTrackRef.current = null;

        setIsConnected(false);
        setIsMuted(false);
    }, []);

    const connect = useCallback(async (callbacks: IRealtimeVoiceCallbacks): Promise<void> => {
        const { lessonTitle, lessonContent, language, onMessage, onAiSpeakingChange } = callbacks;

        setIsConnecting(true);

        try {
            // get ephemeral session token from our API
            const sessionRes = await fetch("/api/ai-tutor/realtime-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language, lessonTitle, lessonContent }),
            });

            if (!sessionRes.ok) {
                throw new Error("Failed to create realtime session.");
            }

            const sessionData = await sessionRes.json() as { client_secret?: { value: string } };
            const clientSecret = sessionData.client_secret?.value;

            if (!clientSecret) {
                throw new Error("Invalid session response from server.");
            }

            // set up WebRTC peer connection
            const pc = new RTCPeerConnection();
            peerConnectionRef.current = pc;

            // attach remote audio stream to a hidden audio element for playback
            const audioEl = document.createElement("audio");
            audioEl.autoplay = true;
            document.body.appendChild(audioEl);
            audioElementRef.current = audioEl;

            pc.ontrack = (e) => {
                audioEl.srcObject = e.streams[0];
            };

            // add microphone input track
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const micTrack = stream.getTracks()[0];
            micTrackRef.current = micTrack;
            pc.addTrack(micTrack);

            // open data channel to receive transcript events
            const dc = pc.createDataChannel("oai-events");
            dataChannelRef.current = dc;

            let aiTranscriptBuffer = "";

            dc.onmessage = (e) => {
                const event = JSON.parse(e.data as string) as {
                    type: string;
                    delta?: string;
                    transcript?: string;
                };

                if (event.type === "response.created") {
                    onAiSpeakingChange(true);
                    aiTranscriptBuffer = "";
                }

                if (event.type === "response.audio_transcript.delta") {
                    aiTranscriptBuffer += event.delta ?? "";
                }

                if (event.type === "response.audio_transcript.done") {
                    const text = event.transcript ?? aiTranscriptBuffer;
                    if (text.trim()) {
                        onMessage({ role: "ai", text: text.trim() });
                    }
                    aiTranscriptBuffer = "";
                }

                if (event.type === "response.done") {
                    onAiSpeakingChange(false);
                }

                if (event.type === "conversation.item.input_audio_transcription.completed") {
                    if (event.transcript?.trim()) {
                        onMessage({ role: "user", text: event.transcript.trim() });
                    }
                }
            };

            dc.onerror = () => {
                disconnect();
            };

            // negotiate WebRTC with OpenAI Realtime API
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            const sdpRes = await fetch(
                "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
                {
                    method: "POST",
                    body: offer.sdp,
                    headers: {
                        Authorization: `Bearer ${clientSecret}`,
                        "Content-Type": "application/sdp",
                    },
                },
            );

            if (!sdpRes.ok) {
                throw new Error("WebRTC negotiation with OpenAI failed.");
            }

            const answerSdp = await sdpRes.text();
            await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

            setIsConnected(true);
        } catch (error) {
            disconnect();
            throw error;
        } finally {
            setIsConnecting(false);
        }
    }, [disconnect]);

    const toggleMute = useCallback((): void => {
        if (!micTrackRef.current) {
            return;
        }

        const newMuted = !isMuted;
        micTrackRef.current.enabled = !newMuted;
        setIsMuted(newMuted);
    }, [isMuted]);

    return { isConnected, isConnecting, isMuted, isSupported, connect, disconnect, toggleMute };
}
