"use client";

import {
    CheckCircleOutlined,
    CheckOutlined,
    LeftOutlined,
    LockOutlined,
    MessageOutlined,
    PlayCircleOutlined,
    RightOutlined,
} from "@ant-design/icons";
import { Button, Card, Progress, Tag, Typography } from "antd";
import { useState } from "react";
import { useStyles } from "./styles";
import AiTutorDrawer from "@/components/AiTutorDrawer";

const { Title, Text } = Typography;

// ── Types ─────────────────────────────────────────────────────────────────────

type LessonStatus = "completed" | "current" | "locked";

interface Lesson {
    id: string;
    title: string;
    duration: string;
    status: LessonStatus;
}

interface Module {
    id: string;
    title: string;
    subject: string;
    lessons: Lesson[];
}

// ── Lesson content ────────────────────────────────────────────────────────────

interface LessonContent {
    breadcrumb: string;
    title: string;
    moduleCompletion: number;
    topics: { name: string; status: LessonStatus }[];
    sections: ContentSection[];
}

type ContentSection =
    | { type: "text"; heading: string; body: string }
    | { type: "highlight"; label: string; formula: string }
    | { type: "example"; heading: string; intro: string; steps: string[] };

const LESSON_CONTENT: Record<string, LessonContent> = {
    "math-m2-l2": {
        breadcrumb: "Mathematics • Module 2",
        title: "Simplifying Exponential Expressions",
        moduleCompletion: 33,
        topics: [
            { name: "Laws of Exponents",                  status: "completed" },
            { name: "Simplifying Expressions",             status: "current" },
            { name: "Solving Equations",                   status: "locked" },
        ],
        sections: [
            {
                type: "text",
                heading: "Introduction",
                body: "When simplifying exponential expressions, we apply the laws of exponents we learned in the previous lesson. Remember that these laws only apply when the bases are the same.",
            },
            {
                type: "highlight",
                label: "Key Rule to Remember:",
                formula: "aᵐ × aⁿ = aᵐ⁺ⁿ",
            },
            {
                type: "example",
                heading: "Worked Example",
                intro: "Let's look at how to simplify an expression with multiple variables.",
                steps: [
                    "Write out the expression: (2x²y³) × (3xy²)",
                    "Group the coefficients and like bases: 2 × 3 × x² × x¹ × y³ × y²",
                    "Multiply the coefficients: 6",
                    "Add the exponents of like bases: x²⁺¹ = x³ and y³⁺² = y⁵",
                    "Write the final answer: 6x³y⁵",
                ],
            },
            {
                type: "text",
                heading: "Practice",
                body: "Now try simplifying expressions on your own. Remember to always group like bases together and apply the multiplication rule by adding their exponents.",
            },
        ],
    },
    "math-m1-l1": {
        breadcrumb: "Mathematics • Module 1",
        title: "Expanding Brackets",
        moduleCompletion: 100,
        topics: [
            { name: "Expanding Brackets",   status: "completed" },
            { name: "Factorisation",         status: "completed" },
            { name: "Algebraic Fractions",   status: "completed" },
        ],
        sections: [
            {
                type: "text",
                heading: "Introduction",
                body: "Expanding brackets means removing the brackets from an expression by multiplying. We use the distributive law: a(b + c) = ab + ac.",
            },
            {
                type: "highlight",
                label: "Distributive Law:",
                formula: "a(b + c) = ab + ac",
            },
            {
                type: "example",
                heading: "Worked Example",
                intro: "Expand 3(x + 4).",
                steps: [
                    "Multiply 3 by each term inside the bracket.",
                    "3 × x = 3x",
                    "3 × 4 = 12",
                    "Final answer: 3x + 12",
                ],
            },
        ],
    },
    "sci-m2-l2": {
        breadcrumb: "Physical Sciences • Module 2",
        title: "Newton's Second Law",
        moduleCompletion: 33,
        topics: [
            { name: "Newton's First Law",   status: "completed" },
            { name: "Newton's Second Law",  status: "current" },
            { name: "Newton's Third Law",   status: "locked" },
        ],
        sections: [
            {
                type: "text",
                heading: "Introduction",
                body: "Newton's Second Law states that the acceleration of an object depends on the net force acting on it and its mass. The greater the force, the greater the acceleration.",
            },
            {
                type: "highlight",
                label: "Formula:",
                formula: "F = m × a",
            },
            {
                type: "example",
                heading: "Worked Example",
                intro: "A 5 kg object has a net force of 20 N applied to it. Find its acceleration.",
                steps: [
                    "Write the formula: F = m × a",
                    "Rearrange for acceleration: a = F ÷ m",
                    "Substitute values: a = 20 ÷ 5",
                    "Final answer: a = 4 m/s²",
                ],
            },
        ],
    },
};

// ── Module / lesson data ──────────────────────────────────────────────────────

const MODULES: Module[] = [
    {
        id: "math-m1",
        title: "Module 1: Algebraic Expressions",
        subject: "Mathematics",
        lessons: [
            { id: "math-m1-l1", title: "Expanding Brackets",   duration: "15 min", status: "completed" },
            { id: "math-m1-l2", title: "Factorisation",         duration: "20 min", status: "completed" },
            { id: "math-m1-l3", title: "Algebraic Fractions",   duration: "18 min", status: "completed" },
        ],
    },
    {
        id: "math-m2",
        title: "Module 2: Exponents",
        subject: "Mathematics",
        lessons: [
            { id: "math-m2-l1", title: "Laws of Exponents",                  duration: "20 min", status: "completed" },
            { id: "math-m2-l2", title: "Simplifying Exponential Expressions", duration: "25 min", status: "current" },
            { id: "math-m2-l3", title: "Solving Exponential Equations",       duration: "22 min", status: "locked" },
        ],
    },
    {
        id: "sci-m1",
        title: "Module 1: Motion & Kinematics",
        subject: "Physical Sciences",
        lessons: [
            { id: "sci-m1-l1", title: "Speed & Velocity",    duration: "18 min", status: "completed" },
            { id: "sci-m1-l2", title: "Acceleration",         duration: "20 min", status: "completed" },
            { id: "sci-m1-l3", title: "Equations of Motion",  duration: "25 min", status: "completed" },
        ],
    },
    {
        id: "sci-m2",
        title: "Module 2: Forces",
        subject: "Physical Sciences",
        lessons: [
            { id: "sci-m2-l1", title: "Newton's First Law",  duration: "15 min", status: "completed" },
            { id: "sci-m2-l2", title: "Newton's Second Law", duration: "20 min", status: "current" },
            { id: "sci-m2-l3", title: "Newton's Third Law",  duration: "18 min", status: "locked" },
        ],
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function statusTag(status: LessonStatus) {
    if (status === "completed")  return <Tag color="success">Completed</Tag>;
    if (status === "current")    return <Tag color="processing">In Progress</Tag>;
    return null;
}

// ── Detail view ───────────────────────────────────────────────────────────────

function LessonDetail({
    lessonId,
    onBack,
}: {
    lessonId: string;
    onBack: () => void;
}) {
    const { styles } = useStyles();
    const [aiOpen, setAiOpen] = useState(false);
    const content = LESSON_CONTENT[lessonId];

    if (!content) {
        return (
            <div>
                <Button type="link" icon={<LeftOutlined />} className={styles.backBtn} onClick={onBack}>
                    Back to Lessons
                </Button>
                <Text type="secondary">Lesson content coming soon.</Text>
            </div>
        );
    }

    return (
        <div className={styles.detailRoot}>
            {/* Main content */}
            <div className={styles.detailMain}>
                <div className={styles.breadcrumb}>
                    <Button
                        type="link"
                        icon={<LeftOutlined />}
                        className={styles.backBtn}
                        onClick={onBack}
                    />
                    <span>{content.breadcrumb}</span>
                </div>

                <h1 className={styles.lessonHeading}>{content.title}</h1>

                {content.sections.map((section, i) => {
                    if (section.type === "text") {
                        return (
                            <div key={i}>
                                <div className={styles.sectionTitle}>{section.heading}</div>
                                <p className={styles.sectionText}>{section.body}</p>
                            </div>
                        );
                    }
                    if (section.type === "highlight") {
                        return (
                            <div key={i} className={styles.highlightBox}>
                                <div className={styles.highlightLabel}>{section.label}</div>
                                <div className={styles.formula}>{section.formula}</div>
                            </div>
                        );
                    }
                    if (section.type === "example") {
                        return (
                            <div key={i}>
                                <div className={styles.sectionTitle}>{section.heading}</div>
                                <p className={styles.sectionText}>{section.intro}</p>
                                <div className={styles.exampleBox}>
                                    <ol className={styles.stepList}>
                                        {section.steps.map((step, si) => (
                                            <li key={si} className={styles.stepItem}>
                                                <span className={styles.stepNumber}>{si + 1}</span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}

                <div className={styles.detailFooter}>
                    <Button type="primary" icon={<RightOutlined />} iconPosition="end" className={styles.nextBtn}>
                        Next Lesson
                    </Button>
                </div>
            </div>

            {/* Right sidebar */}
            <div className={styles.progressPanel}>
                <Card title="Topic Progress" className={styles.progressCard}>
                    <div className={styles.completionRow}>
                        <span>Module Completion</span>
                        <span>{content.moduleCompletion} %</span>
                    </div>
                    <Progress
                        percent={content.moduleCompletion}
                        showInfo={false}
                        strokeColor="#00b8a9"
                        size="small"
                    />

                    <div className={styles.topicList}>
                        {content.topics.map((topic) => (
                            <div key={topic.name} className={styles.topicItem}>
                                {topic.status === "completed" && (
                                    <div className={styles.topicDotCompleted}>
                                        <CheckOutlined />
                                    </div>
                                )}
                                {topic.status === "current" && (
                                    <div className={styles.topicDotCurrent}>
                                        <div className={styles.topicDotCurrentInner} />
                                    </div>
                                )}
                                {topic.status === "locked" && (
                                    <div className={styles.topicDotLocked} />
                                )}
                                <span
                                    className={
                                        topic.status === "current"
                                            ? styles.topicNameCurrent
                                            : styles.topicNameOther
                                    }
                                >
                                    {topic.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className={styles.aiCard}>
                    <MessageOutlined className={styles.aiIcon} />
                    <div className={styles.aiTitle}>Stuck on a concept?</div>
                    <div className={styles.aiSubtitle}>
                        Your AI tutor can explain this in isiZulu, Sesotho, or Afrikaans.
                    </div>
                    <Button type="link" className={styles.aiLink} onClick={() => setAiOpen(true)}>
                        Ask AI Tutor
                    </Button>
                </Card>

                <AiTutorDrawer
                    open={aiOpen}
                    onClose={() => setAiOpen(false)}
                    lessonTitle={content?.title}
                />
            </div>
        </div>
    );
}

// ── List view ─────────────────────────────────────────────────────────────────

function LessonList({ onSelect }: { onSelect: (id: string) => void }) {
    const { styles } = useStyles();

    return (
        <div>
            <div className={styles.pageHeader}>
                <Title level={2} style={{ marginBottom: 0 }}>Lessons</Title>
                <Text type="secondary">Your curriculum lessons by module</Text>
            </div>

            {MODULES.map((mod) => (
                <Card
                    key={mod.id}
                    title={
                        <span>
                            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
                                {mod.subject} &nbsp;·&nbsp;
                            </Text>
                            {mod.title}
                        </span>
                    }
                    className={styles.moduleCard}
                >
                    {mod.lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            className={styles.lessonRow}
                            onClick={() => lesson.status !== "locked" && onSelect(lesson.id)}
                        >
                            <div className={styles.lessonLeft}>
                                <div
                                    className={`${styles.lessonIcon} ${
                                        lesson.status === "completed"
                                            ? styles.lessonIconCompleted
                                            : lesson.status === "current"
                                            ? styles.lessonIconCurrent
                                            : styles.lessonIconLocked
                                    }`}
                                >
                                    {lesson.status === "completed" && <CheckCircleOutlined />}
                                    {lesson.status === "current"   && <PlayCircleOutlined />}
                                    {lesson.status === "locked"    && <LockOutlined />}
                                </div>
                                <div>
                                    <div className={`${styles.lessonTitle} lesson-title`}>
                                        {lesson.title}
                                    </div>
                                    <div className={styles.lessonMeta}>{lesson.duration}</div>
                                </div>
                            </div>
                            <div className={styles.lessonRight}>
                                {statusTag(lesson.status)}
                                {lesson.status !== "locked" && (
                                    <RightOutlined style={{ fontSize: 12, color: "#00b8a9" }} />
                                )}
                            </div>
                        </div>
                    ))}
                </Card>
            ))}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StudentLessonsPage() {
    const [activeLesson, setActiveLesson] = useState<string | null>(null);

    if (activeLesson) {
        return <LessonDetail lessonId={activeLesson} onBack={() => setActiveLesson(null)} />;
    }

    return <LessonList onSelect={setActiveLesson} />;
}
