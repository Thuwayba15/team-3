"use client";

import { CheckCircleOutlined, GlobalOutlined, LoginOutlined, TeamOutlined } from "@ant-design/icons";
import { Alert, Card, Col, List, Progress, Row, Skeleton, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { adminDashboardService, type IAdminDashboardSummary } from "@/services/admin/adminDashboardService";
import { useStyles } from "./styles";

const { Text } = Typography;

const METRIC_ICONS = {
    "total-users": TeamOutlined,
    "active-users": CheckCircleOutlined,
    "recent-sign-ins": LoginOutlined,
    "supported-languages": GlobalOutlined,
} as const;

function formatDateTime(value: string): string {
    return new Intl.DateTimeFormat("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

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
                {(summary?.metrics ?? Array.from({ length: 4 })).map((metric, index) => {
                    const Icon = metric ? METRIC_ICONS[metric.key as keyof typeof METRIC_ICONS] ?? TeamOutlined : TeamOutlined;

                    return (
                        <Col key={metric?.key ?? index} xs={24} sm={12} lg={6}>
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
                <Col xs={24} lg={14}>
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

                <Col xs={24} lg={10}>
                    <Card title={t("dashboard.admin.recentLogins")} className={styles.chartCard}>
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 5 }} title={false} />
                        ) : summary && summary.recentLogins.length > 0 ? (
                            <List
                                dataSource={summary.recentLogins}
                                renderItem={(item) => (
                                    <List.Item className={styles.loginItem}>
                                        <div className={styles.loginMeta}>
                                            <Text strong>{item.fullName}</Text>
                                            <Text type="secondary">{item.emailAddress}</Text>
                                        </div>
                                        <div className={styles.loginMetaRight}>
                                            <Tag>{item.roleName}</Tag>
                                            <Text type="secondary">{formatDateTime(item.lastLoginTime)}</Text>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <div className={styles.emptyState}>
                                <Text type="secondary">{t("dashboard.admin.noRecentLogins")}</Text>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
