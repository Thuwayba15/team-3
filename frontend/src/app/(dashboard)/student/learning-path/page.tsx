"use client";

import {
    CheckCircleFilled,
    CheckCircleOutlined,
    LockOutlined,
    PlayCircleFilled,
} from "@ant-design/icons";
import { Alert, Button, Card, Empty, Progress, Spin, Tag, Typography, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QuizView from "./QuizView";
import { useStyles } from "./styles";
import type { AssessmentType } from "@/services/student/studentAssessmentService";
import { studentLearningPathService, type IStudentLearningPath, type IStudentLearningPathLesson, type IStudentLearningPathTopic } from "@/services/student/studentLearningPathService";
import { studentSubjectService, type DifficultyLevel, type IStudentSubject } from "@/services/student/studentSubjectService";

const { Text } = Typography;

interface IActiveAssessment {
    assessmentId: string;
    assessmentType: AssessmentType;
}

function getDifficultyTone(level: DifficultyLevel | null) {
    if (level === 1) {
        return { label: "Supported pace", color: "gold" as const };
    }

    if (level === 3) {
        return { label: "Advanced pace", color: "purple" as const };
    }

    return { label: "Standard pace", color: "blue" as const };
}

function getModuleProgress(topic: IStudentLearningPathTopic) {
    if (topic.status === "completed") {
        return 100;
    }

    if (topic.lessons.length === 0) {
        return topic.status === "locked" ? 0 : Math.round(topic.masteryScore);
    }

    const completedLessons = topic.lessons.filter((lesson) => lesson.status === "completed").length;
    return Math.round((completedLessons / topic.lessons.length) * 100);
}

function LessonRow({
    lesson,
    styles,
    onOpenLesson,
    onOpenQuiz,
}: {
    lesson: IStudentLearningPathLesson;
    styles: ReturnType<typeof useStyles>["styles"];
    onOpenLesson: (lessonId: string) => void;
    onOpenQuiz: (assessmentId: string) => void;
}) {
    const { t } = useTranslation();

    if (lesson.status === "locked") {
        return (
            <div className={styles.topicRow}>
                <div className={styles.topicLeft}>
                    <LockOutlined className={styles.topicIconLocked} />
                    <div className={styles.topicRowCopy}>
                        <span className={styles.topicNameLocked}>{lesson.title}</span>
                        <span className={styles.lockedTag}>{lesson.estimatedMinutes} min</span>
                    </div>
                </div>
                <span className={styles.lockedTag}>{t("dashboard.student.learningPathPage.locked")}</span>
            </div>
        );
    }

    if (lesson.status === "current") {
        return (
            <div className={styles.topicRowHighlighted}>
                <div className={styles.topicLeft}>
                    <PlayCircleFilled className={styles.topicIcon} />
                    <div className={styles.topicRowCopy}>
                        <div className={styles.topicName}>{lesson.title}</div>
                        <div className={styles.topicSubtitle}>Recommended next lesson</div>
                    </div>
                </div>
                <div className={styles.topicRight}>
                    <span className={styles.lessonMetaPill}>{lesson.estimatedMinutes} min</span>
                    <Button type="primary" size="small" className={styles.continueBtn} onClick={() => onOpenLesson(lesson.lessonId)}>
                        Continue
                    </Button>
                    {lesson.quizAssessmentId && (
                        <Button size="small" onClick={() => onOpenQuiz(lesson.quizAssessmentId!)}>
                            Quiz
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.topicRow}>
            <div className={styles.topicLeft}>
                <CheckCircleOutlined className={styles.topicIcon} />
                <div className={styles.topicRowCopy}>
                    <span className={styles.topicName}>{lesson.title}</span>
                    <span className={styles.masteredTag}>{lesson.estimatedMinutes} min</span>
                </div>
            </div>
            <div className={styles.topicRight}>
                {lesson.quizAssessmentId && (
                    <Button size="small" onClick={() => onOpenQuiz(lesson.quizAssessmentId!)}>
                        Review Quiz
                    </Button>
                )}
                <span className={styles.masteredTag}>{t("dashboard.student.learningPathPage.completed")}</span>
            </div>
        </div>
    );
}

export default function StudentLearningPathPage() {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [messageApi, contextHolder] = message.useMessage();
    const [subjects, setSubjects] = useState<IStudentSubject[]>([]);
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
    const [subjectPath, setSubjectPath] = useState<IStudentLearningPath | null>(null);
    const [activeAssessment, setActiveAssessment] = useState<IActiveAssessment | null>(null);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [loadingPath, setLoadingPath] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadSubjects = async () => {
            setLoadingSubjects(true);
            setError(null);

            try {
                const data = await studentSubjectService.getMySubjects();
                if (cancelled) {
                    return;
                }

                setSubjects(data);
                const requestedSubjectId = searchParams.get("subjectId");
                const subjectExists = requestedSubjectId ? data.some((subject) => subject.id === requestedSubjectId) : false;
                setActiveSubjectId((current) => current ?? (subjectExists ? requestedSubjectId : data[0]?.id ?? null));
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : "Failed to load subjects.");
                }
            } finally {
                if (!cancelled) {
                    setLoadingSubjects(false);
                }
            }
        };

        void loadSubjects();

        return () => {
            cancelled = true;
        };
    }, [searchParams]);

    const loadSubjectPath = async (subjectId: string) => {
        setLoadingPath(true);
        setError(null);

        try {
            const data = await studentLearningPathService.getSubjectPath(subjectId);
            setSubjectPath(data);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load learning path.");
            setSubjectPath(null);
        } finally {
            setLoadingPath(false);
        }
    };

    useEffect(() => {
        if (!activeSubjectId) {
            setSubjectPath(null);
            return;
        }

        void loadSubjectPath(activeSubjectId);
    }, [activeSubjectId]);

    const handleOpenLesson = (lessonId: string) => {
        if (!activeSubjectId) {
            return;
        }

        router.push(`/student/lessons?subjectId=${activeSubjectId}&lessonId=${lessonId}`);
    };

    const handleOpenAssessment = (assessmentId: string, assessmentType: AssessmentType) => {
        setActiveAssessment({ assessmentId, assessmentType });
    };

    const handleAssessmentFinished = async () => {
        const currentSubjectId = activeSubjectId;
        setActiveAssessment(null);

        if (currentSubjectId) {
            await loadSubjectPath(currentSubjectId);
        }
    };

    const currentTopic = subjectPath?.topics.find((topic) => topic.status === "current") ?? null;

    if (activeAssessment) {
        return (
            <>
                {contextHolder}
                <QuizView
                    assessmentId={activeAssessment.assessmentId}
                    assessmentType={activeAssessment.assessmentType}
                    onExit={() => setActiveAssessment(null)}
                    onComplete={handleAssessmentFinished}
                />
            </>
        );
    }

    return (
        <div>
            {contextHolder}

            <div className={styles.pageHeader}>
                <div>
                    <Typography.Title level={2} style={{ marginBottom: 0 }}>
                        {t("dashboard.student.learningPathPage.title")}
                    </Typography.Title>
                    <Text type="secondary">{t("dashboard.student.learningPathPage.subtitle")}</Text>
                </div>

                <div className={styles.subjectTabs}>
                    {subjects.map((subject) => (
                        <button
                            key={subject.id}
                            className={`${styles.subjectTab} ${activeSubjectId === subject.id ? styles.subjectTabActive : ""}`}
                            onClick={() => setActiveSubjectId(subject.id)}
                            type="button"
                        >
                            {subject.name}
                        </button>
                    ))}
                </div>
            </div>

            {loadingSubjects ? (
                <Card className={styles.subjectSummaryCard}>
                    <Spin />
                </Card>
            ) : subjects.length === 0 ? (
                <Card className={styles.emptyState}>
                    <Empty description="You are not enrolled in any subjects yet." />
                </Card>
            ) : (
                <>
                    {error && (
                        <Alert
                            type="error"
                            showIcon
                            className={styles.infoBanner}
                            message="Unable to load your learning path"
                            description={error}
                        />
                    )}

                    {subjectPath && (
                        <>
                            <Card className={styles.subjectSummaryCard}>
                                <div className={styles.subjectSummaryHeader}>
                                    <div>
                                        <h3 className={styles.subjectTitle}>
                                            {subjectPath.subjectName} - {subjectPath.gradeLevel}
                                        </h3>
                                        <div className={styles.summaryMeta}>
                                            {currentTopic?.assignedDifficultyLevel && (
                                                <Tag color={getDifficultyTone(currentTopic.assignedDifficultyLevel).color}>
                                                    {getDifficultyTone(currentTopic.assignedDifficultyLevel).label}
                                                </Tag>
                                            )}
                                            {currentTopic?.needsRevision && <Tag color="warning">Revision recommended</Tag>}
                                        </div>
                                    </div>
                                    <div>
                                        <div className={styles.masteredPercent}>{Math.round(subjectPath.overallProgressPercent)}%</div>
                                        <div className={styles.masteredLabel}>{t("dashboard.student.learningPathPage.mastered")}</div>
                                    </div>
                                </div>
                                <div className={styles.progressLabel}>{t("dashboard.student.learningPathPage.overallSubjectProgress")}</div>
                                <Progress
                                    percent={Math.round(subjectPath.overallProgressPercent)}
                                    showInfo={false}
                                    strokeColor="#00b8a9"
                                />
                                <div className={styles.summaryMeta}>
                                    <Text className={styles.helperText}>{subjectPath.recommendedAction}</Text>
                                </div>
                            </Card>

                            {currentTopic && currentTopic.diagnosticAssessmentId && currentTopic.assignedDifficultyLevel === null && (
                                <Alert
                                    type="info"
                                    showIcon
                                    className={styles.infoBanner}
                                    message="Diagnostic required"
                                    description={
                                        <div>
                                            <div style={{ marginBottom: 12 }}>{currentTopic.recommendedAction}</div>
                                            <Button
                                                type="primary"
                                                onClick={() => handleOpenAssessment(currentTopic.diagnosticAssessmentId!, 1)}
                                            >
                                                Start diagnostic
                                            </Button>
                                        </div>
                                    }
                                />
                            )}

                            {loadingPath ? (
                                <Card className={styles.subjectSummaryCard}>
                                    <Spin />
                                </Card>
                            ) : (
                                <div className={styles.timeline}>
                                    {subjectPath.topics.map((topic, idx) => {
                                        const isLast = idx === subjectPath.topics.length - 1;
                                        const connectorClass =
                                            topic.status === "completed"
                                                ? styles.timelineConnectorActive
                                                : styles.timelineConnector;
                                        const moduleProgress = getModuleProgress(topic);
                                        const difficultyTone = getDifficultyTone(topic.assignedDifficultyLevel);

                                        return (
                                            <div key={topic.topicId} className={styles.timelineItem}>
                                                <div className={styles.timelineLeft}>
                                                    {topic.status === "completed" && (
                                                        <div className={styles.timelineDot}>
                                                            <CheckCircleFilled />
                                                        </div>
                                                    )}
                                                    {topic.status === "current" && (
                                                        <div className={styles.timelineDotInProgress}>
                                                            <div className={styles.timelineDotInner} />
                                                        </div>
                                                    )}
                                                    {topic.status === "locked" && (
                                                        <div className={styles.timelineDotLocked}>
                                                            <LockOutlined />
                                                        </div>
                                                    )}
                                                    {!isLast && <div className={connectorClass} />}
                                                </div>

                                                <div className={styles.timelineContent}>
                                                    <Card
                                                        className={topic.status === "current" ? styles.moduleCardActive : styles.moduleCard}
                                                    >
                                                        <div className={styles.moduleHeader}>
                                                            <div className={styles.moduleTitleRow}>
                                                                <span className={styles.moduleTitle}>{topic.name}</span>
                                                                {topic.status === "completed" && (
                                                                    <Tag color="success">{t("dashboard.student.learningPathPage.completed")}</Tag>
                                                                )}
                                                                {topic.status === "current" && (
                                                                    <Tag color="processing">{t("dashboard.student.learningPathPage.inProgress")}</Tag>
                                                                )}
                                                                {topic.status === "locked" && (
                                                                    <Tag>{t("dashboard.student.learningPathPage.locked")}</Tag>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {topic.description && (
                                                            <div className={styles.moduleDesc}>{topic.description}</div>
                                                        )}

                                                        <div className={styles.moduleMeta}>
                                                            {topic.assignedDifficultyLevel && (
                                                                <Tag color={difficultyTone.color}>{difficultyTone.label}</Tag>
                                                            )}
                                                            <span className={styles.lessonMetaPill}>
                                                                Mastery {Math.round(topic.masteryScore)}%
                                                            </span>
                                                        </div>

                                                        <div className={styles.topicAction}>{topic.recommendedAction}</div>

                                                        {topic.status === "current" && topic.lessons.length > 0 && (
                                                            <div className={styles.moduleProgress}>
                                                                <div className={styles.progressPercent}>{moduleProgress}%</div>
                                                                <Progress percent={moduleProgress} showInfo={false} strokeColor="#00b8a9" />
                                                            </div>
                                                        )}

                                                        {topic.lessons.length > 0 ? (
                                                            topic.status === "completed" ? (
                                                                <div className={styles.topicGrid}>
                                                                    {topic.lessons.map((lesson) => (
                                                                        <div key={lesson.lessonId} className={styles.topicGridItem}>
                                                                            <CheckCircleOutlined className={styles.topicIcon} />
                                                                            <span>{lesson.title}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className={styles.topicList}>
                                                                    {topic.lessons.map((lesson) => (
                                                                        <LessonRow
                                                                            key={lesson.lessonId}
                                                                            lesson={lesson}
                                                                            styles={styles}
                                                                            onOpenLesson={handleOpenLesson}
                                                                            onOpenQuiz={(assessmentId) => handleOpenAssessment(assessmentId, 2)}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )
                                                        ) : (
                                                            <Text className={styles.helperText}>
                                                                {topic.status === "locked"
                                                                    ? "This topic will unlock after you complete the previous one."
                                                                    : "No lessons are available for this topic yet."}
                                                            </Text>
                                                        )}

                                                        {topic.status === "current" && topic.diagnosticAssessmentId && topic.assignedDifficultyLevel === null && (
                                                            <div style={{ marginTop: 16 }}>
                                                                <Button
                                                                    type="primary"
                                                                    className={styles.continueBtn}
                                                                    onClick={() => handleOpenAssessment(topic.diagnosticAssessmentId!, 1)}
                                                                >
                                                                    Start diagnostic
                                                                </Button>
                                                            </div>
                                                        )}

                                                        {topic.status === "current"
                                                            && topic.assignedDifficultyLevel !== null
                                                            && topic.lessons.every((lesson) => lesson.status === "completed")
                                                            && topic.lessons.some((lesson) => lesson.quizAssessmentId) && (
                                                            <div style={{ marginTop: 16 }}>
                                                                <Button
                                                                    type="primary"
                                                                    className={styles.continueBtn}
                                                                    onClick={() => {
                                                                        const lessonWithQuiz = topic.lessons.find((lesson) => lesson.quizAssessmentId);
                                                                        if (!lessonWithQuiz?.quizAssessmentId) {
                                                                            messageApi.error("No lesson quiz is available yet for this topic.");
                                                                            return;
                                                                        }

                                                                        handleOpenAssessment(lessonWithQuiz.quizAssessmentId, 2);
                                                                    }}
                                                                >
                                                                    Take lesson quiz
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </Card>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
