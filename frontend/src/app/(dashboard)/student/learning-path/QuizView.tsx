"use client";

import { ArrowLeftOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Button, Progress, Tag, Typography } from "antd";
import { useState } from "react";
import { createStyles } from "antd-style";

const { Text } = Typography;

// ── Styles ────────────────────────────────────────────────────────────────────

const useStyles = createStyles(({ css, token }) => ({
    root: css`
        max-width: 640px;
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

    expression: css`
        font-size: 18px;
        font-weight: 600;
        color: ${token.colorTextHeading};
        text-align: center;
        margin: ${token.marginLG}px 0;
        letter-spacing: 0.5px;
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

    optionCorrect: css`
        border-color: #52c41a !important;
        background: #f6ffed !important;
        color: #389e0d !important;
    `,

    optionWrong: css`
        border-color: #ff4d4f !important;
        background: #fff2f0 !important;
        color: #cf1322 !important;
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
        justify-content: flex-end;
        margin-top: ${token.marginLG}px;
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

        &:disabled {
            background: ${token.colorFillSecondary} !important;
            border-color: ${token.colorBorderSecondary} !important;
            color: ${token.colorTextTertiary} !important;
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

    completionCard: css`
        background: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorderSecondary};
        border-radius: ${token.borderRadiusLG}px;
        padding: ${token.paddingXL}px;
        text-align: center;
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
    `,
}));

// ── Types ─────────────────────────────────────────────────────────────────────

interface Question {
    text: string;
    expression?: string;
    options: string[];
    correctIndex: number;
}

interface QuizData {
    topicName: string;
    questions: Question[];
}

// ── Static quiz bank (keyed by topic name) ────────────────────────────────────

const QUIZ_BANK: Record<string, QuizData> = {
    "Simplifying Exponential Expressions": {
        topicName: "Simplifying Exponential Expressions",
        questions: [
            {
                text: "Simplify the following expression:",
                expression: "(2x²y³) × (3xy²)",
                options: ["5x³y⁵", "6x²y⁵", "6x³y⁵", "5x²y⁶"],
                correctIndex: 2,
            },
            {
                text: "Simplify:",
                expression: "x⁵ ÷ x²",
                options: ["x⁷", "x³", "x¹⁰", "x²"],
                correctIndex: 1,
            },
            {
                text: "Which expression is equivalent to (a²)³?",
                options: ["a⁵", "a⁶", "a⁸", "2a³"],
                correctIndex: 1,
            },
            {
                text: "Simplify:",
                expression: "3⁰ + 4¹",
                options: ["4", "5", "7", "1"],
                correctIndex: 1,
            },
            {
                text: "Simplify:",
                expression: "(2³)²",
                options: ["2⁵", "2⁶", "4⁶", "64"],
                correctIndex: 1,
            },
        ],
    },
    "Newton's Second Law": {
        topicName: "Newton's Second Law",
        questions: [
            {
                text: "Newton's Second Law states that force equals:",
                options: ["mass × velocity", "mass × acceleration", "mass ÷ acceleration", "velocity ÷ time"],
                correctIndex: 1,
            },
            {
                text: "A 5 kg object accelerates at 3 m/s². What is the net force?",
                options: ["8 N", "2 N", "15 N", "1.67 N"],
                correctIndex: 2,
            },
            {
                text: "If the net force on an object doubles while mass stays the same, acceleration:",
                options: ["Halves", "Stays the same", "Doubles", "Quadruples"],
                correctIndex: 2,
            },
            {
                text: "The unit of force in the SI system is:",
                options: ["Joule", "Watt", "Newton", "Pascal"],
                correctIndex: 2,
            },
            {
                text: "A 10 N force produces 2 m/s² acceleration. What is the object's mass?",
                options: ["20 kg", "5 kg", "12 kg", "0.2 kg"],
                correctIndex: 1,
            },
        ],
    },
    "Cell Organelles": {
        topicName: "Cell Organelles",
        questions: [
            {
                text: "Which organelle is known as the powerhouse of the cell?",
                options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
                correctIndex: 2,
            },
            {
                text: "Which organelle controls the cell's activities?",
                options: ["Cell membrane", "Nucleus", "Vacuole", "Chloroplast"],
                correctIndex: 1,
            },
            {
                text: "Photosynthesis takes place in the:",
                options: ["Mitochondria", "Ribosome", "Nucleus", "Chloroplast"],
                correctIndex: 3,
            },
            {
                text: "Ribosomes are responsible for:",
                options: ["Energy production", "Protein synthesis", "Cell division", "Waste removal"],
                correctIndex: 1,
            },
            {
                text: "The cell membrane is made up of a:",
                options: ["Protein bilayer", "Carbohydrate bilayer", "Phospholipid bilayer", "Cellulose layer"],
                correctIndex: 2,
            },
        ],
    },
    "Argumentative Essays": {
        topicName: "Argumentative Essays",
        questions: [
            {
                text: "What is the main purpose of an argumentative essay?",
                options: [
                    "To describe a personal experience",
                    "To persuade the reader of a position using evidence",
                    "To narrate a story",
                    "To explain how something works",
                ],
                correctIndex: 1,
            },
            {
                text: "A thesis statement in an argumentative essay should be:",
                options: [
                    "A question",
                    "A vague general claim",
                    "A clear, debatable claim",
                    "A list of facts",
                ],
                correctIndex: 2,
            },
            {
                text: "Which of these is the best opening for an argumentative essay?",
                options: [
                    "In this essay I will write about school uniforms.",
                    "School uniforms should be mandatory because they reduce inequality and improve focus.",
                    "School uniforms are nice.",
                    "I think uniforms are okay.",
                ],
                correctIndex: 1,
            },
            {
                text: "A counter-argument in an essay is used to:",
                options: [
                    "Agree with the opposition and change your position",
                    "Introduce a new topic",
                    "Acknowledge and refute opposing views",
                    "Summarise the essay",
                ],
                correctIndex: 2,
            },
            {
                text: "Which connective is best for introducing a counter-argument?",
                options: ["Furthermore", "However", "Therefore", "In addition"],
                correctIndex: 1,
            },
        ],
    },
};

// Fallback generic quiz for topics not in the bank
function getFallbackQuiz(topicName: string): QuizData {
    return {
        topicName,
        questions: [
            {
                text: `Which statement best describes ${topicName}?`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctIndex: 1,
            },
        ],
    };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
    topicName: string;
    onExit: () => void;
}

export default function QuizView({ topicName, onExit }: Props) {
    const { styles } = useStyles();
    const quiz = QUIZ_BANK[topicName] ?? getFallbackQuiz(topicName);

    const [questionIndex, setQuestionIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const current = quiz.questions[questionIndex];
    const total = quiz.questions.length;
    const isCorrect = submitted && selected === current.correctIndex;

    const handleSubmit = () => {
        if (selected === null) return;
        setSubmitted(true);
        if (selected === current.correctIndex) setScore((s) => s + 1);
    };

    const handleNext = () => {
        if (questionIndex + 1 >= total) {
            setFinished(true);
        } else {
            setQuestionIndex((i) => i + 1);
            setSelected(null);
            setSubmitted(false);
        }
    };

    if (finished) {
        const percent = Math.round((score / total) * 100);
        return (
            <div className={styles.root}>
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    className={styles.backBtn}
                    onClick={onExit}
                    style={{ marginBottom: 24 }}
                >
                    Back to Learning Path
                </Button>
                <div className={styles.completionCard}>
                    <div className={styles.completionTitle}>Quiz Complete!</div>
                    <Text type="secondary">{quiz.topicName}</Text>
                    <div className={styles.completionScore}>{percent}%</div>
                    <Text type="secondary">
                        You answered {score} out of {total} questions correctly.
                    </Text>
                    <br />
                    <Button
                        type="primary"
                        className={styles.nextBtn}
                        style={{ marginTop: 24 }}
                        onClick={onExit}
                    >
                        Back to Learning Path
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            {/* Header */}
            <div className={styles.quizHeader}>
                <div className={styles.quizTitleBlock}>
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        className={styles.backBtn}
                        onClick={onExit}
                        style={{ padding: 0, marginBottom: 4 }}
                    >
                        Back to Learning Path
                    </Button>
                    <h2 className={styles.quizTitle}>Practice Quiz</h2>
                    <span className={styles.quizSubtitle}>{quiz.topicName}</span>
                </div>

                <div className={styles.progressBlock}>
                    <div className={styles.questionCounter}>
                        Question {questionIndex + 1} of {total}
                    </div>
                    <Progress
                        percent={Math.round(((questionIndex + 1) / total) * 100)}
                        showInfo={false}
                        strokeColor="#00b8a9"
                        size="small"
                    />
                </div>
            </div>

            {/* Question card */}
            <div className={styles.questionCard}>
                <Tag>Multiple Choice</Tag>

                <div className={styles.questionText}>{current.text}</div>

                {current.expression && (
                    <div className={styles.expression}>{current.expression}</div>
                )}

                <div className={styles.options}>
                    {current.options.map((opt, i) => {
                        let cls = styles.option;
                        if (submitted) {
                            if (i === current.correctIndex) cls = `${styles.option} ${styles.optionCorrect}`;
                            else if (i === selected) cls = `${styles.option} ${styles.optionWrong}`;
                        } else if (i === selected) {
                            cls = `${styles.option} ${styles.optionSelected}`;
                        }

                        return (
                            <button
                                key={opt}
                                className={cls}
                                onClick={() => !submitted && setSelected(i)}
                                disabled={submitted}
                            >
                                <span
                                    className={`${styles.radio} ${i === selected ? styles.radioSelected : ""}`}
                                >
                                    {i === selected && <span className={styles.radioInner} />}
                                </span>
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {/* Feedback */}
                {submitted && (
                    <div
                        className={`${styles.feedback} ${
                            isCorrect ? styles.feedbackCorrect : styles.feedbackWrong
                        }`}
                    >
                        {isCorrect ? (
                            <CheckCircleFilled className={styles.feedbackIcon} style={{ color: "#52c41a" }} />
                        ) : (
                            <CloseCircleFilled className={styles.feedbackIcon} style={{ color: "#ff4d4f" }} />
                        )}
                        <Text>
                            {isCorrect
                                ? "Correct! Well done."
                                : `Not quite. The correct answer is: ${current.options[current.correctIndex]}`}
                        </Text>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
                {!submitted ? (
                    <Button
                        type="primary"
                        className={styles.submitBtn}
                        disabled={selected === null}
                        onClick={handleSubmit}
                    >
                        Submit Answer
                    </Button>
                ) : (
                    <Button type="primary" className={styles.nextBtn} onClick={handleNext}>
                        {questionIndex + 1 >= total ? "See Results" : "Next Question"}
                    </Button>
                )}
            </div>
        </div>
    );
}
