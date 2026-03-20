"use client";

import { Badge, Card, Empty, Tabs, Typography } from "antd";
import type { ILessonTranslation, IUploadLessonOutput } from "@/providers/subject";
import { useStyles } from "./styles";

const { Text, Title, Paragraph } = Typography;

interface ILessonTranslationsPanelProps {
    createdLesson?: IUploadLessonOutput;
}

function TranslationContent({ translation }: { translation: ILessonTranslation }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <Text strong>Title</Text>
                <Paragraph>{translation.title}</Paragraph>
            </div>
            <div>
                <Text strong>Content</Text>
                <Paragraph style={{ whiteSpace: "pre-wrap" }}>{translation.content}</Paragraph>
            </div>
            {translation.summary && (
                <div>
                    <Text strong>Summary</Text>
                    <Paragraph>{translation.summary}</Paragraph>
                </div>
            )}
            {translation.examples && (
                <div>
                    <Text strong>Examples</Text>
                    <Paragraph style={{ whiteSpace: "pre-wrap" }}>{translation.examples}</Paragraph>
                </div>
            )}
            {translation.revisionSummary && (
                <div>
                    <Text strong>Revision Summary</Text>
                    <Paragraph>{translation.revisionSummary}</Paragraph>
                </div>
            )}
        </div>
    );
}

export function LessonTranslationsPanel({ createdLesson }: ILessonTranslationsPanelProps) {
    const { styles } = useStyles();

    if (!createdLesson) {
        return (
            <Card className={styles.reviewCard}>
                <Title level={4} className={styles.panelTitle}>Lesson Translations</Title>
                <Empty description="Create a lesson to see its translations here." />
            </Card>
        );
    }

    const tabItems = createdLesson.translations.map((translation) => ({
        key: translation.languageCode,
        label: (
            <span>
                {translation.languageName}
                {translation.isAutoTranslated && (
                    <Badge count="Auto" style={{ marginLeft: 6, backgroundColor: "#0f766e", fontSize: 10 }} />
                )}
            </span>
        ),
        children: <TranslationContent translation={translation} />,
    }));

    return (
        <Card className={styles.reviewCard}>
            <div className={styles.panelHeader}>
                <div>
                    <Title level={4} className={styles.panelTitle}>Lesson Translations</Title>
                    <Text className={styles.panelSubtitle}>
                        &quot;{createdLesson.title}&quot; — {createdLesson.translations.length} language{createdLesson.translations.length !== 1 ? "s" : ""}
                    </Text>
                </div>
            </div>

            {tabItems.length === 0 ? (
                <Empty description="No translations available." />
            ) : (
                <Tabs items={tabItems} className={styles.reviewTabs} />
            )}
        </Card>
    );
}
