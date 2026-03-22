"use client";

import {
    AudioMutedOutlined,
    AudioOutlined,
    CustomerServiceOutlined,
    DisconnectOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    RobotOutlined,
    SendOutlined,
    SoundOutlined,
    StopOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Drawer, Input, Select, Spin, Typography } from "antd";
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useI18nState } from "@/providers/i18n";
import { useStyles } from "./styles";
import { useRealtimeVoice } from "./useRealtimeVoice";
import { useVoiceRecorder } from "./useVoiceRecorder";

const { Text } = Typography;

// ── Types ─────────────────────────────────────────────────────────────────────

interface IMessage {
    role: "user" | "ai";
    text: string;
}

export interface AiTutorDrawerProps {
    open: boolean;
    onClose: () => void;
    lessonTitle?: string;
    lessonContent?: string;
}

// ── Language config ────────────────────────────────────────────────────────────

const LANG_LABELS: Record<string, string> = {
    en: "English",
    zu: "isiZulu",
    st: "Sesotho",
    af: "Afrikaans",
};

const GREETINGS: Record<string, string> = {
    en: "Hi! I'm your AI tutor. Ask me anything about this lesson.",
    zu: "Sawubona! Ngingumeluleki wakho we-AI. Buza noma yini mayelana nesifundo lesi.",
    st: "Dumela! Ke morutisi wa hao wa AI. Botsa ntho efe kapa efe mabapi le thuto ena.",
    af: "Hallo! Ek is jou KI-tutor. Vra my enigiets oor hierdie les.",
};

const LIVE_STARTED_MESSAGES: Record<string, string> = {
    en: "Live session started — speak freely and I'll respond in real time.",
    zu: "Iseshini ephilayo iqalile — khuluma freely futhi ngizophendula ngesikhathi sangempela.",
    st: "Setiing sa phelang se qalile — bua ka bolokolohi mme ke tla araba nako ea nnete.",
    af: "Lewendige sessie het begin — praat vrylik en ek sal intyds reageer.",
};

const LIVE_ENDED_MESSAGES: Record<string, string> = {
    en: "Live session ended.",
    zu: "Iseshini ephilayo iphelile.",
    st: "Setiing sa phelang se phethiloe.",
    af: "Lewendige sessie het geëindig.",
};

const SUPPORTED_LANGS = Object.keys(LANG_LABELS);

// ── Component ─────────────────────────────────────────────────────────────────

export default function AiTutorDrawer({
    open,
    onClose,
    lessonTitle = "this lesson",
    lessonContent = "",
}: AiTutorDrawerProps) {
    const { styles } = useStyles();
    const { currentLanguage } = useI18nState();
    const [lang, setLang] = useState(() => (SUPPORTED_LANGS.includes(currentLanguage) ? currentLanguage : "en"));
    const [messages, setMessages] = useState<IMessage[]>([{ role: "ai", text: GREETINGS[lang] ?? GREETINGS["en"] }]);
    const [input, setInput] = useState("");
    const [thinking, setThinking] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
    const isSpeaking = speakingMessageIndex !== null;
    const bottomRef = useRef<HTMLDivElement>(null);
    const [prevOpen, setPrevOpen] = useState(open);
    const [prevLang, setPrevLang] = useState(lang);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { isRecording, isSupported: isMicSupported, startRecording, stopRecording } = useVoiceRecorder();
    const {
        isConnected: isLiveConnected,
        isConnecting: isLiveConnecting,
        isMuted,
        isSupported: isRealtimeSupported,
        connect: realtimeConnect,
        disconnect: realtimeDisconnect,
        toggleMute,
    } = useRealtimeVoice();

    const isLiveActive = isLiveConnected || isLiveConnecting;

    // reset conversation when drawer opens or language changes
    if (open && (open !== prevOpen || lang !== prevLang)) {
        setPrevOpen(open);
        setPrevLang(lang);
        setMessages([{ role: "ai", text: GREETINGS[lang] ?? GREETINGS["en"] }]);
        setInput("");
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, thinking, isAiSpeaking]);

    // sync language selector when the platform language changes
    useEffect(() => {
        if (SUPPORTED_LANGS.includes(currentLanguage)) {
            setLang(currentLanguage);
        }
    }, [currentLanguage]);

    // clean up when drawer closes
    useEffect(() => {
        if (!open) {
            realtimeDisconnect();

            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
                setSpeakingMessageIndex(null);
            }
        }
    }, [open, realtimeDisconnect]);

    const addMessage = useCallback((message: IMessage): void => {
        setMessages((prev) => [...prev, message]);
    }, []);

    const askAi = async (question: string): Promise<string> => {
        const res = await fetch("/api/ai-tutor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, lessonTitle, lessonContent, language: lang }),
        });
        const data = await res.json() as { reply?: string; error?: string };
        return data.reply ?? data.error ?? "Something went wrong. Please try again.";
    };

    const speakText = async (text: string, messageIndex: number): Promise<void> => {
        // toggle off if the same message is already playing
        if (speakingMessageIndex === messageIndex) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setSpeakingMessageIndex(null);
            return;
        }

        // cancel any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        setSpeakingMessageIndex(messageIndex);

        try {
            const res = await fetch("/api/ai-tutor/speak", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!res.ok) {
                setSpeakingMessageIndex(null);
                return;
            }

            const audioBlob = await res.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;
                setSpeakingMessageIndex(null);
            };

            void audio.play();
        } catch {
            setSpeakingMessageIndex(null);
        }
    };

    const send = async (): Promise<void> => {
        const text = input.trim();
        if (!text || thinking) {
            return;
        }

        setInput("");
        setMessages((prev) => [...prev, { role: "user", text }]);
        setThinking(true);

        try {
            const reply = await askAi(text);
            setMessages((prev) => [...prev, { role: "ai", text: reply }]);
        } catch {
            setMessages((prev) => [...prev, { role: "ai", text: "Unable to reach the AI tutor. Please check your connection." }]);
        } finally {
            setThinking(false);
        }
    };

    const handleVoiceToggle = async (): Promise<void> => {
        if (thinking) {
            return;
        }

        if (isRecording) {
            const blob = await stopRecording();
            if (!blob) {
                return;
            }

            setThinking(true);

            try {
                const formData = new FormData();
                formData.append("audio", blob, "recording.webm");
                formData.append("language", lang);

                const transcriptRes = await fetch("/api/ai-tutor/transcribe", {
                    method: "POST",
                    body: formData,
                });

                if (!transcriptRes.ok) {
                    setMessages((prev) => [...prev, { role: "ai", text: "Could not transcribe audio. Please try again." }]);
                    return;
                }

                const { transcript } = await transcriptRes.json() as { transcript?: string };

                if (!transcript?.trim()) {
                    setMessages((prev) => [...prev, { role: "ai", text: "No speech detected. Please try again." }]);
                    return;
                }

                const aiMessageIndex = messages.length + 1;

                setMessages((prev) => [...prev, { role: "user", text: transcript }]);

                const reply = await askAi(transcript);
                setMessages((prev) => [...prev, { role: "ai", text: reply }]);
                void speakText(reply, aiMessageIndex);
            } catch {
                setMessages((prev) => [...prev, { role: "ai", text: "Unable to process voice input. Please try again." }]);
            } finally {
                setThinking(false);
            }
        } else {
            try {
                await startRecording();
            } catch {
                setMessages((prev) => [...prev, { role: "ai", text: "Microphone access denied. Please allow microphone access and try again." }]);
            }
        }
    };

    const handleStartLiveSession = async (): Promise<void> => {
        try {
            await realtimeConnect({
                lessonTitle,
                lessonContent,
                language: lang,
                onMessage: addMessage,
                onAiSpeakingChange: setIsAiSpeaking,
            });

            addMessage({ role: "ai", text: LIVE_STARTED_MESSAGES[lang] ?? LIVE_STARTED_MESSAGES["en"] });
        } catch {
            addMessage({ role: "ai", text: "Failed to start live session. Please check your connection and try again." });
        }
    };

    const handleEndLiveSession = (): void => {
        realtimeDisconnect();
        setIsAiSpeaking(false);
        addMessage({ role: "ai", text: LIVE_ENDED_MESSAGES[lang] ?? LIVE_ENDED_MESSAGES["en"] });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void send();
        }
    };

    return (
        <Drawer
            title={
                <span className={styles.drawerTitle}>
                    <RobotOutlined className={styles.drawerTitleIcon} />
                    AI Tutor
                    {isSpeaking && <SoundOutlined className={styles.speakingIcon} />}
                    {isLiveConnected && <span className={styles.liveBadge}>LIVE</span>}
                </span>
            }
            placement="right"
            width={400}
            open={open}
            onClose={onClose}
            styles={{ body: { padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" } }}
        >
            <div className={styles.context}>
                <div className={styles.contextTopic}>Current lesson</div>
                <div className={styles.contextTopic}>{lessonTitle}</div>
            </div>

            <div className={styles.langRow}>
                <Text className={styles.langLabel}>Respond in:</Text>
                <Select
                    value={lang}
                    onChange={setLang}
                    size="small"
                    className={styles.langSelect}
                    options={Object.entries(LANG_LABELS).map(([value, label]) => ({ value, label }))}
                    disabled={isLiveActive}
                />
            </div>

            <div className={styles.messages}>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`${styles.msgRow} ${msg.role === "user" ? styles.msgRowUser : ""}`}
                    >
                        <Avatar
                            size="small"
                            icon={msg.role === "ai" ? <RobotOutlined /> : <UserOutlined />}
                            className={msg.role === "ai" ? styles.avatarAi : styles.avatarUser}
                        />
                        <div className={styles.bubbleWrapper}>
                            <div className={`${styles.bubble} ${msg.role === "ai" ? styles.bubbleAi : styles.bubbleUser}`}>
                                {msg.text}
                            </div>
                            {msg.role === "ai" && (
                                <button
                                    type="button"
                                    className={`${styles.speakBtn} ${speakingMessageIndex === i ? styles.speakBtnActive : ""}`}
                                    onClick={() => void speakText(msg.text, i)}
                                    title={speakingMessageIndex === i ? "Stop" : "Play response"}
                                >
                                    {speakingMessageIndex === i ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {(thinking || (isLiveConnected && isAiSpeaking)) && (
                    <div className={styles.msgRow}>
                        <Avatar size="small" icon={<RobotOutlined />} className={styles.avatarAi} />
                        <div className={styles.typingBubble}>
                            <Spin size="small" />
                            <Text type="secondary" className={styles.thinkingText}>
                                {isLiveConnected ? "Speaking…" : "Thinking…"}
                            </Text>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {isLiveActive ? (
                <div className={styles.livePanel}>
                    <div className={styles.livePanelStatus}>
                        {isLiveConnecting ? (
                            <>
                                <Spin size="small" />
                                <Text className={styles.liveStatusText}>Connecting…</Text>
                            </>
                        ) : isAiSpeaking ? (
                            <>
                                <span className={styles.aiSpeakingDot} />
                                <Text className={styles.liveStatusText}>AI speaking…</Text>
                            </>
                        ) : (
                            <>
                                <span className={styles.listeningDot} />
                                <Text className={styles.liveStatusText}>{isMuted ? "Muted" : "Listening…"}</Text>
                            </>
                        )}
                    </div>

                    <div className={styles.livePanelActions}>
                        <Button
                            shape="circle"
                            icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
                            className={`${styles.muteButton} ${isMuted ? styles.muteButtonMuted : ""}`}
                            onClick={toggleMute}
                            disabled={isLiveConnecting}
                            title={isMuted ? "Unmute" : "Mute"}
                        />
                        <Button
                            danger
                            shape="circle"
                            icon={<DisconnectOutlined />}
                            className={styles.endCallButton}
                            onClick={handleEndLiveSession}
                            title="End live session"
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.inputRow}>
                        <Input.TextArea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask a question… (Enter to send)"
                            autoSize={{ minRows: 1, maxRows: 4 }}
                            className={styles.textInput}
                            disabled={thinking || isRecording}
                        />
                        {isMicSupported && (
                            <Button
                                shape="circle"
                                icon={isRecording ? <StopOutlined /> : <AudioOutlined />}
                                className={`${styles.micButton} ${isRecording ? styles.micButtonActive : ""}`}
                                onClick={() => void handleVoiceToggle()}
                                disabled={thinking}
                                title={isRecording ? "Stop recording" : "Record voice message"}
                            />
                        )}
                        {isRealtimeSupported && (
                            <Button
                                shape="circle"
                                icon={<CustomerServiceOutlined />}
                                className={styles.liveVoiceButton}
                                onClick={() => void handleStartLiveSession()}
                                disabled={thinking || isRecording}
                                title="Start live voice conversation"
                            />
                        )}
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SendOutlined />}
                            className={styles.sendBtn}
                            onClick={() => void send()}
                            disabled={!input.trim() || thinking || isRecording}
                        />
                    </div>

                    {isRecording && (
                        <div className={styles.recordingHint}>
                            <span className={styles.recordingDot} />
                            Recording… click the button to stop
                        </div>
                    )}
                </>
            )}
        </Drawer>
    );
}
