"use client";

import {
    BookOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    PlayCircleOutlined,
    ReadOutlined,
    RiseOutlined,
    RobotOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Progress,
    Row,
    Tag,
    Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

const STATS = [
    {
        icon: TrophyOutlined,
        value: "78%",
        labelKey: "dashboard.student.dashboardPage.stats.overallProgressScore",
        badgeKey: "dashboard.student.dashboardPage.stats.badgeThisWeek",
    },
    {
        icon: CheckCircleOutlined,
        value: "12",
        labelKey: "dashboard.student.dashboardPage.stats.topicsMastered",
        badgeKey: "dashboard.student.dashboardPage.stats.badgeNew",
    },
    {
        icon: BookOutlined,
        value: "24",
        labelKey: "dashboard.student.dashboardPage.stats.lessonsCompleted",
        badgeKey: null,
    },
];

const QUIZ_RESULTS = [
    {
        nameKey: "dashboard.student.dashboardPage.quizResults.linearEquations",
        dateKey: "dashboard.student.dashboardPage.dates.today",
        score: 85,
    },
    {
        nameKey: "dashboard.student.dashboardPage.quizResults.cellStructure",
        dateKey: "dashboard.student.dashboardPage.dates.yesterday",
        score: 92,
    },
    {
        nameKey: "dashboard.student.dashboardPage.quizResults.chemicalBonding",
        dateKey: "dashboard.student.dashboardPage.dates.daysAgo3",
        score: 65,
    },
];

const UP_NEXT = [
    {
        titleKey: "dashboard.student.dashboardPage.upNext.reviewBiologyNotes",
        dueKey: "dashboard.student.dashboardPage.upNext.dueTomorrow",
    },
    {
        titleKey: "dashboard.student.dashboardPage.upNext.completePhysicsQuiz",
        dueKey: "dashboard.student.dashboardPage.upNext.dueFriday",
    },
];

function quizScoreColor(score: number) {
    if (score >= 80) return "#52c41a";
    if (score >= 65) return "#00b8a9";
    return "#fa8c16";
}

export default function StudentDashboardPage() {
    const { styles } = useStyles();
    const { t } = useTranslation();

    return (
        <div>
            {/* Welcome section */}
            <div className={styles.welcomeSection}>
                <div>
                    <Title level={2} className={styles.welcomeText}>
                        {t("dashboard.student.dashboardPage.welcomeTitle")}
                    </Title>
                    <Text type="secondary">
                        {t("dashboard.student.dashboardPage.welcomeSubtitle")}
                    </Text>
                </div>
                <Button
                    type="primary"
                    icon={<RobotOutlined />}
                    size="large"
                    className={styles.askAiBtn}
                >
                    {t("dashboard.student.dashboardPage.askAiTutor")}
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {/* Main content column */}
                <Col xs={24} lg={16}>
                    {/* Stat cards */}
                    <Row gutter={[16, 16]} className={styles.statsRow}>
                        {STATS.map(({ icon: Icon, value, labelKey, badgeKey }) => (
                            <Col key={labelKey} xs={24} md={8}>
                                <Card className={styles.statCard}>
                                    <div className={styles.statHeader}>
                                        <Icon className={styles.statIcon} />
                                        {badgeKey && (
                                            <span className={styles.statBadge}>
                                                <RiseOutlined /> {t(badgeKey)}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.statValue}>{value}</div>
                                    <div className={styles.statLabel}>{t(labelKey)}</div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Recommended next lesson */}
                    <Card
                        className={styles.nextLessonCard}
                        title={
                            <div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <span>{t("dashboard.student.dashboardPage.recommendedNextLesson")}</span>
                                    <Tag color="cyan">{t("dashboard.student.dashboardPage.mathsGrade10")}</Tag>
                                </div>
                                <div className={styles.nextLessonSubtitle}>
                                    {t("dashboard.student.dashboardPage.nextLessonSubtitle")}
                                </div>
                            </div>
                        }
                    >
                        <div className={styles.nextLessonBody}>
                            <div className={styles.lessonThumbnail}>
                                <ReadOutlined />
                            </div>
                            <div className={styles.lessonInfo}>
                                <Text className={styles.lessonTitle}>
                                    {t("dashboard.student.dashboardPage.algebraicExpressionsLesson")}
                                </Text>
                                <Text className={styles.lessonDesc}>
                                    {t("dashboard.student.dashboardPage.lessonDescription")}
                                </Text>
                                <div className={styles.lessonActions}>
                                    <Button
                                        type="primary"
                                        icon={<PlayCircleOutlined />}
                                        className={styles.startBtn}
                                    >
                                        {t("dashboard.student.dashboardPage.startLesson")}
                                    </Button>
                                    <span className={styles.durationText}>
                                        <ClockCircleOutlined /> {t("dashboard.student.dashboardPage.lessonDuration")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Mastery heatmap */}
                    <Card
                        className={styles.heatmapCard}
                        title={
                            <div>
                                <div>{t("dashboard.student.dashboardPage.masteryHeatmap")}</div>
                                <div className={styles.heatmapSubtitle}>
                                    {t("dashboard.student.dashboardPage.performanceAcrossSubjects")}
                                </div>
                            </div>
                        }
                    >
                        <div className={styles.heatmapPlaceholder}>
                            {t("dashboard.student.dashboardPage.heatmapPlaceholder")}
                        </div>
                        <div className={styles.heatmapLegend}>
                            <span>{t("dashboard.student.dashboardPage.needsWork")}</span>
                            <div className={styles.legendDots}>
                                {["#ffd6cc", "#ffd666", "#d4f5a1", "#00b8a9"].map((color) => (
                                    <div
                                        key={color}
                                        style={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: 3,
                                            background: color,
                                        }}
                                    />
                                ))}
                            </div>
                            <span>{t("dashboard.student.dashboardPage.mastered")}</span>
                        </div>
                    </Card>
                </Col>

                {/* Right sidebar */}
                <Col xs={24} lg={8}>
                    {/* Recent quiz results */}
                    <Card className={styles.quizCard} title={t("dashboard.student.dashboardPage.recentQuizResults")}>
                        {QUIZ_RESULTS.map(({ nameKey, dateKey, score }) => (
                            <div key={nameKey} className={styles.quizItem}>
                                <div className={styles.quizHeader}>
                                    <span className={styles.quizName}>{t(nameKey)}</span>
                                    <span
                                        className={styles.quizScore}
                                        style={{ color: quizScoreColor(score) }}
                                    >
                                        {score}%
                                    </span>
                                </div>
                                <div className={styles.quizDate}>{t(dateKey)}</div>
                                <Progress
                                    percent={score}
                                    showInfo={false}
                                    strokeColor={quizScoreColor(score)}
                                    size="small"
                                    style={{ marginTop: 6 }}
                                />
                            </div>
                        ))}
                        <Button type="link" className={styles.viewAllLink} style={{ padding: 0, marginTop: 8 }}>
                            {t("dashboard.student.dashboardPage.viewAllResults")}
                        </Button>
                    </Card>

                    {/* Up next */}
                    <Card className={styles.upNextCard} title={t("dashboard.student.dashboardPage.upNextTitle")}>
                        {UP_NEXT.map(({ titleKey, dueKey }) => (
                            <div key={titleKey} className={styles.upNextItem}>
                                <CheckCircleOutlined className={styles.upNextIcon} />
                                <div className={styles.upNextInfo}>
                                    <span className={styles.upNextTitle}>{t(titleKey)}</span>
                                    <span className={styles.upNextDue}>{t(dueKey)}</span>
                                </div>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
