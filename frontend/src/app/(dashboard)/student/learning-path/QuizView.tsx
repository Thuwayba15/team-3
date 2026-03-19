"use client";

import {
    ArrowLeftOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
} from "@ant-design/icons";
import { Button, Input, Progress, Tag, Typography, message } from "antd";
import { createStyles } from "antd-style";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    studentAssessmentService,
    type AssessmentType,
    type IStudentAssessment,
    type IStudentQuestionFeedback,
    type ISubmitStudentAssessmentOutput,
    type QuestionType,
} from "@/services/student/studentAssessmentService";

const { Text, Paragraph } = Typography;

const useStyles = createStyles(({ css, token }) => ({
    root: css`
        max-width: 720px;
        margin: 0 auto;
    `,

    quizHeader: css`
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: ${token.marginMD}px;
        margin-bottom: ${token.marginXL}px;
    `,

    backBtn: css`
        color: ${token.colorTextSecondary};
        padding: 0;
        font-size: 14px;

        &:hover {
            color: #00b8a9 !important;
        }
    `,

    quizTitleBlock: css`
        display: flex;
        flex-direction: column;
        gap: 2px;
    `,

    quizTitle: css`
        font-size: 22px;
        font-weight: 700;
        color: ${token.colorTextHeading};
        margin: 0;
    `,

    quizSubtitle: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
    `,

    questionCounter: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
        text-align: right;
        margin-bottom: 6px;
    `,

    progressBlock: css`
        min-width: 180px;
    `,

    questionCard: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadiusLG}px;
        padding: ${token.paddingXL}px;
    `,

    questionText: css`
        font-size: 16px;
        color: ${token.colorText};
        margin: ${token.marginMD}px 0;
    `,

    options: css`
        display: flex;
        flex-direction: column;
        gap: ${token.marginSM}px;
        margin-top: ${token.marginLG}px;
    `,

    option: css`
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadius}px;
        cursor: pointer;
        background: ${token.colorBgContainer};
        transition: all 0.18s;
        font-size: 14px;
        color: ${token.colorText};
        text-align: left;
        width: 100%;

        &:hover {
            border-color: #00b8a9;
            background: #f0fafa;
        }
    `,

    optionSelected: css`
        border-color: #00b8a9 !important;
        background: #f0fafa !important;
    `,

    radio: css`
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid ${token.colorBorderSecondary};
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.18s;
    `,

    radioSelected: css`
        border-color: #00b8a9 !important;
        background: #00b8a9;
    `,

    radioInner: css`
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #fff;
    `,

    footer: css`
        display: flex;
        justify-content: space-between;
        gap: ${token.marginSM}px;
        margin-top: ${token.marginLG}px;
        flex-wrap: wrap;
    `,

    submitBtn: css`
        background: #0f766e !important;
        border-color: #0f766e !important;
        height: 40px;
        padding: 0 28px;
        font-size: 15px;

        &:hover {
            background: #0d6460 !important;
            border-color: #0d6460 !important;
        }
    `,

    nextBtn: css`
        background: #00b8a9 !important;
        border-color: #00b8a9 !important;
        height: 40px;
        padding: 0 28px;
        font-size: 15px;

        &:hover {
            background: #00a89a !important;
            border-color: #00a89a !important;
        }
    `,

    completionCard: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadiusLG}px;
        padding: ${token.paddingXL}px;
    `,

    completionTitle: css`
        font-size: 24px;
        font-weight: 700;
        color: ${token.colorTextHeading};
        margin-bottom: ${token.marginSM}px;
    `,

    completionScore: css`
        font-size: 48px;
        font-weight: 800;
        color: #00b8a9;
        margin: ${token.marginLG}px 0;
        text-align: center;
    `,

    resultMeta: css`
        display: flex;
        gap: ${token.marginSM}px;
        flex-wrap: wrap;
        margin-bottom: ${token.marginLG}px;
    `,

    feedback: css`
        display: flex;
        align-items: flex-start;
        gap: ${token.marginSM}px;
        margin-top: ${token.marginMD}px;
        padding: ${token.paddingMD}px;
        border-radius: ${token.borderRadius}px;
    `,

    feedbackCorrect: css`
        background: #f6ffed;
        border: 1px solid #b7eb8f;
    `,

    feedbackWrong: css`
        background: #fff2f0;
        border: 1px solid #ffccc7;
    `,

    feedbackIcon: css`
        font-size: 18px;
        flex-shrink: 0;
        margin-top: 1px;
    `,

    resultList: css`
        display: flex;
        flex-direction: column;
        gap: ${token.marginMD}px;
    `,

    resultItem: css`
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadius}px;
        padding: ${token.paddingMD}px;
    `,
}));

interface Props {
    assessmentId: string;
    assessmentType: AssessmentType;
    onExit: () => void;
    onComplete: () => Promise<void> | void;
}

function getAssessmentLabel(type: AssessmentType) {
    if (type === 1) {
        return "Diagnostic";
    }

    if (type === 2) {
        return "Lesson Quiz";
    }

    return "Assessment";
}

function getQuestionLabel(type: QuestionType, t: ReturnType<typeof useTranslation>["t"]) {
    if (type === 2) {
        return "True / False";
    }

    if (type === 3) {
        return "Short Answer";
    }

    return t("dashboard.student.learningPathPage.multipleChoice");
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

function getQuestionOptions(question: IStudentAssessment["questions"][number]) {
    if (question.questionType === 2) {
        return [
            { label: "A", value: "A", text: question.optionA ?? "True" },
            { label: "B", value: "B", text: question.optionB ?? "False" },
        ];
    }

    return [
        { label: "A", value: "A", text: question.optionA },
        { label: "B", value: "B", text: question.optionB },
        { label: "C", value: "C", text: question.optionC },
        { label: "D", value: "D", text: question.optionD },
    ].filter((option): option is { label: string; value: string; text: string } => Boolean(option.text));
}

export default function QuizView({ assessmentId, assessmentType, onExit, onComplete }: Props) {
    const { styles } = useStyles();
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const [assessment, setAssessment] = useState<IStudentAssessment | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<ISubmitStudentAssessmentOutput | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadAssessment = async () => {
            setLoading(true);

            try {
                const response = await studentAssessmentService.getAssessment(assessmentId);
                if (!cancelled) {
                    setAssessment(response);
                    setCurrentIndex(0);
                    setSelectedOptions({});
                    setAnswerTexts({});
                    setResult(null);
                }
            } catch (error) {
                if (!cancelled) {
                    messageApi.error(error instanceof Error ? error.message : "Failed to load the assessment.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadAssessment();

        return () => {
            cancelled = true;
        };
    }, [assessmentId, messageApi]);

    const currentQuestion = assessment?.questions[currentIndex] ?? null;
    const totalQuestions = assessment?.questions.length ?? 0;
    const currentSelection = currentQuestion ? selectedOptions[currentQuestion.questionId] ?? null : null;
    const currentAnswerText = currentQuestion ? answerTexts[currentQuestion.questionId] ?? "" : "";
    const isCurrentQuestionAnswered = currentQuestion
        ? currentQuestion.questionType === 3
            ? currentAnswerText.trim().length > 0
            : Boolean(currentSelection)
        : false;

    const handleSubmitAssessment = async () => {
        if (!assessment) {
            return;
        }

        const answers = assessment.questions.map((question) => ({
            questionId: question.questionId,
            selectedOption: selectedOptions[question.questionId] ?? null,
            answerText: answerTexts[question.questionId]?.trim() || null,
        }));

        setSubmitting(true);

        try {
            const response = assessmentType === 1
                ? await studentAssessmentService.submitDiagnostic({
                    assessmentId: assessment.assessmentId,
                    answers,
                })
                : await studentAssessmentService.submitLessonQuiz({
                    assessmentId: assessment.assessmentId,
                    answers,
                });

            setResult(response);
        } catch (error) {
            messageApi.error(error instanceof Error ? error.message : "Failed to submit the assessment.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleFinish = async () => {
        await onComplete();
    };

    const feedbackByQuestionId = new Map<string, IStudentQuestionFeedback>(
        (result?.feedback ?? []).map((item) => [item.questionId, item])
    );

    if (loading || !assessment) {
        return (
            <div className={styles.root}>
                {contextHolder}
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    className={styles.backBtn}
                    onClick={onExit}
                    style={{ marginBottom: 24 }}
                >
                    {t("dashboard.student.learningPathPage.backToLearningPath")}
                </Button>
                <Progress percent={100} status="active" showInfo={false} />
            </div>
        );
    }

    if (result) {
        return (
            <div className={styles.root}>
                {contextHolder}
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    className={styles.backBtn}
                    onClick={async () => {
                        await handleFinish();
                    }}
                    style={{ marginBottom: 24 }}
                >
                    {t("dashboard.student.learningPathPage.backToLearningPath")}
                </Button>
                <div className={styles.completionCard}>
                    <div className={styles.completionTitle}>{assessment.title}</div>
                    <Text type="secondary">{getAssessmentLabel(assessment.assessmentType)}</Text>
                    <div className={styles.completionScore}>{Math.round(result.percentage)}%</div>

                    <div className={styles.resultMeta}>
                        <Tag color={result.passed ? "success" : "error"}>{result.passed ? "Passed" : "Needs review"}</Tag>
                        <Tag color="blue">{getDifficultyLabel(result.assignedDifficultyLevel)}</Tag>
                        <Tag>{`Attempt ${result.attemptNumber}`}</Tag>
                    </div>

                    <Paragraph>{result.nextRecommendedAction}</Paragraph>

                    <div className={styles.resultList}>
                        {assessment.questions.map((question, index) => {
                            const feedback = feedbackByQuestionId.get(question.questionId);
                            if (!feedback) {
                                return null;
                            }

                            return (
                                <div key={question.questionId} className={styles.resultItem}>
                                    <Text strong>{`Question ${index + 1}`}</Text>
                                    <div className={styles.questionText}>{question.questionText}</div>
                                    <div
                                        className={`${styles.feedback} ${
                                            feedback.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong
                                        }`}
                                    >
                                        {feedback.isCorrect ? (
                                            <CheckCircleFilled className={styles.feedbackIcon} style={{ color: "#52c41a" }} />
                                        ) : (
                                            <CloseCircleFilled className={styles.feedbackIcon} style={{ color: "#ff4d4f" }} />
                                        )}
                                        <div>
                                            <Text>{feedback.isCorrect ? "Correct response." : "Review this response."}</Text>
                                            {!feedback.isCorrect && feedback.correctAnswer && (
                                                <>
                                                    <br />
                                                    <Text type="secondary">{`Correct answer: ${feedback.correctAnswer}`}</Text>
                                                </>
                                            )}
                                            {feedback.explanationText && (
                                                <>
                                                    <br />
                                                    <Text type="secondary">{feedback.explanationText}</Text>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Button
                        type="primary"
                        className={styles.nextBtn}
                        style={{ marginTop: 24 }}
                        onClick={async () => {
                            await handleFinish();
                        }}
                    >
                        {t("dashboard.student.learningPathPage.backToLearningPath")}
                    </Button>
                </div>
            </div>
        );
    }

    const options = currentQuestion ? getQuestionOptions(currentQuestion) : [];

    return (
        <div className={styles.root}>
            {contextHolder}
            <div className={styles.quizHeader}>
                <div className={styles.quizTitleBlock}>
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        className={styles.backBtn}
                        onClick={onExit}
                        style={{ padding: 0, marginBottom: 4 }}
                    >
                        {t("dashboard.student.learningPathPage.backToLearningPath")}
                    </Button>
                    <h2 className={styles.quizTitle}>{assessment.title}</h2>
                    <span className={styles.quizSubtitle}>
                        {assessment.topicName} · {getAssessmentLabel(assessment.assessmentType)}
                    </span>
                </div>

                <div className={styles.progressBlock}>
                    <div className={styles.questionCounter}>
                        {t("dashboard.student.learningPathPage.questionCounter", { current: currentIndex + 1, total: totalQuestions })}
                    </div>
                    <Progress
                        percent={Math.round(((currentIndex + 1) / totalQuestions) * 100)}
                        showInfo={false}
                        strokeColor="#00b8a9"
                        size="small"
                    />
                </div>
            </div>

            {currentQuestion && (
                <div className={styles.questionCard}>
                    <Tag>{getQuestionLabel(currentQuestion.questionType, t)}</Tag>

                    <div className={styles.questionText}>{currentQuestion.questionText}</div>

                    {currentQuestion.hintText && (
                        <Paragraph type="secondary">{currentQuestion.hintText}</Paragraph>
                    )}

                    {currentQuestion.questionType === 3 ? (
                        <Input.TextArea
                            rows={4}
                            value={currentAnswerText}
                            onChange={(event) =>
                                setAnswerTexts((current) => ({
                                    ...current,
                                    [currentQuestion.questionId]: event.target.value,
                                }))
                            }
                            placeholder="Type your answer here"
                        />
                    ) : (
                        <div className={styles.options}>
                            {options.map((option) => (
                                <button
                                    key={`${currentQuestion.questionId}-${option.value}`}
                                    className={`${styles.option} ${
                                        currentSelection === option.value ? styles.optionSelected : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedOptions((current) => ({
                                            ...current,
                                            [currentQuestion.questionId]: option.value,
                                        }))
                                    }
                                    type="button"
                                >
                                    <span
                                        className={`${styles.radio} ${currentSelection === option.value ? styles.radioSelected : ""}`}
                                    >
                                        {currentSelection === option.value && <span className={styles.radioInner} />}
                                    </span>
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className={styles.footer}>
                <Button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                >
                    Previous
                </Button>

                {currentIndex + 1 < totalQuestions ? (
                    <Button
                        type="primary"
                        className={styles.nextBtn}
                        disabled={!isCurrentQuestionAnswered}
                        onClick={() => setCurrentIndex((value) => Math.min(totalQuestions - 1, value + 1))}
                    >
                        {t("dashboard.student.learningPathPage.nextQuestion")}
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        className={styles.submitBtn}
                        disabled={assessment.questions.some((question) =>
                            question.questionType === 3
                                ? !answerTexts[question.questionId]?.trim()
                                : !selectedOptions[question.questionId]
                        )}
                        loading={submitting}
                        onClick={() => void handleSubmitAssessment()}
                    >
                        Submit assessment
                    </Button>
                )}
            </div>
        </div>
    );
}
