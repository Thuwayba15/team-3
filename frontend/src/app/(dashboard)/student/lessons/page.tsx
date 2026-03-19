"use client";

import {
    CheckCircleOutlined,
    CheckOutlined,
    LeftOutlined,
    LockOutlined,
    MessageOutlined,
    PlayCircleOutlined,
    RightOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Empty, Progress, Spin, Tag, Typography, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useStyles } from "./styles";
import AiTutorDrawer from "@/components/AiTutorDrawer";
import { studentLearningPathService, type IStudentLearningPath, type IStudentLearningPathLesson, type IStudentLearningPathTopic } from "@/services/student/studentLearningPathService";
import { studentSubjectService, type ILessonDetail, type ILessonTranslationSummary, type IStudentSubject } from "@/services/student/studentSubjectService";

const { Title, Text, Paragraph } = Typography;

type LessonStatus = "completed" | "current" | "locked";

function statusTag(status: LessonStatus) {
    if (status === "completed") {
        return <Tag color="success">Completed</Tag>;
    }

    if (status === "current") {
        return <Tag color="processing">In Progress</Tag>;
    }

    return null;
}

function getDifficultyLabel(level: number) {
    if (level === 1) {
        return "Supported pace";
    }

    if (level === 3) {
        return "Advanced pace";
    }

    return "Standard pace";
}

function getPreferredTranslation(lesson: ILessonDetail) {
    return lesson.translations.find((translation) => translation.languageCode.toLowerCase() !== "en")
        ?? lesson.translations.find((translation) => translation.languageCode.toLowerCase() === "en")
        ?? lesson.translations[0]
        ?? null;
}

function buildLessonSections(lesson: ILessonDetail, translation: ILessonTranslationSummary | null) {
    const sections: Array<{ heading: string; body: string }> = [];

    if (translation?.summary || lesson.summary) {
        sections.push({
            heading: "Summary",
            body: translation?.summary || lesson.summary,
        });
    }

    if (translation?.content) {
        sections.push({
            heading: "Lesson Content",
            body: translation.content,
        });
    } else if (lesson.learningObjective) {
        sections.push({
            heading: "Learning Objective",
            body: lesson.learningObjective,
        });
    }

    if (translation?.examples) {
        sections.push({
            heading: "Examples",
            body: translation.examples,
        });
    }

    if (translation?.revisionSummary || lesson.revisionSummary) {
        sections.push({
            heading: "Revision Summary",
            body: translation?.revisionSummary || lesson.revisionSummary,
        });
    }

    return sections;
}

function getCurrentLesson(path: IStudentLearningPath | null) {
    for (const topic of path?.topics ?? []) {
        const lesson = topic.lessons.find((item) => item.status === "current");
        if (lesson) {
            return { topic, lesson };
        }
    }

    return null;
}

function LessonDetail({
    subjectPath,
    topic,
    lesson,
    lessonDetail,
    loading,
    error,
    onBack,
    onComplete,
}: {
    subjectPath: IStudentLearningPath;
    topic: IStudentLearningPathTopic;
    lesson: IStudentLearningPathLesson;
    lessonDetail: ILessonDetail | null;
    loading: boolean;
    error: string | null;
    onBack: () => void;
    onComplete: () => void;
}) {
    const { styles } = useStyles();
    const [aiOpen, setAiOpen] = useState(false);
    const translation = lessonDetail ? getPreferredTranslation(lessonDetail) : null;
    const sections = lessonDetail ? buildLessonSections(lessonDetail, translation) : [];
    const completedLessons = topic.lessons.filter((item) => item.status === "completed").length;
    const topicCompletion = topic.lessons.length === 0 ? 0 : Math.round((completedLessons / topic.lessons.length) * 100);

    return (
        <div className={styles.detailRoot}>
            <div className={styles.detailMain}>
                <div className={styles.breadcrumb}>
                    <Button type="link" icon={<LeftOutlined />} className={styles.backBtn} onClick={onBack} />
                    <span>{`${subjectPath.subjectName} • ${topic.name}`}</span>
                </div>

                <h1 className={styles.lessonHeading}>{lessonDetail?.title ?? lesson.title}</h1>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                    <Tag color="blue">{getDifficultyLabel(lesson.difficultyLevel)}</Tag>
                    <Tag>{`${lesson.estimatedMinutes} min`}</Tag>
                </div>

                {loading ? (
                    <Spin />
                ) : error ? (
                    <Alert type="error" showIcon message="Unable to load lesson" description={error} />
                ) : sections.length === 0 ? (
                    <Empty description="Lesson content coming soon." />
                ) : (
                    sections.map((section) => (
                        <div key={section.heading}>
                            <div className={styles.sectionTitle}>{section.heading}</div>
                            {section.body.split(/\n{2,}/).map((paragraph) => (
                                <Paragraph key={`${section.heading}-${paragraph.slice(0, 24)}`} className={styles.sectionText}>
                                    {paragraph}
                                </Paragraph>
                            ))}
                        </div>
                    ))
                )}

                <div className={styles.detailFooter}>
                    <Button
                        type="primary"
                        icon={<RightOutlined />}
                        iconPosition="end"
                        className={styles.nextBtn}
                        onClick={onComplete}
                        disabled={loading || Boolean(error)}
                    >
                        Complete Lesson
                    </Button>
                </div>
            </div>

            <div className={styles.progressPanel}>
                <Card title="Topic Progress" className={styles.progressCard}>
                    <div className={styles.completionRow}>
                        <span>Topic Completion</span>
                        <span>{topicCompletion} %</span>
                    </div>
                    <Progress percent={topicCompletion} showInfo={false} strokeColor="#00b8a9" size="small" />

                    <div className={styles.topicList}>
                        {topic.lessons.map((item) => (
                            <div key={item.lessonId} className={styles.topicItem}>
                                {item.status === "completed" && (
                                    <div className={styles.topicDotCompleted}>
                                        <CheckOutlined />
                                    </div>
                                )}
                                {item.status === "current" && (
                                    <div className={styles.topicDotCurrent}>
                                        <div className={styles.topicDotCurrentInner} />
                                    </div>
                                )}
                                {item.status === "locked" && <div className={styles.topicDotLocked} />}
                                <span className={item.status === "current" ? styles.topicNameCurrent : styles.topicNameOther}>
                                    {item.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className={styles.aiCard}>
                    <MessageOutlined className={styles.aiIcon} />
                    <div className={styles.aiTitle}>Need a clearer explanation?</div>
                    <div className={styles.aiSubtitle}>
                        Your AI tutor can break this lesson down in your preferred language.
                    </div>
                    <Button type="link" className={styles.aiLink} onClick={() => setAiOpen(true)}>
                        Ask AI Tutor
                    </Button>
                </Card>

                <AiTutorDrawer open={aiOpen} onClose={() => setAiOpen(false)} lessonTitle={lessonDetail?.title ?? lesson.title} />
            </div>
        </div>
    );
}

function LessonList({
    subjectPath,
    onSelect,
}: {
    subjectPath: IStudentLearningPath;
    onSelect: (lessonId: string) => void;
}) {
    const { styles } = useStyles();

    return (
        <div>
            <div className={styles.pageHeader}>
                <Title level={2} style={{ marginBottom: 0 }}>Lessons</Title>
                <Text type="secondary">{`${subjectPath.subjectName} · adaptive lesson track`}</Text>
            </div>

            {subjectPath.topics.map((topic) => (
                <Card
                    key={topic.topicId}
                    title={
                        <span>
                            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
                                {subjectPath.subjectName} &nbsp;·&nbsp;
                            </Text>
                            {topic.name}
                        </span>
                    }
                    className={styles.moduleCard}
                >
                    <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {topic.assignedDifficultyLevel && <Tag color="blue">{getDifficultyLabel(topic.assignedDifficultyLevel)}</Tag>}
                        <Text type="secondary">{topic.recommendedAction}</Text>
                    </div>

                    {topic.lessons.length === 0 ? (
                        <Empty description="No adaptive lessons are available for this topic yet." />
                    ) : (
                        topic.lessons.map((lesson) => (
                            <div
                                key={lesson.lessonId}
                                className={styles.lessonRow}
                                onClick={() => lesson.status !== "locked" && onSelect(lesson.lessonId)}
                            >
                                <div className={styles.lessonLeft}>
                                    <div
                                        className={`${styles.lessonIcon} ${
                                            lesson.status === "completed"
                                                ? styles.lessonIconCompleted
                                                : lesson.status === "current"
                                                    ? styles.lessonIconCurrent
                                                    : styles.lessonIconLocked
                                        }`}
                                    >
                                        {lesson.status === "completed" && <CheckCircleOutlined />}
                                        {lesson.status === "current" && <PlayCircleOutlined />}
                                        {lesson.status === "locked" && <LockOutlined />}
                                    </div>
                                    <div>
                                        <div className={`${styles.lessonTitle} lesson-title`}>{lesson.title}</div>
                                        <div className={styles.lessonMeta}>
                                            {`${lesson.estimatedMinutes} min · ${getDifficultyLabel(lesson.difficultyLevel)}`}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.lessonRight}>
                                    {statusTag(lesson.status)}
                                    {lesson.status !== "locked" && (
                                        <RightOutlined style={{ fontSize: 12, color: "#00b8a9" }} />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </Card>
            ))}
        </div>
    );
}

export default function StudentLessonsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [messageApi, contextHolder] = message.useMessage();
    const [subjects, setSubjects] = useState<IStudentSubject[]>([]);
    const [subjectPath, setSubjectPath] = useState<IStudentLearningPath | null>(null);
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(searchParams.get("subjectId"));
    const [activeLessonId, setActiveLessonId] = useState<string | null>(searchParams.get("lessonId"));
    const [lessonDetail, setLessonDetail] = useState<ILessonDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [lessonLoading, setLessonLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lessonError, setLessonError] = useState<string | null>(null);

    useEffect(() => {
        setActiveSubjectId(searchParams.get("subjectId"));
        setActiveLessonId(searchParams.get("lessonId"));
    }, [searchParams]);

    useEffect(() => {
        let cancelled = false;

        const loadInitial = async () => {
            setLoading(true);
            setError(null);

            try {
                const subjectList = await studentSubjectService.getMySubjects();
                if (cancelled) {
                    return;
                }

                setSubjects(subjectList);
                const selectedSubjectId = searchParams.get("subjectId") ?? subjectList[0]?.id ?? null;
                setActiveSubjectId(selectedSubjectId);

                if (!selectedSubjectId) {
                    setSubjectPath(null);
                    return;
                }

                const path = await studentLearningPathService.getSubjectPath(selectedSubjectId);
                if (cancelled) {
                    return;
                }

                setSubjectPath(path);

                const requestedLessonId = searchParams.get("lessonId");
                const defaultLessonId = requestedLessonId ?? getCurrentLesson(path)?.lesson.lessonId ?? null;
                setActiveLessonId(defaultLessonId);
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : "Failed to load lessons.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadInitial();

        return () => {
            cancelled = true;
        };
    }, [searchParams]);

    useEffect(() => {
        let cancelled = false;

        const loadLesson = async () => {
            if (!activeLessonId) {
                setLessonDetail(null);
                return;
            }

            setLessonLoading(true);
            setLessonError(null);

            try {
                const detail = await studentSubjectService.getLesson(activeLessonId);
                if (!cancelled) {
                    setLessonDetail(detail);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setLessonError(loadError instanceof Error ? loadError.message : "Failed to load lesson detail.");
                    setLessonDetail(null);
                }
            } finally {
                if (!cancelled) {
                    setLessonLoading(false);
                }
            }
        };

        void loadLesson();

        return () => {
            cancelled = true;
        };
    }, [activeLessonId]);

    const syncPath = async (subjectId: string) => {
        const path = await studentLearningPathService.getSubjectPath(subjectId);
        setSubjectPath(path);
        return path;
    };

    const handleSelectLesson = (lessonId: string) => {
        if (!activeSubjectId) {
            return;
        }

        router.push(`/student/lessons?subjectId=${activeSubjectId}&lessonId=${lessonId}`);
    };

    const handleBackToList = () => {
        if (!activeSubjectId) {
            router.push("/student/lessons");
            return;
        }

        router.push(`/student/lessons?subjectId=${activeSubjectId}`);
    };

    const handleCompleteLesson = async () => {
        if (!activeLessonId || !activeSubjectId) {
            return;
        }

        try {
            await studentLearningPathService.completeLesson({ lessonId: activeLessonId });
            const refreshedPath = await syncPath(activeSubjectId);
            const nextCurrent = getCurrentLesson(refreshedPath);

            if (nextCurrent) {
                messageApi.success("Lesson completed. Moving to your next lesson.");
                router.push(`/student/lessons?subjectId=${activeSubjectId}&lessonId=${nextCurrent.lesson.lessonId}`);
                return;
            }

            messageApi.success("Lesson completed. Continue in your learning path for the next recommended step.");
            router.push(`/student/learning-path?subjectId=${activeSubjectId}`);
        } catch (completeError) {
            messageApi.error(completeError instanceof Error ? completeError.message : "Failed to complete the lesson.");
        }
    };

    const activeTopic = subjectPath?.topics.find((topic) => topic.lessons.some((lesson) => lesson.lessonId === activeLessonId)) ?? null;
    const activeLesson = activeTopic?.lessons.find((lesson) => lesson.lessonId === activeLessonId) ?? null;

    return (
        <div>
            {contextHolder}

            {loading ? (
                <Spin />
            ) : error ? (
                <Alert type="error" showIcon message="Unable to load lessons" description={error} />
            ) : subjects.length === 0 || !subjectPath ? (
                <Empty description="You are not enrolled in any subjects yet." />
            ) : activeLesson && activeTopic ? (
                <LessonDetail
                    subjectPath={subjectPath}
                    topic={activeTopic}
                    lesson={activeLesson}
                    lessonDetail={lessonDetail}
                    loading={lessonLoading}
                    error={lessonError}
                    onBack={handleBackToList}
                    onComplete={() => void handleCompleteLesson()}
                />
            ) : (
                <LessonList subjectPath={subjectPath} onSelect={handleSelectLesson} />
            )}
        </div>
    );
}
