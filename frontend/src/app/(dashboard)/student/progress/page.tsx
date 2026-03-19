"use client";

import {
    BookOutlined,
    CheckCircleOutlined,
    FireOutlined,
    TrophyOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useStyles } from "./styles";

const { Title, Text } = Typography;

// ── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
    { icon: TrophyOutlined,      iconColor: "#00b8a9", value: "78%",    labelKey: "dashboard.student.progressPage.stats.overallScore" },
    { icon: BookOutlined,        iconColor: "#00b8a9", value: "12/20",  labelKey: "dashboard.student.progressPage.stats.topicsMastered" },
    { icon: CheckCircleOutlined, iconColor: "#00b8a9", value: "18/22",  labelKey: "dashboard.student.progressPage.stats.quizzesPassed" },
    { icon: FireOutlined,        iconColor: "#fa8c16", value: "5 days", labelKey: "dashboard.student.progressPage.stats.studyStreak" },
];

const heatColor = (pct: number) => {
    if (pct >= 70) return "#00b8a9";
    if (pct >= 50) return "#fadb14";
    if (pct >= 35) return "#ffa940";
    return "#ff7875";
};

const HEATMAP = [
    { labelKey: "dashboard.student.progressPage.heatmap.expandingBrackets", percent: 90 },
    { labelKey: "dashboard.student.progressPage.heatmap.factorisation", percent: 85 },
    { labelKey: "dashboard.student.progressPage.heatmap.algebraicFractions", percent: 70 },
    { labelKey: "dashboard.student.progressPage.heatmap.exponents", percent: 60 },
    { labelKey: "dashboard.student.progressPage.heatmap.numberPatterns", percent: 45 },
    { labelKey: "dashboard.student.progressPage.heatmap.equations", percent: 40 },
    { labelKey: "dashboard.student.progressPage.heatmap.geometry", percent: 30 },
    { labelKey: "dashboard.student.progressPage.heatmap.dataHandling", percent: 20 },
];

const LESSONS = [
    {
        titleKey: "dashboard.student.progressPage.lessons.introductionToExponents",
        timeKey: "dashboard.student.progressPage.dates.today",
        score: "95%",
    },
    {
        titleKey: "dashboard.student.progressPage.lessons.factorisingTrinomials",
        timeKey: "dashboard.student.progressPage.dates.yesterday",
        score: "88%",
    },
    {
        titleKey: "dashboard.student.progressPage.lessons.differenceOfTwoSquares",
        timeKey: "dashboard.student.progressPage.dates.daysAgo2",
        score: "92%",
    },
];

const QUIZZES = [
    {
        titleKey: "dashboard.student.progressPage.quizzes.exponentsQuiz1",
        metaKey: "dashboard.student.progressPage.quizzes.exponentsQuiz1Meta",
        pass: true,
    },
    {
        titleKey: "dashboard.student.progressPage.quizzes.factorisationTest",
        metaKey: "dashboard.student.progressPage.quizzes.factorisationTestMeta",
        pass: true,
    },
    {
        titleKey: "dashboard.student.progressPage.quizzes.algebraicFractions",
        metaKey: "dashboard.student.progressPage.quizzes.algebraicFractionsMeta",
        pass: false,
    },
];

const ATTENTION = [
    {
        titleKey: "dashboard.student.progressPage.attention.geometryTitle",
        descKey: "dashboard.student.progressPage.attention.geometryDesc",
    },
    {
        titleKey: "dashboard.student.progressPage.attention.dataHandlingTitle",
        descKey: "dashboard.student.progressPage.attention.dataHandlingDesc",
    },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function StudentProgressPage() {
    const { styles } = useStyles();
    const { t } = useTranslation();

    return (
        <div>
            {/* Header */}
            <div className={styles.pageHeader}>
                <Title level={2} style={{ marginBottom: 0 }}>{t("dashboard.student.progressPage.title")}</Title>
                <Text type="secondary">{t("dashboard.student.progressPage.subtitle")}</Text>
            </div>

            {/* Stat cards */}
            <Row gutter={[16, 16]} className={styles.statsRow}>
                {STATS.map(({ icon: Icon, iconColor, value, labelKey }) => (
                    <Col key={labelKey} xs={12} md={6}>
                        <Card className={styles.statCard}>
                            <Icon className={styles.statIcon} style={{ color: iconColor }} />
                            <div className={styles.statValue}>{value}</div>
                            <div className={styles.statLabel}>{t(labelKey)}</div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Mastery heatmap */}
            <Card title={t("dashboard.student.progressPage.masteryHeatmap")} className={styles.sectionCard}>
                <div className={styles.sectionSubtitle}>{t("dashboard.student.progressPage.performanceAcrossTopics")}</div>
                <div className={styles.heatmapGrid}>
                    {HEATMAP.map(({ labelKey, percent }) => (
                        <div
                            key={labelKey}
                            className={styles.heatmapTile}
                            style={{ background: heatColor(percent) }}
                        >
                            <span className={styles.heatmapPercent}>{percent} %</span>
                            <span className={styles.heatmapLabel}>{t(labelKey)}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Performance over time */}
            <Card title={t("dashboard.student.progressPage.performanceOverTime")} className={styles.sectionCard}>
                <div className={styles.chartPlaceholder}>
                    {t("dashboard.student.progressPage.performanceGraphPlaceholder")}
                </div>
            </Card>

            {/* Completed lessons + Quiz history */}
            <Row gutter={[16, 16]} className={styles.bottomRow}>
                <Col xs={24} md={12}>
                    <Card title={t("dashboard.student.progressPage.completedLessons")} className={styles.listCard}>
                        {LESSONS.map(({ titleKey, timeKey, score }) => (
                            <div key={titleKey} className={styles.lessonItem}>
                                <div className={styles.lessonInfo}>
                                    <span className={styles.lessonTitle}>{t(titleKey)}</span>
                                    <span className={styles.lessonTime}>{t(timeKey)}</span>
                                </div>
                                <span className={styles.lessonScore}>{score}</span>
                            </div>
                        ))}
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title={t("dashboard.student.progressPage.quizHistory")} className={styles.listCard}>
                        {QUIZZES.map(({ titleKey, metaKey, pass }) => (
                            <div key={titleKey} className={styles.quizItem}>
                                <div className={styles.quizInfo}>
                                    <span className={styles.quizTitle}>{t(titleKey)}</span>
                                    <span className={styles.quizMeta}>{t(metaKey)}</span>
                                </div>
                                <Tag color={pass ? "success" : "error"}>
                                    {pass ? t("dashboard.student.progressPage.pass") : t("dashboard.student.progressPage.fail")}
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
                        {t("dashboard.student.progressPage.attention.title")}
                    </span>
                }
                className={styles.attentionCard}
            >
                {ATTENTION.map(({ titleKey, descKey }) => (
                    <div key={titleKey} className={styles.attentionItem}>
                        <Text className={styles.attentionTitle}>{t(titleKey)}</Text>
                        <Text className={styles.attentionDesc}>{t(descKey)}</Text>
                    </div>
                ))}
            </Card>
        </div>
    );
}
