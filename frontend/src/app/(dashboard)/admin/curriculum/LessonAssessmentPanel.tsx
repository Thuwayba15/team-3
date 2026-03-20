"use client";

import { Alert, Badge, Card, Divider, Spin, Tag, Typography } from "antd";
import ReactMarkdown from "react-markdown";
import type { IAssessmentResult } from "./types";
import { DIFFICULTY_COLOR, DIFFICULTY_LABEL } from "./types";

const { Text, Title } = Typography;

const OPTION_KEYS = ["A", "B", "C", "D"] as const;
const OPTION_FIELDS = ["optionA", "optionB", "optionC", "optionD"] as const;

interface ILessonAssessmentPanelProps {
    assessments?: IAssessmentResult[];
    isLoading: boolean;
}

export function LessonAssessmentPanel({ assessments, isLoading }: ILessonAssessmentPanelProps) {
    if (isLoading) {
        return <Spin style={{ display: "block", margin: "24px auto" }} />;
    }

    if (!assessments || assessments.length === 0) {
        return <Alert type="info" message="No assessments found for this lesson." showIcon />;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {assessments.map((assessment) => {
                const diffLabel = DIFFICULTY_LABEL[assessment.difficultyLevel] ?? `Level ${assessment.difficultyLevel}`;
                const diffColor = DIFFICULTY_COLOR[assessment.difficultyLevel] ?? "default";
                const englishTranslations = assessment.questions.map(
                    (q) => q.translations.find((t) => t.languageCode === "en") ?? q.translations[0]
                );

                return (
                    <Card
                        key={assessment.assessmentId}
                        size="small"
                        title={
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Text strong>{assessment.title}</Text>
                                <Tag color={diffColor}>{diffLabel}</Tag>
                                <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
                                    {assessment.totalMarks} marks
                                </Text>
                            </div>
                        }
                    >
                        {assessment.questions
                            .slice()
                            .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
                            .map((question, idx) => {
                                const translation = englishTranslations[idx];
                                if (!translation) return null;

                                return (
                                    <div key={question.questionId}>
                                        {idx > 0 && <Divider style={{ margin: "12px 0" }} />}

                                        <div style={{ marginBottom: 8 }}>
                                            <Text strong style={{ fontSize: 13 }}>Q{question.sequenceOrder}.</Text>
                                            <div style={{ marginLeft: 20, lineHeight: 1.6 }}>
                                                <ReactMarkdown>{translation.questionText}</ReactMarkdown>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 20 }}>
                                            {OPTION_KEYS.map((key, i) => {
                                                const text = translation[OPTION_FIELDS[i]];
                                                const isCorrect = question.correctAnswer?.toUpperCase() === key;
                                                return (
                                                    <div
                                                        key={key}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "flex-start",
                                                            gap: 8,
                                                            padding: "6px 10px",
                                                            borderRadius: 6,
                                                            background: isCorrect ? "#f6ffed" : "#fafafa",
                                                            border: `1px solid ${isCorrect ? "#b7eb8f" : "#e8e8e8"}`,
                                                        }}
                                                    >
                                                        <Badge
                                                            count={key}
                                                            style={{
                                                                backgroundColor: isCorrect ? "#52c41a" : "#d9d9d9",
                                                                color: isCorrect ? "#fff" : "#595959",
                                                                fontWeight: 600,
                                                                minWidth: 22,
                                                                height: 22,
                                                                lineHeight: "22px",
                                                                borderRadius: 4,
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                        <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5 }}>
                                                            <ReactMarkdown>{text}</ReactMarkdown>
                                                        </div>
                                                        {isCorrect && (
                                                            <Text style={{ color: "#52c41a", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                                                                ✓ Correct
                                                            </Text>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {translation.explanationText && (
                                            <div
                                                style={{
                                                    marginTop: 10,
                                                    marginLeft: 20,
                                                    padding: "8px 12px",
                                                    background: "#fffbe6",
                                                    border: "1px solid #ffe58f",
                                                    borderRadius: 6,
                                                    fontSize: 13,
                                                }}
                                            >
                                                <Text strong style={{ color: "#ad8b00" }}>Explanation: </Text>
                                                <ReactMarkdown>{translation.explanationText}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </Card>
                );
            })}
        </div>
    );
}
