"use client";

import { Alert, Card, Col, Progress, Row, Spin, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { studentLearningService, type IStudentProgressOverview } from "@/services/student/studentLearningService";
import { useStyles } from "./styles";

const { Title, Text } = Typography;

export default function StudentProgressPage() {
    const { styles } = useStyles();
    const [overview, setOverview] = useState<IStudentProgressOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        studentLearningService.getProgressOverview()
            .then((result) => {
                setOverview(result);
                setError(null);
            })
            .catch(() => setError("Could not load the progress overview."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className={styles.pageHeader}>
                <Title level={2} style={{ marginBottom: 0 }}>Your Progress</Title>
                <Text type="secondary">Track mastery, diagnostics, and focus topics for Life Sciences.</Text>
            </div>

            {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

            <Spin spinning={loading}>
                <Row gutter={[16, 16]} className={styles.statsRow}>
                    <Col xs={24} md={8}>
                        <Card className={styles.statCard}>
                            <div className={styles.statValue}>{Math.round(overview?.progress?.masteryScore ?? 0)}%</div>
                            <div className={styles.statLabel}>Mastery Score</div>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className={styles.statCard}>
                            <div className={styles.statValue}>{overview?.progress?.attemptCount ?? 0}</div>
                            <div className={styles.statLabel}>Diagnostic Attempts</div>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className={styles.statCard}>
                            <div className={styles.statValue}>{overview?.publishedLessonCount ?? 0}</div>
                            <div className={styles.statLabel}>Published Lessons</div>
                        </Card>
                    </Col>
                </Row>

                <Card title="Current Subject Progress" className={styles.sectionCard}>
                    <Text>{overview?.subject?.name ?? "Life Sciences"}</Text>
                    <Progress percent={Math.round(overview?.progress?.masteryScore ?? 0)} />
                    <Tag color={overview?.progress?.revisionNeeded ? "warning" : "success"}>
                        {overview?.progress?.revisionNeeded ? "Revision Needed" : "On Track"}
                    </Tag>
                </Card>

                <Row gutter={[16, 16]} className={styles.bottomRow}>
                    <Col xs={24} md={12}>
                        <Card title="Latest Diagnostic" className={styles.listCard}>
                            <Text strong>{overview?.latestDiagnostic?.topicName ?? "No diagnostic result yet"}</Text>
                            <br />
                            <Text>{overview?.latestDiagnostic ? `${overview.latestDiagnostic.scorePercent}%` : ""}</Text>
                            <p>{overview?.latestDiagnostic?.recommendation ?? "Take a diagnostic from the learning path to begin."}</p>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card title="Focus Topics" className={styles.listCard}>
                            {(overview?.focusTopics ?? []).map((topic) => (
                                <div key={topic} className={styles.attentionItem}>
                                    <Text className={styles.attentionTitle}>{topic}</Text>
                                </div>
                            ))}
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
}
