"use client";

import { Alert, Button, Card, Col, List, Row, Space, Statistic, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { tutorService, type TutorDashboardData, type TutorSetupStatus } from "@/services/tutoring/tutorService";

const { Paragraph, Text } = Typography;

function getLocalizedTutorStatus(status: string, t: (key: string) => string): string {
    const normalizedStatus = status.trim().toLowerCase();

    if (normalizedStatus === "pending") {
        return t("tutoring.status.pending");
    }

    if (normalizedStatus === "accepted") {
        return t("tutoring.status.accepted");
    }

    if (normalizedStatus === "declined") {
        return t("tutoring.status.declined");
    }

    if (normalizedStatus === "completed") {
        return t("tutoring.status.completed");
    }

    return status;
}

export default function TutorDashboardPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [setupStatus, setSetupStatus] = useState<TutorSetupStatus | null>(null);
    const [dashboard, setDashboard] = useState<TutorDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const nextSetupStatus = await tutorService.getTutorSetupStatus();
                setSetupStatus(nextSetupStatus);

                if (!nextSetupStatus.isComplete) {
                    setDashboard(null);
                    setError(null);
                    return;
                }

                const nextDashboard = await tutorService.getTutorDashboard();
                setDashboard(nextDashboard);
                setError(null);
            } catch (nextError) {
                setError(nextError instanceof Error ? nextError.message : t("tutoring.errors.loadTutorDashboard"));
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, []);

    return (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <PageHeader title={t("tutoring.tutor.dashboard.title")} subtitle={t("tutoring.tutor.dashboard.subtitle")} />
            {error ? <Alert type="error" message={error} /> : null}

            {setupStatus && !setupStatus.isComplete ? (
                <Card loading={loading}>
                    <Paragraph>{t("tutoring.tutor.dashboard.setupPrompt")}</Paragraph>
                    <Button type="primary" onClick={() => router.push("/tutor/setup")}>
                        {t("tutoring.tutor.dashboard.actions.completeSetup")}
                    </Button>
                </Card>
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} xl={6}>
                            <Card loading={loading}><Statistic title={t("tutoring.tutor.dashboard.stats.students")} value={dashboard?.linkedStudentsCount ?? 0} /></Card>
                        </Col>
                        <Col xs={24} md={12} xl={6}>
                            <Card loading={loading}><Statistic title={t("tutoring.tutor.dashboard.stats.pendingTutorRequests")} value={dashboard?.pendingTutorRequestsCount ?? 0} /></Card>
                        </Col>
                        <Col xs={24} md={12} xl={6}>
                            <Card loading={loading}><Statistic title={t("tutoring.tutor.dashboard.stats.pendingMeetingRequests")} value={dashboard?.pendingMeetingRequestsCount ?? 0} /></Card>
                        </Col>
                        <Col xs={24} md={12} xl={6}>
                            <Card loading={loading}><Statistic title={t("tutoring.tutor.dashboard.stats.averageMastery")} value={dashboard?.averageStudentMasteryScore ?? 0} suffix="%" /></Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} xl={12}>
                            <Card title={t("tutoring.tutor.dashboard.pendingRequestsTitle")} loading={loading}>
                                <List
                                    locale={{ emptyText: t("tutoring.tutor.dashboard.emptyPendingRequests") }}
                                    dataSource={dashboard?.pendingTutorRequests ?? []}
                                    renderItem={(request) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={`${request.studentName} • ${request.subjectName}`}
                                                description={request.message || t("tutoring.tutor.dashboard.noStudentMessage")}
                                            />
                                            <Tag>{getLocalizedTutorStatus(request.status, t)}</Tag>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} xl={12}>
                            <Card title={t("tutoring.tutor.dashboard.attentionTitle")} loading={loading}>
                                <List
                                    locale={{ emptyText: t("tutoring.tutor.dashboard.emptyAttention") }}
                                    dataSource={dashboard?.studentsNeedingAttention ?? []}
                                    renderItem={(student) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={`${student.studentName} • ${student.subjectName}`}
                                                description={<Text type="secondary">{t("tutoring.tutor.dashboard.masteryLabel", { score: student.masteryScore })}</Text>}
                                            />
                                            {student.needsIntervention ? <Tag color="red">{t("tutoring.tutor.dashboard.needsIntervention")}</Tag> : null}
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Space>
    );
}
