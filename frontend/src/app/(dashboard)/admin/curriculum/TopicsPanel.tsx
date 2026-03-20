"use client";

import { Card, Empty, List, Spin, Typography } from "antd";
import type { ISubject, ITopic } from "@/providers/subject";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

interface ITopicsPanelProps {
    selectedSubject: ISubject | null;
    topics?: ITopic[];
    isTopicsLoading: boolean;
}

export function TopicsPanel({ selectedSubject, topics, isTopicsLoading }: ITopicsPanelProps) {
    const { styles } = useStyles();

    return (
        <Card className={styles.panelCard}>
            <div className={styles.panelHeader}>
                <div>
                    <Title level={4} className={styles.panelTitle}>
                        {selectedSubject ? `Topics — ${selectedSubject.name}` : "Topics"}
                    </Title>
                    <Text className={styles.panelSubtitle}>Topics for the selected subject.</Text>
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
                            <List.Item key={topic.id}>
                                <List.Item.Meta
                                    title={<Text strong>{topic.sequenceOrder}. {topic.name}</Text>}
                                    description={topic.description ?? "No description provided."}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Spin>
        </Card>
    );
}
