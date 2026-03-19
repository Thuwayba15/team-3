"use client";

import { ApiOutlined, GlobalOutlined, LineChartOutlined, TeamOutlined } from "@ant-design/icons";
import { Card, Col, Progress, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { useStyles } from "./styles";

const { Text } = Typography;

const STAT_CARDS = [
    { icon: TeamOutlined, value: "12,450", labelKey: "dashboard.admin.totalActiveUsers", trendKey: "dashboard.admin.trendThisMonth" },
    { icon: GlobalOutlined, value: "4", labelKey: "dashboard.admin.languageUsage" },
    { icon: ApiOutlined, value: "45.2k", labelKey: "dashboard.admin.aiApiCallsToday" },
    { icon: LineChartOutlined, value: "99.9%", labelKey: "dashboard.admin.systemUptime" },
];

const LANGUAGE_STATS = [
    { label: "English", percent: 55 },
    { label: "IsiZulu", percent: 25 },
    { label: "Sesotho", percent: 12 },
    { label: "Afrikaans", percent: 8 },
];

const ROLE_LEGEND = [
    { labelKey: "dashboard.admin.legendStudents", dotClassName: "legendDotPrimary" as const },
    { labelKey: "dashboard.admin.legendTutors", dotClassName: "legendDotInfo" as const },
    { labelKey: "dashboard.admin.legendParents", dotClassName: "legendDotWarning" as const },
];

/** Admin dashboard — system overview with key platform metrics. */
export default function AdminDashboardPage() {
    const { styles } = useStyles();
    const { t } = useTranslation();

    return (
        <div>
            <PageHeader title={t("dashboard.admin.title")} subtitle={t("dashboard.admin.subtitle")} />

            <Row gutter={[16, 16]} className={styles.statsRow}>
                {STAT_CARDS.map(({ icon: Icon, value, labelKey, trendKey }) => (
                    <Col key={labelKey} xs={24} sm={12} lg={6}>
                        <Card className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <Icon className={styles.statIcon} />
                                {trendKey && <span className={styles.trendBadge}>↗ {t(trendKey)}</span>}
                            </div>
                            <div className={styles.statValue}>{value}</div>
                            <div className={styles.statLabel}>{t(labelKey)}</div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                    <Card title={t("dashboard.admin.userDistributionByRole")} className={styles.chartCard}>
                        <div className={styles.piePlaceholder}>
                            <Text type="secondary">{t("dashboard.admin.pieChartPlaceholder")}</Text>
                        </div>
                        <div className={styles.legend}>
                            {ROLE_LEGEND.map(({ labelKey, dotClassName }) => (
                                <span key={labelKey} className={styles.legendItem}>
                                    <span className={`${styles.legendDot} ${styles[dotClassName]}`} />
                                    {t(labelKey)}
                                </span>
                            ))}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card title={t("dashboard.admin.languagePreferenceAnalytics")} className={styles.chartCard}>
                        <div className={styles.progressList}>
                            {LANGUAGE_STATS.map(({ label, percent }) => (
                                <div key={label} className={styles.progressItem}>
                                    <div className={styles.progressHeader}>
                                        <span>{label}</span>
                                        <span>{percent}%</span>
                                    </div>
                                    <Progress percent={percent} showInfo={false} className={styles.progress} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
