"use client";

import { BookOutlined, ExperimentOutlined, GlobalOutlined, HeartOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Table, Tabs, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout";
import { useStyles } from "./styles";

const { Text, Title } = Typography;

type CurriculumTab = "subjects" | "topics" | "lessons" | "questions";

interface ISubjectSummary {
    id: string;
    name: string;
    icon: ReactNode;
    toneClassName: "subjectTonePrimary" | "subjectToneInfo" | "subjectToneSecondary" | "subjectToneDanger";
    topics: number;
    lessons: number;
    questions: number;
}

interface ITopicRow {
    id: number;
    subject: string;
    topic: string;
    lessons: number;
    status: "Published" | "Draft";
}

interface ILessonRow {
    id: number;
    topic: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    status: "Published" | "Draft";
}

interface IQuestionRow {
    id: number;
    lesson: string;
    preview: string;
    type: "Short Answer" | "MCQ";
}

const TAB_LABELS: Record<CurriculumTab, string> = {
    subjects: "Subjects",
    topics: "Topics",
    lessons: "Lessons",
    questions: "Questions",
};

const TAB_ADD_LABEL: Record<CurriculumTab, string> = {
    subjects: "Subject",
    topics: "Topic",
    lessons: "Lesson",
    questions: "Question",
};

const SUBJECTS: ISubjectSummary[] = [
    {
        id: "mathematics",
        name: "Mathematics",
        icon: <BookOutlined />,
        toneClassName: "subjectTonePrimary",
        topics: 12,
        lessons: 48,
        questions: 240,
    },
    {
        id: "natural-sciences",
        name: "Natural Sciences",
        icon: <ExperimentOutlined />,
        toneClassName: "subjectToneInfo",
        topics: 8,
        lessons: 32,
        questions: 160,
    },
    {
        id: "english",
        name: "English",
        icon: <GlobalOutlined />,
        toneClassName: "subjectToneSecondary",
        topics: 10,
        lessons: 40,
        questions: 200,
    },
    {
        id: "life-skills",
        name: "Life Skills",
        icon: <HeartOutlined />,
        toneClassName: "subjectToneDanger",
        topics: 6,
        lessons: 24,
        questions: 120,
    },
];

const TOPICS_DATA: ITopicRow[] = [
    { id: 1, subject: "Mathematics", topic: "Algebra", lessons: 5, status: "Published" },
    { id: 2, subject: "Mathematics", topic: "Geometry", lessons: 4, status: "Published" },
    { id: 3, subject: "Natural Sciences", topic: "Physics", lessons: 6, status: "Draft" },
];

const LESSONS_DATA: ILessonRow[] = [
    { id: 1, topic: "Algebra", title: "Introduction to Equations", difficulty: "Easy", status: "Published" },
    { id: 2, topic: "Algebra", title: "Solving Quadratic Equations", difficulty: "Hard", status: "Published" },
    { id: 3, topic: "Geometry", title: "Properties of Triangles", difficulty: "Medium", status: "Draft" },
];

const QUESTIONS_DATA: IQuestionRow[] = [
    { id: 1, lesson: "Introduction to Equations", preview: "Solve for x: 2x + 5 = 15", type: "Short Answer" },
    { id: 2, lesson: "Introduction to Equations", preview: "Which of the following is a linear equation?", type: "MCQ" },
    { id: 3, lesson: "Solving Quadratic Equations", preview: "Factorise: x² + 5x + 6", type: "Short Answer" },
];

function getStatusClassName(status: "Published" | "Draft"): "statusPublished" | "statusDraft" {
    return status === "Published" ? "statusPublished" : "statusDraft";
}

function getDifficultyClassName(difficulty: "Easy" | "Medium" | "Hard"): "difficultyEasy" | "difficultyMedium" | "difficultyHard" {
    if (difficulty === "Easy") {
        return "difficultyEasy";
    }
    if (difficulty === "Medium") {
        return "difficultyMedium";
    }
    return "difficultyHard";
}

/** Admin curriculum management page for subjects, topics, lessons, and questions. */
export default function AdminCurriculumPage() {
    const { styles } = useStyles();
    const [activeTab, setActiveTab] = useState<CurriculumTab>("subjects");

    const topicColumns: ColumnsType<ITopicRow> = useMemo(() => [
        { title: "Subject", dataIndex: "subject", key: "subject" },
        {
            title: "Topic Name",
            dataIndex: "topic",
            key: "topic",
            render: (value: string) => <span className={styles.primaryCellText}>{value}</span>,
        },
        { title: "Lessons Count", dataIndex: "lessons", key: "lessons" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (value: ITopicRow["status"]) => (
                <Tag className={`${styles.statusTag} ${styles[getStatusClassName(value)]}`}>
                    {value}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: () => <Button type="link" className={styles.tableAction}>Edit</Button>,
        },
    ], [styles]);

    const lessonColumns: ColumnsType<ILessonRow> = useMemo(() => [
        { title: "Topic", dataIndex: "topic", key: "topic" },
        {
            title: "Lesson Title",
            dataIndex: "title",
            key: "title",
            render: (value: string) => <span className={styles.primaryCellText}>{value}</span>,
        },
        {
            title: "Difficulty",
            dataIndex: "difficulty",
            key: "difficulty",
            render: (value: ILessonRow["difficulty"]) => (
                <Tag className={`${styles.statusTag} ${styles[getDifficultyClassName(value)]}`}>
                    {value}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (value: ILessonRow["status"]) => (
                <Tag className={`${styles.statusTag} ${styles[getStatusClassName(value)]}`}>
                    {value}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: () => <Button type="link" className={styles.tableAction}>Edit</Button>,
        },
    ], [styles]);

    const questionColumns: ColumnsType<IQuestionRow> = useMemo(() => [
        { title: "Lesson", dataIndex: "lesson", key: "lesson" },
        {
            title: "Question Preview",
            dataIndex: "preview",
            key: "preview",
            render: (value: string) => <span className={styles.previewText}>{value}</span>,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (value: IQuestionRow["type"]) => <Tag className={`${styles.statusTag} ${styles.typeTag}`}>{value}</Tag>,
        },
        {
            title: "Actions",
            key: "actions",
            render: () => <Button type="link" className={styles.tableAction}>Edit</Button>,
        },
    ], [styles]);

    return (
        <div>
            <PageHeader
                title="Curriculum Management"
                subtitle="Manage subjects, topics, lessons, and questions"
            />

            <div className={styles.topBar}>
                <Button type="primary" className={styles.addButton}>
                    Add New {TAB_ADD_LABEL[activeTab]}
                </Button>
            </div>

            <Tabs
                className={styles.tabs}
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as CurriculumTab)}
                items={Object.entries(TAB_LABELS).map(([key, label]) => ({ key, label }))}
            />

            {activeTab === "subjects" && (
                <Row gutter={[16, 16]}>
                    {SUBJECTS.map((subject) => (
                        <Col key={subject.id} xs={24} md={12} xl={6}>
                            <Card className={styles.subjectCard}>
                                <div className={`${styles.subjectIconWrap} ${styles[subject.toneClassName]}`}>
                                    <span className={styles.subjectIcon}>{subject.icon}</span>
                                </div>
                                <Title level={4} className={styles.subjectTitle}>{subject.name}</Title>

                                <div className={styles.subjectStats}>
                                    <div className={styles.subjectStatRow}>
                                        <Text className={styles.subjectStatLabel}>Topics</Text>
                                        <Text className={styles.subjectStatValue}>{subject.topics}</Text>
                                    </div>
                                    <div className={styles.subjectStatRow}>
                                        <Text className={styles.subjectStatLabel}>Lessons</Text>
                                        <Text className={styles.subjectStatValue}>{subject.lessons}</Text>
                                    </div>
                                    <div className={styles.subjectStatRow}>
                                        <Text className={styles.subjectStatLabel}>Questions</Text>
                                        <Text className={styles.subjectStatValue}>{subject.questions}</Text>
                                    </div>
                                </div>

                                <Button className={styles.manageButton} block>
                                    Manage
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {activeTab === "topics" && (
                <Card className={styles.tableCard}>
                    <Table
                        className={styles.table}
                        columns={topicColumns}
                        dataSource={TOPICS_DATA}
                        rowKey="id"
                        pagination={false}
                        scroll={{ x: "max-content" }}
                    />
                </Card>
            )}

            {activeTab === "lessons" && (
                <Card className={styles.tableCard}>
                    <Table
                        className={styles.table}
                        columns={lessonColumns}
                        dataSource={LESSONS_DATA}
                        rowKey="id"
                        pagination={false}
                        scroll={{ x: "max-content" }}
                    />
                </Card>
            )}

            {activeTab === "questions" && (
                <Card className={styles.tableCard}>
                    <Table
                        className={styles.table}
                        columns={questionColumns}
                        dataSource={QUESTIONS_DATA}
                        rowKey="id"
                        pagination={false}
                        scroll={{ x: "max-content" }}
                    />
                </Card>
            )}
        </div>
    );
}
