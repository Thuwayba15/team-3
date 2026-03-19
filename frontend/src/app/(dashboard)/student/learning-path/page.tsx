"use client";

import {
    CheckCircleFilled,
    LockOutlined,
    PlayCircleFilled,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Progress, Tag, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStyles } from "./styles";
import QuizView from "./QuizView";

const { Text } = Typography;

// ── Types ────────────────────────────────────────────────────────────────────

type TopicStatus = "completed" | "current" | "locked";

interface Topic {
    name: string;
    status: TopicStatus;
    subtitle?: string;
}

interface Module {
    title: string;
    description: string;
    status: "completed" | "in-progress" | "locked";
    progress?: number;
    topics: Topic[];
}

interface Subject {
    label: string;
    grade: string;
    overallProgress: number;
    modules: Module[];
}

// ── Static data ───────────────────────────────────────────────────────────────

const SUBJECTS: Record<string, Subject> = {
    Mathematics: {
        label: "Mathematics",
        grade: "Grade 10",
        overallProgress: 45,
        modules: [
            {
                title: "Module 1: Algebraic Expressions",
                description: "Products, factors, and algebraic fractions",
                status: "completed",
                topics: [
                    { name: "Expanding Brackets",    status: "completed" },
                    { name: "Factorisation",          status: "completed" },
                    { name: "Algebraic Fractions",    status: "completed" },
                ],
            },
            {
                title: "Module 2: Exponents",
                description: "Laws of exponents and exponential equations",
                status: "in-progress",
                progress: 60,
                topics: [
                    { name: "Laws of Exponents",                  status: "completed" },
                    {
                        name: "Simplifying Exponential Expressions",
                        status: "current",
                        subtitle: "Recommended Next Step",
                    },
                    { name: "Solving Exponential Equations",      status: "locked" },
                ],
            },
            {
                title: "Module 3: Number Patterns",
                description: "Linear patterns and general terms",
                status: "locked",
                topics: [],
            },
        ],
    },
    "Physical Sciences": {
        label: "Physical Sciences",
        grade: "Grade 10",
        overallProgress: 30,
        modules: [
            {
                title: "Module 1: Motion & Kinematics",
                description: "Describing and analysing motion",
                status: "completed",
                topics: [
                    { name: "Speed & Velocity",    status: "completed" },
                    { name: "Acceleration",        status: "completed" },
                    { name: "Equations of Motion", status: "completed" },
                ],
            },
            {
                title: "Module 2: Forces",
                description: "Newton's laws and applications",
                status: "in-progress",
                progress: 40,
                topics: [
                    { name: "Newton's First Law",  status: "completed" },
                    {
                        name: "Newton's Second Law",
                        status: "current",
                        subtitle: "Recommended Next Step",
                    },
                    { name: "Newton's Third Law",  status: "locked" },
                ],
            },
            {
                title: "Module 3: Energy",
                description: "Work, energy and power",
                status: "locked",
                topics: [],
            },
        ],
    },
    "Life Sciences": {
        label: "Life Sciences",
        grade: "Grade 10",
        overallProgress: 20,
        modules: [
            {
                title: "Module 1: Cell Biology",
                description: "Structure and function of cells",
                status: "in-progress",
                progress: 50,
                topics: [
                    { name: "Cell Structure", status: "completed" },
                    {
                        name: "Cell Organelles",
                        status: "current",
                        subtitle: "Recommended Next Step",
                    },
                    { name: "Cell Division", status: "locked" },
                ],
            },
            {
                title: "Module 2: Genetics",
                description: "Heredity and variation",
                status: "locked",
                topics: [],
            },
        ],
    },
    English: {
        label: "English",
        grade: "Grade 10",
        overallProgress: 65,
        modules: [
            {
                title: "Module 1: Reading Comprehension",
                description: "Understanding and analysing texts",
                status: "completed",
                topics: [
                    { name: "Identifying Main Ideas", status: "completed" },
                    { name: "Inference Skills",       status: "completed" },
                    { name: "Vocabulary in Context",  status: "completed" },
                ],
            },
            {
                title: "Module 2: Essay Writing",
                description: "Structuring and writing essays",
                status: "in-progress",
                progress: 70,
                topics: [
                    { name: "Paragraph Structure", status: "completed" },
                    {
                        name: "Argumentative Essays",
                        status: "current",
                        subtitle: "Recommended Next Step",
                    },
                    { name: "Narrative Writing", status: "locked" },
                ],
            },
            {
                title: "Module 3: Language Structures",
                description: "Grammar and language use",
                status: "locked",
                topics: [],
            },
        ],
    },
};

const SUBJECT_KEYS = Object.keys(SUBJECTS);

// ── Topic row component ───────────────────────────────────────────────────────

function TopicRow({
    topic,
    styles,
    onContinue,
}: {
    topic: Topic;
    styles: ReturnType<typeof useStyles>["styles"];
    onContinue: (topicName: string) => void;
}) {
    const { t } = useTranslation();

    if (topic.status === "locked") {
        return (
            <div className={styles.topicRow}>
                <div className={styles.topicLeft}>
                    <LockOutlined className={styles.topicIconLocked} />
                    <span className={styles.topicNameLocked}>{topic.name}</span>
                </div>
                <span className={styles.lockedTag}>{t("dashboard.student.learningPathPage.locked")}</span>
            </div>
        );
    }

    if (topic.status === "current") {
        return (
            <div className={styles.topicRowHighlighted}>
                <div className={styles.topicLeft}>
                    <PlayCircleFilled className={styles.topicIcon} />
                    <div>
                        <div className={styles.topicName}>{topic.name}</div>
                        {topic.subtitle && (
                            <div className={styles.topicSubtitle}>{topic.subtitle}</div>
                        )}
                    </div>
                </div>
                <Button
                    type="primary"
                    size="small"
                    className={styles.continueBtn}
                    onClick={() => onContinue(topic.name)}
                >
                    {t("dashboard.student.learningPathPage.continue")}
                </Button>
            </div>
        );
    }

    // completed
    return (
        <div className={styles.topicRow}>
            <div className={styles.topicLeft}>
                <CheckCircleOutlined className={styles.topicIcon} />
                <span className={styles.topicName}>{topic.name}</span>
            </div>
            <span className={styles.masteredTag}>{t("dashboard.student.learningPathPage.mastered")}</span>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StudentLearningPathPage() {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const [activeSubject, setActiveSubject] = useState("Mathematics");
    const [activeQuiz, setActiveQuiz] = useState<string | null>(null);

    const subject = SUBJECTS[activeSubject];

    if (activeQuiz) {
        return <QuizView topicName={activeQuiz} onExit={() => setActiveQuiz(null)} />;
    }

    return (
        <div>
            {/* Page header */}
            <div className={styles.pageHeader}>
                <div>
                    <Typography.Title level={2} style={{ marginBottom: 0 }}>
                        {t("dashboard.student.learningPathPage.title")}
                    </Typography.Title>
                    <Text type="secondary">{t("dashboard.student.learningPathPage.subtitle")}</Text>
                </div>

                <div className={styles.subjectTabs}>
                    {SUBJECT_KEYS.map((key) => (
                        <button
                            key={key}
                            className={`${styles.subjectTab} ${activeSubject === key ? styles.subjectTabActive : ""}`}
                            onClick={() => setActiveSubject(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </div>

            {/* Subject summary card */}
            <Card className={styles.subjectSummaryCard}>
                <div className={styles.subjectSummaryHeader}>
                    <div>
                        <h3 className={styles.subjectTitle}>
                            {subject.label} – {subject.grade}
                        </h3>
                    </div>
                    <div>
                        <div className={styles.masteredPercent}>{subject.overallProgress}%</div>
                        <div className={styles.masteredLabel}>{t("dashboard.student.learningPathPage.mastered")}</div>
                    </div>
                </div>
                <div className={styles.progressLabel}>{t("dashboard.student.learningPathPage.overallSubjectProgress")}</div>
                <Progress
                    percent={subject.overallProgress}
                    showInfo={false}
                    strokeColor="#00b8a9"
                />
            </Card>

            {/* Modules timeline */}
            <div className={styles.timeline}>
                {subject.modules.map((mod, idx) => {
                    const isLast = idx === subject.modules.length - 1;
                    const connectorClass =
                        mod.status === "completed"
                            ? styles.timelineConnectorActive
                            : styles.timelineConnector;

                    return (
                        <div key={mod.title} className={styles.timelineItem}>
                            {/* Left: dot + connector */}
                            <div className={styles.timelineLeft}>
                                {mod.status === "completed" && (
                                    <div className={styles.timelineDot}>
                                        <CheckCircleFilled />
                                    </div>
                                )}
                                {mod.status === "in-progress" && (
                                    <div className={styles.timelineDotInProgress}>
                                        <div className={styles.timelineDotInner} />
                                    </div>
                                )}
                                {mod.status === "locked" && (
                                    <div className={styles.timelineDotLocked}>
                                        <LockOutlined />
                                    </div>
                                )}
                                {!isLast && <div className={connectorClass} />}
                            </div>

                            {/* Right: module card */}
                            <div className={styles.timelineContent}>
                                <Card
                                    className={
                                        mod.status === "in-progress"
                                            ? styles.moduleCardActive
                                            : styles.moduleCard
                                    }
                                >
                                    {/* Module header */}
                                    <div className={styles.moduleHeader}>
                                        <div className={styles.moduleTitleRow}>
                                            <span className={styles.moduleTitle}>{mod.title}</span>
                                            {mod.status === "completed" && (
                                                <Tag color="success">{t("dashboard.student.learningPathPage.completed")}</Tag>
                                            )}
                                            {mod.status === "in-progress" && (
                                                <Tag color="processing">{t("dashboard.student.learningPathPage.inProgress")}</Tag>
                                            )}
                                            {mod.status === "locked" && <Tag>{t("dashboard.student.learningPathPage.locked")}</Tag>}
                                        </div>
                                        {mod.status === "completed" && (
                                            <Button type="link" className={styles.reviewLink}>
                                                {t("dashboard.student.learningPathPage.review")}
                                            </Button>
                                        )}
                                    </div>

                                    <div className={styles.moduleDesc}>{mod.description}</div>

                                    {/* Progress bar for in-progress */}
                                    {mod.status === "in-progress" && mod.progress !== undefined && (
                                        <div className={styles.moduleProgress}>
                                            <div className={styles.progressPercent}>{mod.progress} %</div>
                                            <Progress
                                                percent={mod.progress}
                                                showInfo={false}
                                                strokeColor="#00b8a9"
                                            />
                                        </div>
                                    )}

                                    {/* Topics */}
                                    {mod.topics.length > 0 && (
                                        <>
                                            {mod.status === "completed" ? (
                                                <div className={styles.topicGrid}>
                                                    {mod.topics.map((topic) => (
                                                        <div key={topic.name} className={styles.topicGridItem}>
                                                            <CheckCircleOutlined className={styles.topicIcon} />
                                                            <span>{topic.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className={styles.topicList}>
                                                    {mod.topics.map((topic) => (
                                                        <TopicRow
                                                            key={topic.name}
                                                            topic={topic}
                                                            styles={styles}
                                                            onContinue={setActiveQuiz}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </Card>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
