"use client";

import {
    BookOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    FireOutlined,
    ReloadOutlined,
    PlayCircleOutlined,
    ReadOutlined,
    ThunderboltOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Button,
    Card,
    Col,
    Empty,
    Flex,
    Pagination,
    Row,
    Space,
    Typography,
} from "antd";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DashboardPageSkeleton } from "@/components/layout";
import { useStudentDashboard } from "@/providers/student";
import { useStyles } from "./styles";
import { getLocalizedAttentionAction, getLocalizedGuidanceMessage } from "./localization";

const { Text, Title } = Typography;
const HEATMAP_PAGE_SIZE = 12;
const ATTENTION_PAGE_SIZE = 5;

const getHeatmapTileClassName = (
    severityBucket: "strong" | "moderate" | "weak" | "critical"
): "heatStrongTile" | "heatModerateTile" | "heatWeakTile" | "heatCriticalTile" => {
    if (severityBucket === "strong") {
        return "heatStrongTile";
    }

    if (severityBucket === "moderate") {
        return "heatModerateTile";
    }

    if (severityBucket === "weak") {
        return "heatWeakTile";
    }

    return "heatCriticalTile";
};

export default function StudentDashboardPage() {
    const { styles } = useStyles();
    const { t, i18n } = useTranslation();
    const { state, actions } = useStudentDashboard();
    const [heatmapPage, setHeatmapPage] = useState(1);
    const [attentionPage, setAttentionPage] = useState(1);

    const dashboardData = state.data;
    const isEnglishLanguage = i18n.resolvedLanguage?.startsWith("en") ?? false;
    const welcomeName = dashboardData?.studentName || t("sidebar.student");
    const guidanceMessage = dashboardData
        ? (isEnglishLanguage && dashboardData.guidance?.baseMessage
            ? dashboardData.guidance.baseMessage
            : getLocalizedGuidanceMessage(dashboardData.overallScore, t))
        : "";

    const heatmapTotal = dashboardData?.masteryHeatmap.length ?? 0;
    const heatmapTotalPages = Math.max(1, Math.ceil(heatmapTotal / HEATMAP_PAGE_SIZE));
    const currentHeatmapPage = Math.min(heatmapPage, heatmapTotalPages);
    const attentionTotal = dashboardData?.areasNeedingAttention.length ?? 0;
    const attentionTotalPages = Math.max(1, Math.ceil(attentionTotal / ATTENTION_PAGE_SIZE));
    const currentAttentionPage = Math.min(attentionPage, attentionTotalPages);

    const pagedHeatmap = useMemo(() => {
        if (!dashboardData) {
            return [];
        }

        const startIndex = (currentHeatmapPage - 1) * HEATMAP_PAGE_SIZE;
        const endIndex = startIndex + HEATMAP_PAGE_SIZE;
        return dashboardData.masteryHeatmap.slice(startIndex, endIndex);
    }, [currentHeatmapPage, dashboardData]);

    const pagedAttention = useMemo(() => {
        if (!dashboardData) {
            return [];
        }

        const startIndex = (currentAttentionPage - 1) * ATTENTION_PAGE_SIZE;
        const endIndex = startIndex + ATTENTION_PAGE_SIZE;
        return dashboardData.areasNeedingAttention.slice(startIndex, endIndex);
    }, [currentAttentionPage, dashboardData]);

    const summaryCards = [
        {
            key: "overall",
            icon: TrophyOutlined,
            label: t("dashboard.student.dashboardPage.stats.overallProgressScore"),
            value: `${Math.round(dashboardData?.overallScore ?? 0)}%`,
        },
        {
            key: "mastered",
            icon: CheckCircleOutlined,
            label: t("dashboard.student.dashboardPage.stats.topicsMastered"),
            value: `${dashboardData?.topicsMastered ?? 0}/${dashboardData?.totalTopics ?? 0}`,
        },
        {
            key: "completed",
            icon: BookOutlined,
            label: t("dashboard.student.dashboardPage.stats.lessonsCompleted"),
            value: `${dashboardData?.lessonsCompleted ?? 0}`,
        },
        {
            key: "attention",
            icon: ExclamationCircleOutlined,
            label: t("dashboard.student.dashboardPage.areasNeedingAttention"),
            value: `${dashboardData?.areasNeedingAttentionCount ?? 0}`,
        },
    ];

    if (state.isLoading) {
        return (
            <div className={styles.loadingState}>
                <DashboardPageSkeleton cardCount={4} />
            </div>
        );
    }

    if (state.error) {
        return (
            <div className={styles.errorState}>
                <Alert
                    message={t("dashboard.student.dashboardPage.loadErrorTitle")}
                    description={state.error}
                    type="error"
                    showIcon
                    action={(
                        <Button size="small" icon={<ReloadOutlined />} onClick={actions.fetchDashboard}>
                            {t("dashboard.student.dashboardPage.retry")}
                        </Button>
                    )}
                />
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className={styles.emptyState}>
                <Empty
                    description={t("dashboard.student.dashboardPage.noDashboardData")}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button type="primary" onClick={actions.fetchDashboard}>
                        {t("dashboard.student.dashboardPage.loadDashboard")}
                    </Button>
                </Empty>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.welcomeSection}>
                <div>
                    <Title level={2} className={styles.welcomeText}>
                        {t("dashboard.student.dashboardPage.welcomeTitle", { name: welcomeName })}
                    </Title>
                    <Text type="secondary">
                        {guidanceMessage || t("dashboard.student.dashboardPage.welcomeSubtitle")}
                    </Text>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Row gutter={[16, 16]} className={styles.statsRow}>
                        {summaryCards.map(({ key, icon: Icon, value, label }) => (
                            <Col key={key} xs={24} md={12}>
                                <Card className={styles.statCard}>
                                    <div className={styles.statHeaderRow}>
                                        <Icon className={styles.statIcon} />
                                    </div>
                                    <div className={styles.statValue}>{value}</div>
                                    <div className={styles.statLabel}>{label}</div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Card
                        className={styles.nextLessonCard}
                        title={
                            <Space direction="vertical" size={0}>
                                <span>{t("dashboard.student.dashboardPage.recommendedNextLesson")}</span>
                                <Text className={styles.nextLessonSubtitle}>
                                    {dashboardData.recommendedNextLesson?.subjectName || dashboardData.gradeLevel || t("dashboard.student.dashboardPage.allSubjects")}
                                </Text>
                            </Space>
                        }
                    >
                        {dashboardData.recommendedNextLesson ? (
                            <div className={styles.nextLessonBody}>
                                <div className={styles.lessonThumbnail}>
                                    <ReadOutlined />
                                </div>
                                <div className={styles.lessonInfo}>
                                    <Text className={styles.lessonTitle}>{dashboardData.recommendedNextLesson.title}</Text>
                                    <Text className={styles.lessonDesc}>{dashboardData.recommendedNextLesson.ruleBasisReason}</Text>
                                    <Flex align="center" gap={12} wrap>
                                        <Button type="primary" icon={<PlayCircleOutlined />} className={styles.startBtn}>
                                            {t("dashboard.student.dashboardPage.startLesson")}
                                        </Button>
                                        <span className={styles.durationText}>
                                            <ClockCircleOutlined /> {dashboardData.recommendedNextLesson.estimatedMinutes} mins
                                        </span>
                                    </Flex>
                                </div>
                            </div>
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("dashboard.student.dashboardPage.noLessonRecommendation")} />
                        )}
                    </Card>

                    <Card
                        className={styles.heatmapCard}
                        title={
                            <Space direction="vertical" size={0}>
                                <span>{t("dashboard.student.dashboardPage.masteryHeatmap")}</span>
                                <Text className={styles.heatmapSubtitle}>
                                    {t("dashboard.student.dashboardPage.performanceAcrossSubjects")}
                                </Text>
                            </Space>
                        }
                    >
                        {dashboardData.masteryHeatmap.length === 0 ? (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("dashboard.student.dashboardPage.noTopicMasteryData")} />
                        ) : (
                            <>
                                <div className={styles.heatmapGrid}>
                                    {pagedHeatmap.map((item) => (
                                        <div
                                            key={item.topicId}
                                            className={`${styles.heatmapTile} ${styles[getHeatmapTileClassName(item.severityBucket)]}`}
                                        >
                                            <span className={styles.heatmapPercent}>{Math.round(item.masteryPercent)}%</span>
                                            <span className={styles.heatmapTopic}>{item.topicName}</span>
                                            <span className={styles.heatmapSubject}>{item.subjectName}</span>
                                        </div>
                                    ))}
                                </div>

                                {dashboardData.masteryHeatmap.length > HEATMAP_PAGE_SIZE ? (
                                    <div className={styles.heatmapPagination}>
                                        <Pagination
                                            current={currentHeatmapPage}
                                            pageSize={HEATMAP_PAGE_SIZE}
                                            total={dashboardData.masteryHeatmap.length}
                                            onChange={setHeatmapPage}
                                            size="small"
                                            showSizeChanger={false}
                                        />
                                    </div>
                                ) : null}
                            </>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card className={styles.attentionCard} title={t("dashboard.student.dashboardPage.areasNeedingAttention")}>
                        {dashboardData.areasNeedingAttention.length === 0 ? (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("dashboard.student.dashboardPage.noWeakTopics")} />
                        ) : (
                            <div>
                                <Space direction="vertical" size={12} className={styles.attentionList}>
                                    {pagedAttention.map((topic) => (
                                        <div key={topic.topicId} className={styles.attentionItem}>
                                            <div className={styles.attentionHeader}>
                                                <Text className={styles.attentionTitle}>{topic.topicName}</Text>
                                                <Text className={styles.attentionPercent}>{Math.round(topic.masteryPercent)}%</Text>
                                            </div>
                                            <Text className={styles.attentionMeta}>{topic.subjectName || t("dashboard.student.dashboardPage.allSubjects")}</Text>
                                            <Text className={styles.attentionDesc}>
                                                {getLocalizedAttentionAction(topic.masteryPercent, topic.ruleBasisAction, t, isEnglishLanguage)}
                                            </Text>
                                        </div>
                                    ))}
                                </Space>

                                {dashboardData.areasNeedingAttention.length > ATTENTION_PAGE_SIZE ? (
                                    <div className={styles.attentionPagination}>
                                        <Pagination
                                            current={currentAttentionPage}
                                            pageSize={ATTENTION_PAGE_SIZE}
                                            total={dashboardData.areasNeedingAttention.length}
                                            onChange={setAttentionPage}
                                            size="small"
                                            showSizeChanger={false}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </Card>

                    <Card className={styles.guidanceCard}>
                        <Space align="start" size={10}>
                            <ThunderboltOutlined className={styles.guidanceIcon} />
                            <div>
                                <Text className={styles.guidanceTitle}>{t("dashboard.student.dashboardPage.motivationalGuidanceTitle")}</Text>
                                <Text className={styles.guidanceText}>
                                    {guidanceMessage || t("dashboard.student.dashboardPage.motivationalGuidanceFallback")}
                                </Text>
                            </div>
                        </Space>
                    </Card>

                    <Card className={styles.completedCard} title={t("dashboard.student.progressPage.completedLessons")}>
                        {dashboardData.lessonsCompleted > 0 ? (
                            <Space direction="vertical" className={styles.fullWidth} size={8}>
                                <div className={styles.completedRow}>
                                    <FireOutlined className={styles.completedIcon} />
                                    <Text>{t("dashboard.student.dashboardPage.completedLessonsSummary", { count: dashboardData.lessonsCompleted })}</Text>
                                </div>
                                <Button icon={<ReloadOutlined />} onClick={actions.fetchDashboard}>
                                    {t("dashboard.student.dashboardPage.refreshProgress")}
                                </Button>
                            </Space>
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("dashboard.student.dashboardPage.noCompletedLessons")} />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
