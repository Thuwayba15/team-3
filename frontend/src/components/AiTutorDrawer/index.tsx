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
}

// ── Simulated AI responses ────────────────────────────────────────────────────

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

function getSimulatedReply(question: string, topic: string, lang: string): string {
    const q = question.toLowerCase();

    const replies: Record<string, Record<string, string>> = {
        en: {
            default: `Great question about "${topic}"! Here's how I'd explain it:\n\nThis concept builds on what you've already learned. The key is to break the problem into smaller steps and apply the rules one at a time. Would you like me to walk through a specific example?`,
            formula: `A formula is a rule written using mathematical symbols. For "${topic}", make sure you know what each variable represents before substituting values. Try writing it out step by step.`,
            example: `Sure! Let me give you a worked example for "${topic}":\n\n1. Start by identifying what's given.\n2. Choose the correct rule or formula.\n3. Substitute and simplify carefully.\n\nWould you like to try one yourself?`,
            help: `No problem! "${topic}" can be tricky at first. The best approach is to practise with simple cases before moving to harder ones. Which part specifically is confusing you?`,
        },
        zu: {
            default: `Umbuzo omuhle mayelana no-"${topic}"! Nansi indlela engachaza ngayo:\n\nLeli qiniso lakhiwa phezu kwalokho osufundile. Okunqala ukwenza izinyathelo ezincane.`,
            formula: `Ifomu iwumthetho obhalwe ngezimpawu zezibalo. Ku-"${topic}", qiniseka ukuthi uyazi lokho okumele kube khona ngaphambi kokukhomba amanani.`,
            example: `Ngeke! Ake ngikunike isibonelo esisebenzayo ku-"${topic}":\n\n1. Qala ngokubona ukuthi yini enikezwayo.\n2. Khetha imithetho efanele.\n3. Faka amanani kahle.`,
            help: `Akukho inkinga! "${topic}" ingaba nzima ekuqaleni. Indlela engcono ukuzilolonga ngezimo ezilula kuqala.`,
        },
        st: {
            default: `Potso e ntle mabapi le "${topic}"! Ke tsela eo ke tla e hlalosa kateng:\n\nKgopolo ena e aha ho se o se ithutileng. Se sa bohlokwa ke ho arola bothata ka dikarolo tse nyane.`,
            formula: `Foromo ke molao o ngotsweng ka dipaki tsa dipalo. Ho "${topic}", netefatsa hore o tseba seo sefapanosana se emang ho sona pele o kenya ditshupuha.`,
            example: `Ee! A ke go fa mohlala o sebetsang wa "${topic}":\n\n1. Qala ka ho bona se fanoeng.\n2. Kgetha molao o nepahetseng.\n3. Kenya le ho natefaletsa ka hloko.`,
            help: `Ha ho mathata! "${topic}" e ka ba thata qalong. Mokgwa o motle ke ho itlwaetsa ka mehlala e bonolo pele.`,
        },
        af: {
            default: `Goeie vraag oor "${topic}"! Hier is hoe ek dit sal verduidelik:\n\nHierdie konsep bou op wat jy reeds geleer het. Die sleutel is om die probleem in kleiner stappe op te breek.`,
            formula: `'n Formule is 'n reël geskryf met wiskundige simbole. Vir "${topic}", maak seker jy weet wat elke veranderlike beteken voordat jy waardes invoeg.`,
            example: `Natuurlik! Hier is 'n uitgewerkte voorbeeld vir "${topic}":\n\n1. Begin deur te identifiseer wat gegee word.\n2. Kies die korrekte reël.\n3. Vervang en vereenvoudig sorgvuldig.`,
            help: `Geen probleem nie! "${topic}" kan aanvanklik moeilik wees. Die beste benadering is om eers met eenvoudige gevalle te oefen.`,
        },
    };

    const langReplies = replies[lang] ?? replies.en;

    if (q.includes("formula") || q.includes("rule") || q.includes("law"))
        return langReplies.formula;
    if (q.includes("example") || q.includes("show") || q.includes("demonstrate"))
        return langReplies.example;
    if (q.includes("help") || q.includes("understand") || q.includes("confus") || q.includes("don't get"))
        return langReplies.help;

    return langReplies.default;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AiTutorDrawer({ open, onClose, lessonTitle = "this lesson" }: AiTutorDrawerProps) {
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
        setMessages([{ role: "ai", text: GREETINGS[lang] }]);
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

        await new Promise((r) => setTimeout(r, 1200));

        const reply = getSimulatedReply(text, lessonTitle, lang);
        setMessages((prev) => [...prev, { role: "ai", text: reply }]);
        setThinking(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
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
            width={400}
            open={open}
            onClose={onClose}
            styles={{ body: { padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" } }}
        >
            <div className={styles.context}>
                <div className={styles.contextLabel}>Current lesson</div>
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
                    onClick={send}
                    disabled={!input.trim() || thinking}
                />
            </div>
        </Drawer>
    );
}
