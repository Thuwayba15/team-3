"use client";

import { Card, Empty, List, Spin, Tag, Typography } from "antd";
import type { ILessonSummary, ISubject, ITopic } from "@/providers/subject";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

interface ITopicsPanelProps {
    selectedSubject: ISubject | null;
    topics?: ITopic[];
    isTopicsLoading: boolean;
    selectedTopicId: string;
    onSelectTopic: (topicId: string) => void;
    lessons?: ILessonSummary[];
    isLessonsLoading: boolean;
}

export function TopicsPanel({
    selectedSubject,
    topics,
    isTopicsLoading,
    selectedTopicId,
    onSelectTopic,
    lessons,
    isLessonsLoading,
}: ITopicsPanelProps) {
    const { styles } = useStyles();
    const selectedTopic = topics?.find((t) => t.id === selectedTopicId);

    return (
        <Card className={styles.panelCard}>
            <div className={styles.panelHeader}>
                <div>
                    <Title level={4} className={styles.panelTitle}>
                        {selectedSubject ? `Topics — ${selectedSubject.name}` : "Topics"}
                    </Title>
                    <Text className={styles.panelSubtitle}>Click a topic to view its lessons.</Text>
                </div>
            </div>

            <Spin spinning={isTopicsLoading}>
                {!selectedSubject ? (
                    <Empty description="Select a subject to view its topics." />
                ) : (
                    <List
                        dataSource={topics ?? []}
                        locale={{ emptyText: "No topics found for this subject." }}
                        renderItem={(topic) => (
                            <List.Item
                                key={topic.id}
                                onClick={() => onSelectTopic(topic.id)}
                                style={{
                                    cursor: "pointer",
                                    background: topic.id === selectedTopicId ? "var(--ant-color-primary-bg)" : undefined,
                                    borderRadius: 8,
                                    padding: "8px 12px",
                                }}
                            >
                                <List.Item.Meta
                                    title={<Text strong>{topic.sequenceOrder}. {topic.name}</Text>}
                                    description={topic.description ?? "No description provided."}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Spin>

            {selectedTopic && (
                <div style={{ marginTop: 24 }}>
                    <Title level={5} className={styles.panelTitle} style={{ marginBottom: 12 }}>
                        Lessons — {selectedTopic.name}
                    </Title>
                    <Spin spinning={isLessonsLoading}>
                        <List
                            dataSource={lessons ?? []}
                            locale={{ emptyText: "No lessons found for this topic." }}
                            renderItem={(lesson) => (
                                <List.Item key={lesson.id}>
                                    <List.Item.Meta
                                        title={<Text strong>{lesson.title}</Text>}
                                        description={
                                            <span>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {lesson.estimatedMinutes} min · Difficulty {lesson.difficultyLevel}
                                                </Text>
                                                {" "}
                                                <Tag color={lesson.isPublished ? "green" : "default"} style={{ marginLeft: 4 }}>
                                                    {lesson.isPublished ? "Published" : "Draft"}
                                                </Tag>
                                            </span>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Spin>
                </div>
            )}
        </Card>
    );
}
