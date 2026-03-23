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
import { Alert, Button, Card, Empty, Progress, Tag, Skeleton,Typography, message } from "antd";
import ReactMarkdown from "react-markdown";
import type { TFunction } from "i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AiTutorDrawer from "@/components/AiTutorDrawer";
import { DashboardPageSkeleton } from "@/components/layout";
import SubjectSwitcher from "@/components/student/SubjectSwitcher";
import { UI_COLORS } from "@/constants/uiColors";
import { useI18nState } from "@/providers/i18n";
import { useStyles } from "./styles";
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

const { Title, Text } = Typography;

type LessonStatus = "completed" | "current" | "locked";

const SERVER_ACTION_KEY_BY_MESSAGE: Record<string, string> = {
    "Complete the previous topic to unlock this one.": "dashboard.student.lessonsPage.serverAction.completePreviousTopic",
    "Take the diagnostic assessment to unlock this topic.": "dashboard.student.lessonsPage.serverAction.takeDiagnosticAssessment",
    "No lesson is available for the assigned difficulty yet.": "dashboard.student.lessonsPage.serverAction.noLessonForDifficulty",
    "Take the lesson quiz to complete this topic.": "dashboard.student.lessonsPage.serverAction.takeLessonQuizForTopic",
    "A lesson quiz is not available for this topic yet.": "dashboard.student.lessonsPage.serverAction.lessonQuizNotAvailableForTopic",
    "Continue with your current lesson.": "dashboard.student.lessonsPage.serverAction.continueCurrentLesson",
    "You have completed the available learning path for this subject.": "dashboard.student.lessonsPage.serverAction.completedAvailablePath",
    "Start with the first available topic.": "dashboard.student.lessonsPage.serverAction.startFirstTopic",
};

function translateRecommendedAction(action: string, translate: TFunction): string {
    const key = SERVER_ACTION_KEY_BY_MESSAGE[action.trim()];
    return key ? translate(key) : action;
}

function statusTag(status: LessonStatus, translate: TFunction) {
    if (status === "completed") {
        return <Tag color="success">{translate("dashboard.student.lessonsPage.status.completed")}</Tag>;
    }

    if (status === "current") {
        return <Tag color="processing">{translate("dashboard.student.lessonsPage.status.inProgress")}</Tag>;
    }

    return null;
}

function getDifficultyLabel(level: number, translate: TFunction) {
    if (level === 1) {
        return translate("dashboard.student.lessonsPage.difficulty.supportedPace");
    }

    if (level === 3) {
        return translate("dashboard.student.lessonsPage.difficulty.advancedPace");
    }

    return translate("dashboard.student.lessonsPage.difficulty.standardPace");
}

function getPreferredTranslation(lesson: ILessonDetail) {
    return lesson.selectedTranslation
        ?? lesson.translations.find((translation) => translation.languageCode.toLowerCase() === lesson.preferredLanguageCode.toLowerCase())
        ?? lesson.translations.find((translation) => translation.languageCode.toLowerCase() === "en")
        ?? lesson.translations[0]
        ?? null;
}

function buildLessonSections(lesson: ILessonDetail, translation: ILessonTranslationSummary | null, translate: TFunction) {
    const sections: Array<{ heading: string; body: string }> = [];

    if (translation?.summary || lesson.summary) {
        sections.push({
            heading: translate("dashboard.student.lessonsPage.section.summary"),
            body: translation?.summary || lesson.summary,
        });
    }

    if (translation?.content) {
        sections.push({
            heading: translate("dashboard.student.lessonsPage.section.lessonContent"),
            body: translation.content,
        });
    } else if (lesson.learningObjective) {
        sections.push({
            heading: translate("dashboard.student.lessonsPage.section.learningObjective"),
            body: lesson.learningObjective,
        });
    }

    if (translation?.examples) {
        sections.push({
            heading: translate("dashboard.student.lessonsPage.section.examples"),
            body: translation.examples,
        });
    }

    if (translation?.revisionSummary || lesson.revisionSummary) {
        sections.push({
            heading: translate("dashboard.student.lessonsPage.section.revisionSummary"),
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
    onSelectLesson,
}: {
    subjectPath: IStudentLearningPath;
    topic: IStudentLearningPathTopic;
    lesson: IStudentLearningPathLesson;
    lessonDetail: ILessonDetail | null;
    loading: boolean;
    error: string | null;
    onBack: () => void;
    onOpenQuiz: () => void;
    onSelectLesson: (lessonId: string) => void;
}) {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const [aiOpen, setAiOpen] = useState(false);
    const translation = lessonDetail ? getPreferredTranslation(lessonDetail) : null;
    const sections = lessonDetail ? buildLessonSections(lessonDetail, translation, t) : [];
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
                    <Tag color="blue">{getDifficultyLabel(lesson.difficultyLevel, t)}</Tag>
                    <Tag>{`${lesson.estimatedMinutes} ${t("dashboard.student.lessonsPage.unit.minutesShort")}`}</Tag>
                    {isReviewMode ? <Tag color="success">{t("dashboard.student.lessonsPage.reviewMode")}</Tag> : null}
                </div>

                {loading ? (
                    <Skeleton active paragraph={{ rows: 6 }} title={false} />
                ) : error ? (
                    <Alert type="error" showIcon message={t("dashboard.student.lessonsPage.errors.unableToLoadLesson")} description={error} />
                ) : sections.length === 0 ? (
                    <Empty description={t("dashboard.student.lessonsPage.empty.lessonContentComingSoon")} />
                ) : (
                    sections.map((section) => (
                        <div key={section.heading}>
                            <div className={styles.sectionTitle}>{section.heading}</div>
                            <div className={styles.sectionText}>
                                <ReactMarkdown>{section.body}</ReactMarkdown>
                            </div>
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
                            {t("dashboard.student.lessonsPage.actions.takeQuiz")}
                        </Button>
                    ) : null}
                    {isReviewMode ? (
                        <Button disabled icon={<ReadOutlined />}>
                            {t("dashboard.student.lessonsPage.actions.reviewOnly")}
                        </Button>
                    ) : null}
                </div>
            </div>

            <div className={styles.progressPanel}>
                <Card title={t("dashboard.student.lessonsPage.progress.topicProgress")} className={styles.progressCard}>
                    <div className={styles.completionRow}>
                        <span>{t("dashboard.student.lessonsPage.progress.topicCompletion")}</span>
                        <span>{topicCompletion} %</span>
                    </div>
                    <Progress percent={topicCompletion} showInfo={false} strokeColor={UI_COLORS.PRIMARY} size="small" />

                    <div className={styles.topicList}>
                        {topic.lessons.map((item) => (
                            <button
                                key={item.lessonId}
                                className={styles.topicItem}
                                onClick={() => item.status !== "locked" && onSelectLesson(item.lessonId)}
                                style={{ background: "none", border: "none", cursor: item.status === "locked" ? "default" : "pointer", textAlign: "left", width: "100%" }}
                                type="button"
                            >
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
                            </button>
                        ))}
                    </div>
                </Card>

                <Card className={styles.aiCard}>
                    <MessageOutlined className={styles.aiIcon} />
                    <div className={styles.aiTitle}>{t("dashboard.student.lessonsPage.ai.needClearerExplanation")}</div>
                    <div className={styles.aiSubtitle}>
                        {t("dashboard.student.lessonsPage.ai.subtitle")}
                    </div>
                    <Button type="link" className={styles.aiLink} onClick={() => setAiOpen(true)}>
                        {t("dashboard.student.lessonsPage.actions.askAiTutor")}
                    </Button>
                </Card>

                <AiTutorDrawer
                    open={aiOpen}
                    onClose={() => setAiOpen(false)}
                    lessonTitle={lessonDetail?.title ?? lesson.title}
                    lessonContent={sections.map((s) => `## ${s.heading}\n\n${s.body}`).join("\n\n")}
                />
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
    const { t } = useTranslation();

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <Title level={2} style={{ marginBottom: 0 }}>{t("dashboard.student.lessonsPage.title")}</Title>
                    <Text type="secondary">{`${subjectPath.subjectName} · ${t("dashboard.student.lessonsPage.adaptiveLessonTrack")}`}</Text>
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
                        {topic.assignedDifficultyLevel ? <Tag color="blue">{getDifficultyLabel(topic.assignedDifficultyLevel, t)}</Tag> : null}
                        <Text type="secondary">{translateRecommendedAction(topic.recommendedAction, t)}</Text>
                    </div>

                    {topic.lessons.length === 0 ? (
                        <Empty description={t("dashboard.student.lessonsPage.empty.noAdaptiveLessonsForTopicYet")} />
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
                                            {`${lesson.estimatedMinutes} ${t("dashboard.student.lessonsPage.unit.minutesShort")} · ${getDifficultyLabel(lesson.difficultyLevel, t)}`}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.lessonRight}>
                                    {statusTag(lesson.status, t)}
                                    {lesson.actionState === "review" ? <Tag color="success">{t("dashboard.student.lessonsPage.tag.review")}</Tag> : null}
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
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentLanguage, isLoading: isLanguageUpdating } = useI18nState();
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

        const loadSubjectContext = async () => {
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

                if (nextSubjectId !== subjectIdParam) {
                    router.replace(`/student/lessons?subjectId=${nextSubjectId}`);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : t("dashboard.student.lessonsPage.errors.failedToLoadLessons"));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        if (!isLanguageUpdating) {
            void loadSubjectContext();
        }

        return () => {
            cancelled = true;
        };
    }, [currentLanguage, isLanguageUpdating, router, subjectIdParam]);

    useEffect(() => {
        if (!subjectPath) {
            return;
        }

        const validLessonIds = new Set(
            subjectPath.topics.flatMap((topic) => topic.lessons.map((lesson) => lesson.lessonId))
        );
        const nextLessonId =
            (lessonIdParam && validLessonIds.has(lessonIdParam) ? lessonIdParam : null)
            ?? getCurrentLesson(subjectPath)?.lesson.lessonId
            ?? null;

        setActiveLessonId(nextLessonId);

        if (!activeSubjectId || nextLessonId === lessonIdParam) {
            return;
        }

        if (nextLessonId) {
            router.replace(`/student/lessons?subjectId=${activeSubjectId}&lessonId=${nextLessonId}`);
            return;
        }

        router.replace(`/student/lessons?subjectId=${activeSubjectId}`);
    }, [activeSubjectId, lessonIdParam, router, subjectPath]);

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
                    setLessonError(loadError instanceof Error ? loadError.message : t("dashboard.student.lessonsPage.errors.failedToLoadLessonDetail"));
                    setLessonDetail(null);
                }
            } finally {
                if (!cancelled) {
                    setLessonLoading(false);
                }
            }
        };

        if (!isLanguageUpdating) {
            void loadLesson();
        }

        return () => {
            cancelled = true;
        };
    }, [activeLessonId, currentLanguage, isLanguageUpdating]);

    const openLessonQuiz = async (
        lesson: IStudentLearningPathLesson
    ) => {
        if (!activeSubjectId) {
            return false;
        }

        const assessmentId = lesson.quizAssessmentId;
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
                <Alert type="error" showIcon message={t("dashboard.student.lessonsPage.errors.unableToLoadLessons")} description={error} />
            ) : subjects.length === 0 || !subjectPath ? (
                <Empty description={t("dashboard.student.lessonsPage.empty.notEnrolled")} />
            ) : activeLesson && activeTopic ? (
                <>
                    <div className={styles.pageHeader}>
                        <div>
                            <Title level={2} style={{ marginBottom: 0 }}>{t("dashboard.student.lessonsPage.title")}</Title>
                            <Text type="secondary">{`${subjectPath.subjectName} · ${t("dashboard.student.lessonsPage.adaptiveLessonTrack")}`}</Text>
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
                        onSelectLesson={handleSelectLesson}
                        onOpenQuiz={() => {
                            void (async () => {
                                try {
                                    const opened = await openLessonQuiz(activeLesson);
                                    if (!opened) {
                                        messageApi.info(t("dashboard.student.lessonsPage.messages.noLessonQuizForLessonYet"));
                                    }
                                } catch (quizError) {
                                    messageApi.error(quizError instanceof Error ? quizError.message : t("dashboard.student.lessonsPage.errors.failedToOpenLessonQuiz"));
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
