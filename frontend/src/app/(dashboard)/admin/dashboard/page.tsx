"use client";

import { BookOutlined, RobotOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Card, Col, Row, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { adminService, type IAdminDashboardSummary } from "@/services/admin/adminService";
import { useStyles } from "./styles";

const { Text } = Typography;

export default function AdminDashboardPage() {
    const { styles } = useStyles();
    const [summary, setSummary] = useState<IAdminDashboardSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getDashboardSummary()
            .then(setSummary)
            .catch(() => setError("Could not load the admin dashboard summary."))
            .finally(() => setLoading(false));
    }, []);

    const cards = [
        { icon: UserOutlined, label: "Administrators", value: summary?.adminCount ?? 0 },
        { icon: TeamOutlined, label: "Students", value: summary?.studentCount ?? 0 },
        { icon: BookOutlined, label: "Life Sciences Topics", value: summary?.lifeSciencesTopicCount ?? 0 },
        { icon: RobotOutlined, label: "Life Sciences Lessons", value: summary?.lifeSciencesLessonCount ?? 0 },
    ];

    return (
        <div>
            <PageHeader title="Admin Dashboard" subtitle="Live MVP summary for users, curriculum, and AI readiness." />

            {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

            <Spin spinning={loading}>
                <Row gutter={[16, 16]} className={styles.statsRow}>
                    {cards.map(({ icon: Icon, label, value }) => (
                        <Col key={label} xs={24} sm={12} lg={6}>
                            <Card className={styles.statCard}>
                                <div className={styles.statHeader}>
                                    <Icon className={styles.statIcon} />
                                </div>
                                <div className={styles.statValue}>{value}</div>
                                <div className={styles.statLabel}>{label}</div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Card title="MVP Focus" className={styles.chartCard}>
                            <Text>Subject area: Life Sciences</Text>
                            <br />
                            <Text>Supported languages: English, isiZulu, Sesotho, Afrikaans</Text>
                            <br />
                            <Text>Active user roles: Admin, Student</Text>
                        </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Card title="AI Prompt Status" className={styles.chartCard}>
                            <Text type={summary?.promptConfigurationReady ? "success" : "warning"}>
                                {summary?.promptConfigurationReady
                                    ? "Prompt configuration is available for the frontend AI tutor."
                                    : "Prompt configuration still needs to be completed."}
                            </Text>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
}
