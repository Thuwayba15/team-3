"use client";

import { RobotOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Drawer, Input, Select, Spin, Typography } from "antd";
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { studentLearningService, type IDiagnosticResult, type ITutorConfiguration } from "@/services/student/studentLearningService";
import { useStyles } from "./styles";

const { Text } = Typography;

interface Message {
    role: "user" | "assistant";
    text: string;
}

export interface AiTutorDrawerProps {
    open: boolean;
    onClose: () => void;
    subjectName?: string;
    topicName?: string;
    lessonTitle?: string;
    latestDiagnostic?: IDiagnosticResult | null;
}

const LANG_LABELS: Record<string, string> = {
    en: "English",
    zu: "isiZulu",
    st: "Sesotho",
    af: "Afrikaans",
};

const GREETINGS: Record<string, string> = {
    en: "Hi! I am your AI tutor. Ask me anything about this lesson or topic.",
    zu: "Sawubona! Nginguthisha wakho we-AI. Buza noma yini ngaleli sifundo noma lesi sihloko.",
    st: "Dumela! Ke motataisi wa hao wa AI. Botsa eng kapa eng ka thuto ena kapa sehlooho sena.",
    af: "Hallo! Ek is jou KI-tutor. Vra enigiets oor hierdie les of onderwerp.",
};

function buildGreeting(language: string): Message {
    return {
        role: "assistant",
        text: GREETINGS[language] ?? GREETINGS.en,
    };
}

export default function AiTutorDrawer({
    open,
    onClose,
    subjectName = "Life Sciences",
    topicName,
    lessonTitle,
    latestDiagnostic = null,
}: AiTutorDrawerProps) {
    const { styles } = useStyles();
    const [lang, setLang] = useState("en");
    const [messages, setMessages] = useState<Message[]>([buildGreeting("en")]);
    const [input, setInput] = useState("");
    const [thinking, setThinking] = useState(false);
    const [config, setConfig] = useState<ITutorConfiguration | null>(null);
    const [configError, setConfigError] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const contextLabel = useMemo(() => {
        return lessonTitle || topicName || subjectName;
    }, [lessonTitle, subjectName, topicName]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, thinking]);

    useEffect(() => {
        if (!open) {
            return;
        }

        setMessages([buildGreeting(lang)]);
        setInput("");
    }, [open, lang]);

    useEffect(() => {
        if (!open) {
            return;
        }

        studentLearningService
            .getTutorConfiguration()
            .then((result) => {
                setConfig(result);
                setConfigError(null);
            })
            .catch(() => setConfigError("Tutor configuration could not be loaded. A fallback response will be used if needed."));
    }, [open]);

    const send = async () => {
        const text = input.trim();
        if (!text || thinking) {
            return;
        }

        const nextMessages = [...messages, { role: "user" as const, text }];
        setInput("");
        setMessages(nextMessages);
        setThinking(true);

        try {
            const response = await fetch("/api/ai-tutor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: nextMessages,
                    language: lang,
                    subjectName,
                    topicName,
                    lessonTitle,
                    latestDiagnostic,
                    promptConfiguration: config,
                }),
            });

            const data = await response.json() as { reply?: string };
            const reply = data.reply?.trim() || "I could not generate a tutor response right now.";

            setMessages((previous) => [...previous, { role: "assistant", text: reply }]);
        } catch {
            setMessages((previous) => [
                ...previous,
                { role: "assistant", text: "I could not reach the tutor service just now. Please try again in a moment." },
            ]);
        } finally {
            setThinking(false);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void send();
        }
    };

    return (
        <Drawer
            title={
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <RobotOutlined style={{ color: "#00b8a9" }} />
                    AI Tutor
                </span>
            }
            placement="right"
            width={420}
            open={open}
            onClose={onClose}
            styles={{ body: { padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" } }}
        >
            <div className={styles.context}>
                <div className={styles.contextLabel}>Current learning context</div>
                <div className={styles.contextTopic}>{contextLabel}</div>
                {latestDiagnostic && (
                    <Text className={styles.langLabel}>
                        Latest diagnostic: {latestDiagnostic.scorePercent}% - {latestDiagnostic.recommendation}
                    </Text>
                )}
            </div>

            <div className={styles.langRow}>
                <Text className={styles.langLabel}>Respond in:</Text>
                <Select
                    value={lang}
                    onChange={setLang}
                    size="small"
                    style={{ flex: 1 }}
                    options={Object.entries(LANG_LABELS).map(([value, label]) => ({ value, label }))}
                />
            </div>

            {configError && <Alert type="warning" message={configError} banner />}

            <div className={styles.messages}>
                {messages.map((message, index) => (
                    <div
                        key={`${message.role}-${index}`}
                        className={`${styles.msgRow} ${message.role === "user" ? styles.msgRowUser : ""}`}
                    >
                        <Avatar
                            size="small"
                            icon={message.role === "assistant" ? <RobotOutlined /> : <UserOutlined />}
                            className={message.role === "assistant" ? styles.avatarAi : styles.avatarUser}
                        />
                        <div className={`${styles.bubble} ${message.role === "assistant" ? styles.bubbleAi : styles.bubbleUser}`}>
                            {message.text}
                        </div>
                    </div>
                ))}

                {thinking && (
                    <div className={styles.msgRow}>
                        <Avatar size="small" icon={<RobotOutlined />} className={styles.avatarAi} />
                        <div className={styles.typingBubble}>
                            <Spin size="small" />
                            <Text type="secondary" style={{ fontSize: 13 }}>Thinking...</Text>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <div className={styles.inputRow}>
                <Input.TextArea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question... (Enter to send)"
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{ flex: 1, resize: "none" }}
                    disabled={thinking}
                />
                <Button
                    type="primary"
                    shape="circle"
                    icon={<SendOutlined />}
                    className={styles.sendBtn}
                    onClick={() => void send()}
                    disabled={!input.trim() || thinking}
                />
            </div>
        </Drawer>
    );
}
