"use client";

import { RobotOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Drawer, Input, Select, Spin, Typography } from "antd";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useStyles } from "./styles";

const { Text } = Typography;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function AiTutorDrawer({
    open,
    onClose,
    lessonTitle = "this lesson",
    lessonContent = "",
}: AiTutorDrawerProps) {
    const { styles } = useStyles();
    const [lang, setLang] = useState("en");
    const [messages, setMessages] = useState<Message[]>([{ role: "ai", text: GREETINGS["en"] }]);
    const [input, setInput] = useState("");
    const [thinking, setThinking] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [prevOpen, setPrevOpen] = useState(open);
    const [prevLang, setPrevLang] = useState(lang);

    if (open && (open !== prevOpen || lang !== prevLang)) {
        setPrevOpen(open);
        setPrevLang(lang);
        setMessages([{ role: "ai", text: GREETINGS[lang] ?? GREETINGS["en"] }]);
        setInput("");
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, thinking]);

    const send = async () => {
        const text = input.trim();
        if (!text || thinking) return;

        setInput("");
        setMessages((prev) => [...prev, { role: "user", text }]);
        setThinking(true);

        try {
            const res = await fetch("/api/ai-tutor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: text,
                    lessonTitle,
                    lessonContent,
                    language: lang,
                }),
            });

            const data = await res.json() as { reply?: string; error?: string };
            const reply = data.reply ?? data.error ?? "Something went wrong. Please try again.";
            setMessages((prev) => [...prev, { role: "ai", text: reply }]);
        } catch {
            setMessages((prev) => [...prev, { role: "ai", text: "Unable to reach the AI tutor. Please check your connection." }]);
        } finally {
            setThinking(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void send();
        }
    };

    return (
        <Drawer
            title={
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <RobotOutlined style={{ color: "#1e40af" }} />
                    AI Tutor
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
                    style={{ flex: 1 }}
                    options={Object.entries(LANG_LABELS).map(([value, label]) => ({ value, label }))}
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
                        <div className={`${styles.bubble} ${msg.role === "ai" ? styles.bubbleAi : styles.bubbleUser}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {thinking && (
                    <div className={styles.msgRow}>
                        <Avatar size="small" icon={<RobotOutlined />} className={styles.avatarAi} />
                        <div className={styles.typingBubble}>
                            <Spin size="small" />
                            <Text type="secondary" style={{ fontSize: 13 }}>Thinking…</Text>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <div className={styles.inputRow}>
                <Input.TextArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question… (Enter to send)"
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
