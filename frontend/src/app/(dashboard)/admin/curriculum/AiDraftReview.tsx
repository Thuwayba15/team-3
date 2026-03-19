"use client";

import { Button, Card, Empty, Table, Tabs, Tag, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { IAiDraft, IAiDraftItem, DraftSection, ReviewStatus } from "./types";
import { getConfidenceClassName, getReviewStatusClassName } from "./types";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

interface IAiDraftReviewProps {
    selectedDraft?: IAiDraft;
    onApproveAll: () => void;
    onUpdateItemStatus: (section: DraftSection, itemId: string, status: ReviewStatus) => void;
}

export function AiDraftReview({ selectedDraft, onApproveAll, onUpdateItemStatus }: IAiDraftReviewProps) {
    const { styles } = useStyles();

    const createDraftColumns = (section: DraftSection): ColumnsType<IAiDraftItem> => [
        {
            title: "Item",
            dataIndex: "title",
            key: "title",
            render: (value: string, record: IAiDraftItem) => (
                <div className={styles.reviewItemCell}>
                    <Text className={styles.reviewItemTitle}>{value}</Text>
                    <Text className={styles.reviewItemDetail}>{record.detail}</Text>
                </div>
            ),
        },
        {
            title: "Confidence",
            dataIndex: "confidence",
            key: "confidence",
            width: 120,
            render: (value: number) => (
                <span className={`${styles.confidenceText} ${styles[getConfidenceClassName(value)]}`}>{value}%</span>
            ),
        },
        {
            title: "Review",
            dataIndex: "reviewStatus",
            key: "reviewStatus",
            width: 170,
            render: (value: ReviewStatus) => (
                <Tag className={`${styles.reviewStatusTag} ${styles[getReviewStatusClassName(value)]}`}>{value}</Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 210,
            render: (_: unknown, record: IAiDraftItem) => (
                <Space size={6} wrap>
                    <Button size="small" className={styles.approveAction} onClick={() => onUpdateItemStatus(section, record.id, "Approved")}>
                        Approve
                    </Button>
                    <Button size="small" className={styles.requestChangesAction} onClick={() => onUpdateItemStatus(section, record.id, "Changes Requested")}>
                        Request Changes
                    </Button>
                </Space>
            ),
        },
    ];

    const tabItems = (["topics", "lessons", "assessments"] as DraftSection[]).map((section) => ({
        key: section,
        label: section.charAt(0).toUpperCase() + section.slice(1),
        children: (
            <Table
                className={styles.reviewTable}
                rowKey="id"
                columns={createDraftColumns(section)}
                dataSource={selectedDraft?.[section] ?? []}
                pagination={false}
                scroll={{ x: "max-content" }}
            />
        ),
    }));

    return (
        <Card className={styles.reviewCard}>
            <div className={styles.panelHeader}>
                <div>
                    <Title level={4} className={styles.panelTitle}>AI Draft Review</Title>
                    <Text className={styles.panelSubtitle}>Review generated topics, lessons, and assessments before publishing.</Text>
                </div>
                <Button className={styles.approveAllButton} onClick={onApproveAll} disabled={!selectedDraft}>
                    Approve All
                </Button>
            </div>

            {!selectedDraft ? (
                <Empty description="Generate a draft to start review." />
            ) : (
                <>
                    <Text className={styles.generatedAt}>Generated: {selectedDraft.generatedAt}</Text>
                    <Tabs className={styles.reviewTabs} items={tabItems} />
                </>
            )}
        </Card>
    );
}
