"use client";

import {
    CheckCircleOutlined,
    CheckOutlined,
    LeftOutlined,
    LockOutlined,
    MessageOutlined,
    PlayCircleOutlined,
    ReadOutlined,
    RightOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Empty, Progress, Skeleton, Tag, Typography, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AiTutorDrawer from "@/components/AiTutorDrawer";
import { DashboardPageSkeleton } from "@/components/layout";
import SubjectSwitcher from "@/components/student/SubjectSwitcher";
import { UI_COLORS } from "@/constants/uiColors";
import { useI18nState } from "@/providers/i18n";
import { useStyles } from "./styles";
import {
    selectLessonAssessmentByDifficulty,
    studentAssessmentGenerationService,
} from "@/services/student/studentAssessmentGenerationService";
import {
    studentLearningPathService,
    type IStudentLearningPath,
    type IStudentLearningPathLesson,
    type IStudentLearningPathTopic,
} from "@/services/student/studentLearningPathService";
import {
    studentSubjectService,
    type ILessonDetail,
    type ILessonTranslationSummary,
    type IStudentSubject,
} from "@/services/student/studentSubjectService";

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
    return lesson.selectedTranslation
        ?? lesson.translations.find((translation) => translation.languageCode.toLowerCase() === lesson.preferredLanguageCode.toLowerCase())
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
    onOpenQuiz,
}: {
    subjectPath: IStudentLearningPath;
    topic: IStudentLearningPathTopic;
    lesson: IStudentLearningPathLesson;
    lessonDetail: ILessonDetail | null;
    loading: boolean;
    error: string | null;
    onBack: () => void;
    onOpenQuiz: () => void;
}) {
    const { styles } = useStyles();
    const [aiOpen, setAiOpen] = useState(false);
    const translation = lessonDetail ? getPreferredTranslation(lessonDetail) : null;
    const sections = lessonDetail ? buildLessonSections(lessonDetail, translation) : [];
    const completedLessons = topic.lessons.filter((item) => item.status === "completed").length;
    const topicCompletion = topic.lessons.length === 0 ? 0 : Math.round((completedLessons / topic.lessons.length) * 100);
    const isReviewMode = lesson.actionState === "review";
    const canOpenQuiz = lesson.status !== "locked";

    return (
        <div className={styles.detailRoot}>
            <div className={styles.detailMain}>
                <div className={styles.breadcrumb}>
                    <Button type="link" icon={<LeftOutlined />} className={styles.backBtn} onClick={onBack} />
                    <span>{`${subjectPath.subjectName} · ${topic.name}`}</span>
                </div>

                <h1 className={styles.lessonHeading}>{lessonDetail?.title ?? lesson.title}</h1>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                    <Tag color="blue">{getDifficultyLabel(lesson.difficultyLevel)}</Tag>
                    <Tag>{`${lesson.estimatedMinutes} min`}</Tag>
                    {isReviewMode ? <Tag color="success">Review mode</Tag> : null}
                </div>

                {loading ? (
                    <Skeleton active paragraph={{ rows: 6 }} title={false} />
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
                    {canOpenQuiz && !isReviewMode ? (
                        <Button
                            type="primary"
                            icon={<RightOutlined />}
                            iconPosition="end"
                            className={styles.nextBtn}
                            onClick={onOpenQuiz}
                            disabled={loading || Boolean(error)}
                        >
                            Take Quiz
                        </Button>
                    ) : null}
                    {isReviewMode ? (
                        <Button disabled icon={<ReadOutlined />}>
                            Review Only
                        </Button>
                    ) : null}
                </div>
            </div>

            <div className={styles.progressPanel}>
                <Card title="Topic Progress" className={styles.progressCard}>
                    <div className={styles.completionRow}>
                        <span>Topic Completion</span>
                        <span>{topicCompletion} %</span>
                    </div>
                    <Progress percent={topicCompletion} showInfo={false} strokeColor={UI_COLORS.PRIMARY} size="small" />

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
    subjects,
    activeSubjectId,
    onSelectSubject,
    onSelectLesson,
}: {
    subjectPath: IStudentLearningPath;
    subjects: IStudentSubject[];
    activeSubjectId: string | null;
    onSelectSubject: (subjectId: string) => void;
    onSelectLesson: (lessonId: string) => void;
}) {
    const { styles } = useStyles();

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} style={{ marginBottom: 0 }}>Lessons</Title>
                    <Text type="secondary">{`${subjectPath.subjectName} · adaptive lesson track`}</Text>
                </div>

                <SubjectSwitcher
                    subjects={subjects}
                    activeSubjectId={activeSubjectId}
                    onSelectSubject={onSelectSubject}
                />
            </div>

            {subjectPath.topics.map((topic) => (
                <Card
                    key={topic.topicId}
                    title={(
                        <span>
                            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
                                {subjectPath.subjectName} ·
                            </Text>
                            {" "}
                            {topic.name}
                        </span>
                    )}
                    className={styles.moduleCard}
                >
                    <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {topic.assignedDifficultyLevel ? <Tag color="blue">{getDifficultyLabel(topic.assignedDifficultyLevel)}</Tag> : null}
                        <Text type="secondary">{topic.recommendedAction}</Text>
                    </div>

                    {topic.lessons.length === 0 ? (
                        <Empty description="No adaptive lessons are available for this topic yet." />
                    ) : (
                        topic.lessons.map((lesson) => (
                            <div
                                key={lesson.lessonId}
                                className={styles.lessonRow}
                                onClick={() => lesson.status !== "locked" && onSelectLesson(lesson.lessonId)}
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
                                    {lesson.actionState === "review" ? <Tag color="success">Review</Tag> : null}
                                    {lesson.status !== "locked" ? (
                                        <RightOutlined style={{ fontSize: 12, color: UI_COLORS.PRIMARY }} />
                                    ) : null}
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
    const { styles } = useStyles();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentLanguage } = useI18nState();
    const subjectIdParam = searchParams.get("subjectId");
    const lessonIdParam = searchParams.get("lessonId");
    const [messageApi, contextHolder] = message.useMessage();
    const [subjects, setSubjects] = useState<IStudentSubject[]>([]);
    const [subjectPath, setSubjectPath] = useState<IStudentLearningPath | null>(null);
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(subjectIdParam);
    const [activeLessonId, setActiveLessonId] = useState<string | null>(lessonIdParam);
    const [lessonDetail, setLessonDetail] = useState<ILessonDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [lessonLoading, setLessonLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lessonError, setLessonError] = useState<string | null>(null);

    useEffect(() => {
        setActiveSubjectId(subjectIdParam);
        setActiveLessonId(lessonIdParam);
    }, [subjectIdParam, lessonIdParam]);

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

                const nextSubjectId =
                    (subjectIdParam && subjectList.some((subject) => subject.id === subjectIdParam) ? subjectIdParam : null)
                    ?? subjectList[0]?.id
                    ?? null;

                setActiveSubjectId(nextSubjectId);

                if (!nextSubjectId) {
                    setSubjectPath(null);
                    setActiveLessonId(null);
                    return;
                }

                const path = await studentLearningPathService.getSubjectPath(nextSubjectId);
                if (cancelled) {
                    return;
                }

                setSubjectPath(path);

                const validLessonIds = new Set(path.topics.flatMap((topic) => topic.lessons.map((lesson) => lesson.lessonId)));
                const nextLessonId =
                    (lessonIdParam && validLessonIds.has(lessonIdParam) ? lessonIdParam : null)
                    ?? getCurrentLesson(path)?.lesson.lessonId
                    ?? null;

                setActiveLessonId(nextLessonId);

                if (nextSubjectId !== subjectIdParam || nextLessonId !== lessonIdParam) {
                    if (nextLessonId) {
                        router.replace(`/student/lessons?subjectId=${nextSubjectId}&lessonId=${nextLessonId}`);
                    } else {
                        router.replace(`/student/lessons?subjectId=${nextSubjectId}`);
                    }
                }
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
    }, [currentLanguage, lessonIdParam, router, subjectIdParam]);

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
    }, [activeLessonId, currentLanguage]);

    const resolveLessonQuizAssessmentId = async (
        lessonId: string,
        assignedDifficultyLevel: IStudentLearningPathTopic["assignedDifficultyLevel"]
    ) => {
        const assessments = await studentAssessmentGenerationService.getLessonAssessments(lessonId);
        const selectedAssessment = selectLessonAssessmentByDifficulty(assessments, assignedDifficultyLevel);
        return selectedAssessment?.assessmentId ?? null;
    };

    const openLessonQuiz = async (
        lessonId: string,
        assignedDifficultyLevel: IStudentLearningPathTopic["assignedDifficultyLevel"]
    ) => {
        if (!activeSubjectId) {
            return false;
        }

        const assessmentId = await resolveLessonQuizAssessmentId(lessonId, assignedDifficultyLevel);
        if (!assessmentId) {
            return false;
        }

        router.push(`/student/learning-path?subjectId=${activeSubjectId}&assessmentId=${assessmentId}&assessmentType=2`);
        return true;
    };

    const handleSelectSubject = (subjectId: string) => {
        setActiveSubjectId(subjectId);
        setActiveLessonId(null);
        setLessonDetail(null);
        router.push(`/student/lessons?subjectId=${subjectId}`);
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

    const activeTopic = subjectPath?.topics.find((topic) => topic.lessons.some((lesson) => lesson.lessonId === activeLessonId)) ?? null;
    const activeLesson = activeTopic?.lessons.find((lesson) => lesson.lessonId === activeLessonId) ?? null;

    return (
        <div>
            {contextHolder}

            {loading ? (
                <DashboardPageSkeleton cardCount={4} />
            ) : error ? (
                <Alert type="error" showIcon message="Unable to load lessons" description={error} />
            ) : subjects.length === 0 || !subjectPath ? (
                <Empty description="You are not enrolled in any subjects yet." />
            ) : activeLesson && activeTopic ? (
                <>
                    <div className={styles.pageHeader}>
                        <div>
                            <Title level={2} style={{ marginBottom: 0 }}>Lessons</Title>
                            <Text type="secondary">{`${subjectPath.subjectName} · adaptive lesson track`}</Text>
                        </div>

                        <SubjectSwitcher
                            subjects={subjects}
                            activeSubjectId={activeSubjectId}
                            onSelectSubject={handleSelectSubject}
                        />
                    </div>

                    <LessonDetail
                        subjectPath={subjectPath}
                        topic={activeTopic}
                        lesson={activeLesson}
                        lessonDetail={lessonDetail}
                        loading={lessonLoading}
                        error={lessonError}
                        onBack={handleBackToList}
                        onOpenQuiz={() => {
                            void (async () => {
                                try {
                                    const opened = await openLessonQuiz(activeLesson.lessonId, activeTopic.assignedDifficultyLevel);
                                    if (!opened) {
                                        messageApi.info("No lesson quiz is available yet for this lesson.");
                                    }
                                } catch (quizError) {
                                    messageApi.error(quizError instanceof Error ? quizError.message : "Failed to open the lesson quiz.");
                                }
                            })();
                        }}
                    />
                </>
            ) : (
                <LessonList
                    subjectPath={subjectPath}
                    subjects={subjects}
                    activeSubjectId={activeSubjectId}
                    onSelectSubject={handleSelectSubject}
                    onSelectLesson={handleSelectLesson}
                />
            )}
        </div>
    );
}
