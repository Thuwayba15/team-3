"use client";

import {
    BookOutlined,
    CheckCircleOutlined,
    FireOutlined,
    TrophyOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Tag, Typography } from "antd";
import { useStyles } from "./styles";
// import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

// ── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
    { icon: TrophyOutlined,      iconColor: "#00b8a9", value: "78%",    label: "Overall Score" },
    { icon: BookOutlined,        iconColor: "#00b8a9", value: "12/20",  label: "Topics Mastered" },
    { icon: CheckCircleOutlined, iconColor: "#00b8a9", value: "18/22",  label: "Quizzes Passed" },
    { icon: FireOutlined,        iconColor: "#fa8c16", value: "5 days", label: "Study Streak" },
];

const heatColor = (pct: number) => {
    if (pct >= 70) return "#00b8a9";
    if (pct >= 50) return "#fadb14";
    if (pct >= 35) return "#ffa940";
    return "#ff7875";
};

const HEATMAP = [
    { label: "Expanding Brackets",  percent: 90 },
    { label: "Factorisation",        percent: 85 },
    { label: "Algebraic Fractions",  percent: 70 },
    { label: "Exponents",            percent: 60 },
    { label: "Number Patterns",      percent: 45 },
    { label: "Equations",            percent: 40 },
    { label: "Geometry",             percent: 30 },
    { label: "Data Handling",        percent: 20 },
];

const LESSONS = [
    { title: "Introduction to Exponents", time: "Today",      score: "95%" },
    { title: "Factorising Trinomials",     time: "Yesterday",  score: "88%" },
    { title: "Difference of Two Squares", time: "2 days ago", score: "92%" },
];

const QUIZZES = [
    { title: "Exponents Quiz 1",    meta: "Today · 11am · 9/10",     pass: true },
    { title: "Factorisation Test",  meta: "Yesterday · 11am · 8/10", pass: true },
    { title: "Algebraic Fractions", meta: "Last Week · 4/10",         pass: false },
];

const ATTENTION = [
    {
        title: "Geometry: Properties of Triangles",
        desc: "Current mastery: 30%. Recommended action: Review Lesson 4.",
    },
    {
        title: "Data Handling: Standard Deviation",
        desc: "Current mastery: 20%. Recommended action: Ask AI Tutor for examples.",
    },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function StudentProgressPage() {
    const { styles } = useStyles();

    return (
        <div>
            {/* Header */}
            <div className={styles.pageHeader}>
                <Title level={2} style={{ marginBottom: 0 }}>Your Progress</Title>
                <Text type="secondary">Track your learning journey and mastery levels</Text>
            </div>

            {/* Stat cards */}
            <Row gutter={[16, 16]} className={styles.statsRow}>
                {STATS.map(({ icon: Icon, iconColor, value, label }) => (
                    <Col key={label} xs={12} md={6}>
                        <Card className={styles.statCard}>
                            <Icon className={styles.statIcon} style={{ color: iconColor }} />
                            <div className={styles.statValue}>{value}</div>
                            <div className={styles.statLabel}>{label}</div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Mastery heatmap */}
            <Card title="Mastery Heatmap" className={styles.sectionCard}>
                <div className={styles.sectionSubtitle}>Your performance across all topics</div>
                <div className={styles.heatmapGrid}>
                    {HEATMAP.map(({ label, percent }) => (
                        <div
                            key={label}
                            className={styles.heatmapTile}
                            style={{ background: heatColor(percent) }}
                        >
                            <span className={styles.heatmapPercent}>{percent} %</span>
                            <span className={styles.heatmapLabel}>{label}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Performance over time */}
            <Card title="Performance Over Time" className={styles.sectionCard}>
                <div className={styles.chartPlaceholder}>
                    Performance Graph Visualisation Placeholder
                </div>
            </Card>

            {/* Completed lessons + Quiz history */}
            <Row gutter={[16, 16]} className={styles.bottomRow}>
                <Col xs={24} md={12}>
                    <Card title="Completed Lessons" className={styles.listCard}>
                        {LESSONS.map(({ title, time, score }) => (
                            <div key={title} className={styles.lessonItem}>
                                <div className={styles.lessonInfo}>
                                    <span className={styles.lessonTitle}>{title}</span>
                                    <span className={styles.lessonTime}>{time}</span>
                                </div>
                                <span className={styles.lessonScore}>{score}</span>
                            </div>
                        ))}
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="Quiz History" className={styles.listCard}>
                        {QUIZZES.map(({ title, meta, pass }) => (
                            <div key={title} className={styles.quizItem}>
                                <div className={styles.quizInfo}>
                                    <span className={styles.quizTitle}>{title}</span>
                                    <span className={styles.quizMeta}>{meta}</span>
                                </div>
                                <Tag color={pass ? "success" : "error"}>
                                    {pass ? "Pass" : "Fail"}
                                </Tag>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>

            {/* Areas needing attention */}
            <Card
                title={
                    <span>
                        <WarningOutlined style={{ color: "#faad14", marginRight: 8 }} />
                        Areas Needing Attention
                    </span>
                }
                className={styles.attentionCard}
            >
                {ATTENTION.map(({ title, desc }) => (
                    <div key={title} className={styles.attentionItem}>
                        <Text className={styles.attentionTitle}>{title}</Text>
                        <Text className={styles.attentionDesc}>{desc}</Text>
                    </div>
                ))}
            </Card>
        </div>
    );
}
