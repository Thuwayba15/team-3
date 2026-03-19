"use client";

import { CheckCircleOutlined, ExperimentOutlined, ReadOutlined, RobotOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Modal, Progress, Radio, Space, Spin, Typography, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import AiTutorDrawer from "@/components/AiTutorDrawer";
import {
    studentLearningService,
    type IDiagnosticQuestionSet,
    type IDiagnosticResult,
    type ILessonDetail,
    type IStudentLearningPath,
} from "@/services/student/studentLearningService";
import { useStyles } from "./styles";

const { Title, Text } = Typography;

export default function StudentLearningPathPage() {
    const { styles } = useStyles();
    const [data, setData] = useState<IStudentLearningPath | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeLesson, setActiveLesson] = useState<ILessonDetail | null>(null);
    const [diagnostic, setDiagnostic] = useState<IDiagnosticQuestionSet | null>(null);
    const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, string>>({});
    const [diagnosticResult, setDiagnosticResult] = useState<IDiagnosticResult | null>(null);
    const [aiOpen, setAiOpen] = useState(false);

    const loadLearningPath = async () => {
        setLoading(true);
        try {
            const result = await studentLearningService.getLearningPath();
            setData(result);
            setError(null);
        } catch {
            setError("Could not load the Life Sciences learning path.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadLearningPath();
    }, []);

    const latestDiagnostic = diagnosticResult ?? data?.latestDiagnostic ?? null;

    const recommendedTopicName = useMemo(
        () => data?.recommendedTopic?.name ?? data?.topics[0]?.name ?? "Life Sciences Topic",
        [data]
    );

    const openLesson = async (lessonId: string) => {
        try {
            const lesson = await studentLearningService.getLesson(lessonId);
            setActiveLesson(lesson);
        } catch {
            message.error("Could not load lesson details.");
        }
    };

    const startDiagnostic = async (topicId: string) => {
        try {
            const result = await studentLearningService.startDiagnostic(topicId);
            setDiagnostic(result);
            setDiagnosticAnswers({});
            setDiagnosticResult(null);
        } catch {
            message.error("Could not start the diagnostic.");
        }
    };

    const submitDiagnostic = async () => {
        if (!diagnostic) {
            return;
        }

        try {
            const result = await studentLearningService.submitDiagnostic(diagnostic.topicId, diagnosticAnswers);
            setDiagnosticResult(result);
            setDiagnostic(null);
            message.success("Diagnostic submitted.");
            await loadLearningPath();
        } catch {
            message.error("Could not submit the diagnostic.");
        }
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} style={{ marginBottom: 0 }}>Learning Path</Title>
                    <Text type="secondary">Life Sciences curriculum, diagnostics, and lesson content.</Text>
                </div>
                <Button type="primary" icon={<RobotOutlined />} onClick={() => setAiOpen(true)}>
                    Ask AI
                </Button>
            </div>

            {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

            <Spin spinning={loading}>
                <Card className={styles.subjectSummaryCard}>
                    <div className={styles.subjectSummaryHeader}>
                        <div>
                            <h3 className={styles.subjectTitle}>
                                {data?.subject?.name ?? "Life Sciences"} - {data?.subject?.gradeLevel ?? ""}
                            </h3>
                            <div className={styles.progressLabel}>Recommended Topic: {recommendedTopicName}</div>
                        </div>
                        <div>
                            <div className={styles.masteredPercent}>{Math.round(data?.progress?.masteryScore ?? 0)}%</div>
                            <div className={styles.masteredLabel}>Mastery</div>
                        </div>
                    </div>
                    <Progress percent={Math.round(data?.progress?.masteryScore ?? 0)} showInfo={false} strokeColor="#00b8a9" />
                </Card>

                {(data?.topics ?? []).map((topic) => (
                    <Card key={topic.id} title={`${topic.sequenceOrder}. ${topic.name}`} className={styles.moduleCard}>
                        <Text type="secondary">{topic.description || "No topic description yet."}</Text>
                        <div style={{ marginTop: 12, marginBottom: 12 }}>
                            <Space wrap>
                                <Button icon={<ExperimentOutlined />} onClick={() => void startDiagnostic(topic.id)}>
                                    Take Diagnostic
                                </Button>
                                {topic.lessons.map((lesson) => (
                                    <Button key={lesson.id} icon={<ReadOutlined />} onClick={() => void openLesson(lesson.id)}>
                                        {lesson.title}
                                    </Button>
                                ))}
                            </Space>
                        </div>
                    </Card>
                ))}

                {activeLesson && (
                    <Card title={activeLesson.title} style={{ marginTop: 16 }}>
                        <Text strong>{activeLesson.learningObjective || "Learning objective not set yet."}</Text>
                        <p>{activeLesson.summary || "No lesson summary yet."}</p>
                        {(activeLesson.translations ?? []).map((translation) => (
                            <Card key={translation.languageCode} size="small" style={{ marginTop: 12 }}>
                                <Text strong>{translation.languageName}</Text>
                                <p>{translation.content}</p>
                            </Card>
                        ))}
                    </Card>
                )}

                {latestDiagnostic && (
                    <Card title="Latest Diagnostic Result" style={{ marginTop: 16 }}>
                        <Space direction="vertical">
                            <Text><CheckCircleOutlined /> Topic: {latestDiagnostic.topicName}</Text>
                            <Text>Score: {latestDiagnostic.scorePercent}%</Text>
                            <Text type="secondary">{latestDiagnostic.recommendation}</Text>
                        </Space>
                    </Card>
                )}
            </Spin>

            <Modal
                title={diagnostic ? `Diagnostic - ${diagnostic.topicName}` : "Diagnostic"}
                open={Boolean(diagnostic)}
                onCancel={() => setDiagnostic(null)}
                onOk={() => void submitDiagnostic()}
                okText="Submit Diagnostic"
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    {(diagnostic?.questions ?? []).map((question) => (
                        <Card key={question.id} size="small">
                            <Text strong>{question.prompt}</Text>
                            <Radio.Group
                                style={{ display: "flex", flexDirection: "column", marginTop: 8 }}
                                value={diagnosticAnswers[question.id]}
                                onChange={(event) =>
                                    setDiagnosticAnswers((previous) => ({ ...previous, [question.id]: event.target.value }))
                                }
                            >
                                {question.options.map((option) => (
                                    <Radio key={option} value={option}>{option}</Radio>
                                ))}
                            </Radio.Group>
                        </Card>
                    ))}
                </Space>
            </Modal>

            <AiTutorDrawer
                open={aiOpen}
                onClose={() => setAiOpen(false)}
                subjectName={data?.subject?.name}
                topicName={data?.recommendedTopic?.name}
                lessonTitle={activeLesson?.title}
                latestDiagnostic={latestDiagnostic}
            />
        </div>
    );
}
