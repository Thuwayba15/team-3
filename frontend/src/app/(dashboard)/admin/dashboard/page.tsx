"use client";

import { CheckCircleOutlined, GlobalOutlined, TeamOutlined } from "@ant-design/icons";
import { Alert, Card, Col, Progress, Row, Skeleton, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { adminDashboardService, type IAdminDashboardSummary } from "@/services/admin/adminDashboardService";
import { useStyles } from "./styles";

const { Text } = Typography;

const METRIC_ICONS = {
    "total-users": TeamOutlined,
    "active-users": CheckCircleOutlined,
    "supported-languages": GlobalOutlined,
} as const;

export default function AdminDashboardPage() {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const [summary, setSummary] = useState<IAdminDashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        adminDashboardService.getSummary()
            .then((nextSummary) => setSummary(nextSummary))
            .catch(() => setError(t("dashboard.admin.errorLoadDashboard")))
            .finally(() => setLoading(false));
    }, [t]);

    return (
        <div>
            <PageHeader title={t("dashboard.admin.title")} subtitle={t("dashboard.admin.subtitle")} />

            {error ? <Alert type="error" message={error} className={styles.errorAlert} /> : null}

            <Row gutter={[16, 16]} className={styles.statsRow}>
                {(summary?.metrics ?? Array.from({ length: 3 })).map((metric, index) => {
                    const Icon = metric ? METRIC_ICONS[metric.key as keyof typeof METRIC_ICONS] ?? TeamOutlined : TeamOutlined;

                    return (
                        <Col key={metric?.key ?? index} xs={24} sm={12} lg={8}>
                            <Card className={styles.statCard}>
                                {loading || !metric ? (
                                    <Skeleton active paragraph={{ rows: 2 }} title={false} />
                                ) : (
                                    <>
                                        <div className={styles.statHeader}>
                                            <Icon className={styles.statIcon} />
                                            {metric.helperText ? <span className={styles.helperBadge}>{metric.helperText}</span> : null}
                                        </div>
                                        <div className={styles.statValue}>{metric.value}</div>
                                        <div className={styles.statLabel}>{metric.label}</div>
                                    </>
                                )}
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <Card title={t("dashboard.admin.userDistributionByRole")} className={styles.chartCard}>
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 5 }} title={false} />
                        ) : summary && summary.roleDistribution.length > 0 ? (
                            <div className={styles.progressList}>
                                {summary.roleDistribution.map((role) => (
                                    <div key={role.roleName} className={styles.progressItem}>
                                        <div className={styles.progressHeader}>
                                            <span>{role.roleName}</span>
                                            <span>{`${role.count} users`}</span>
                                        </div>
                                        <Progress percent={role.percent} showInfo={false} className={styles.progress} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <Text type="secondary">{t("empty.noData")}</Text>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
