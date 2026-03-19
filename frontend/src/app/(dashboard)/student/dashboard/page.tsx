"use client";

import { BookOutlined, ExperimentOutlined, RobotOutlined, TrophyOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Progress, Row, Spin, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { studentLearningService, type IStudentDashboard } from "@/services/student/studentLearningService";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

export default function StudentDashboardPage() {
    const { styles } = useStyles();
    const [dashboard, setDashboard] = useState<IStudentDashboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        studentLearningService.getDashboard()
            .then((result) => {
                setDashboard(result);
                setError(null);
            })
            .catch(() => setError("Could not load the student dashboard."))
            .finally(() => setLoading(false));
    }, []);

    const stats = [
        { icon: TrophyOutlined, label: "Mastery Score", value: `${Math.round(dashboard?.progress?.masteryScore ?? 0)}%` },
        { icon: BookOutlined, label: "Completed Lessons", value: dashboard?.progress?.completedLessonCount ?? 0 },
        { icon: ExperimentOutlined, label: "Diagnostic Attempts", value: dashboard?.progress?.attemptCount ?? 0 },
    ];

    return (
        <div>
            <div className={styles.welcomeSection}>
                <div>
                    <Title level={2} className={styles.welcomeText}>Life Sciences Dashboard</Title>
                    <Text type="secondary">Track your current topic, latest diagnostic result, and recommended next lesson.</Text>
                </div>
                <Link href="/student/ai-tutor">
                    <Button type="primary" icon={<RobotOutlined />} size="large" className={styles.askAiBtn}>
                        Ask AI Tutor
                    </Button>
                </Link>
            </div>

            {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

            <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                    {stats.map(({ icon: Icon, label, value }) => (
                        <Col key={label} xs={24} md={8}>
                            <Card className={styles.statCard}>
                                <Icon className={styles.statIcon} />
                                <div className={styles.statValue}>{value}</div>
                                <div className={styles.statLabel}>{label}</div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
                    <Col xs={24} lg={16}>
                        <Card className={styles.nextLessonCard} title="Recommended Next Step">
                            <Text className={styles.lessonTitle}>
                                {dashboard?.recommendedLesson?.title ?? "No published lesson yet"}
                            </Text>
                            <Text className={styles.lessonDesc}>
                                Topic: {dashboard?.recommendedTopic?.name ?? "Not available"}
                            </Text>
                            <div className={styles.lessonActions}>
                                <Link href="/student/learning-path">
                                    <Button type="primary" className={styles.startBtn}>Open Learning Path</Button>
                                </Link>
                            </div>
                        </Card>

                        <Card className={styles.heatmapCard} title="Current Progress Snapshot">
                            <Text>Subject: {dashboard?.subject?.name ?? "Life Sciences"}</Text>
                            <Progress percent={Math.round(dashboard?.progress?.masteryScore ?? 0)} />
                            <Text type="secondary">
                                Status: {dashboard?.progress?.progressStatus ?? "Not started"}
                            </Text>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card className={styles.quizCard} title="Latest Diagnostic">
                            <Text>{dashboard?.latestDiagnostic?.topicName ?? "No topic selected yet"}</Text>
                            <div className={styles.quizScore}>
                                {dashboard?.latestDiagnostic ? `${dashboard.latestDiagnostic.scorePercent}%` : "No result yet"}
                            </div>
                            <Text type="secondary">
                                {dashboard?.latestDiagnostic?.recommendation ?? "Take a topic diagnostic to get a recommendation."}
                            </Text>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
}
