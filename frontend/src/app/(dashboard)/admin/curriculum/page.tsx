"use client";

import { BookOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Card, Col, Descriptions, Drawer, Form, List, Popconfirm, Row, Select, Space, Spin, Tabs, Tag, Typography, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { apiClient } from "@/lib/api/client";
import { GENERATE_LESSON_QUIZ_ENDPOINT, GET_LESSON_ASSESSMENTS_ENDPOINT } from "@/constants/api";
import { PageHeader } from "@/components/layout";
import { SubjectProvider, useSubjectActions, useSubjectState } from "@/providers/subject";
import type { ISubject, IUploadLessonInput } from "@/providers/subject";
import { AiDraftReview } from "./AiDraftReview";
import { CreateLessonModal } from "./CreateLessonModal";
import { LessonAssessmentPanel } from "./LessonAssessmentPanel";
import { LessonTranslationsPanel } from "./LessonTranslationsPanel";
import { SubjectFormModal } from "./SubjectFormModal";
import type { IAiDraft, IAiDraftItem, IAssessmentResult, ISubjectFormValues, DraftSection, ReviewStatus } from "./types";

const { Text, Title } = Typography;

function CurriculumPageContent() {
    const { t } = useTranslation();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [form] = Form.useForm<ISubjectFormValues>();

    const { subjects, isLoading, isTopicsLoading, topics, isLessonsLoading, lessons, isLessonLoading, selectedLesson, isCreatingLesson, createdLesson, isError, errorMessage } = useSubjectState();
    const { getSubjects, getTopicsBySubject, getLessonsByTopic, getLesson, createLesson } = useSubjectActions();

    const [userSelectedSubjectId, setSelectedSubjectId] = useState<string>("");
    const selectedSubjectId = userSelectedSubjectId || (subjects?.[0]?.id ?? "");
    const [selectedTopicId, setSelectedTopicId] = useState<string>("");
    const [isLessonDrawerOpen, setIsLessonDrawerOpen] = useState(false);
    const [assessments, setAssessments] = useState<IAssessmentResult[] | undefined>(undefined);
    const [isAssessmentsLoading, setIsAssessmentsLoading] = useState(false);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
    const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
    const [currentLessonDifficulty, setCurrentLessonDifficulty] = useState<number>(1);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
    const [draftBySubject, setDraftBySubject] = useState<Record<string, IAiDraft>>({});

    useEffect(() => { getSubjects(); }, []);

    useEffect(() => {
        if (selectedSubjectId) {
            getTopicsBySubject(selectedSubjectId);
            setSelectedTopicId("");
        }
    }, [selectedSubjectId]);

    useEffect(() => {
        if (isError && errorMessage) messageApi.error(errorMessage);
    }, [isError, errorMessage]);

    const selectedSubject = useMemo(
        () => subjects?.find((s) => s.id === selectedSubjectId) ?? null,
        [subjects, selectedSubjectId]
    );

    const selectedTopic = useMemo(
        () => topics?.find((t) => t.id === selectedTopicId) ?? null,
        [topics, selectedTopicId]
    );

    const selectedDraft = useMemo(
        () => (selectedSubject ? draftBySubject[selectedSubject.id] : undefined),
        [draftBySubject, selectedSubject]
    );

    const openEditModal = (subject: ISubject): void => {
        setEditingSubjectId(subject.id);
        form.setFieldsValue({ name: subject.name, gradeLevel: subject.gradeLevel, description: subject.description });
        setIsSubjectModalOpen(true);
    };

    const closeSubjectModal = (): void => {
        setIsSubjectModalOpen(false);
        setEditingSubjectId(null);
        form.resetFields();
    };

    const handleSubmitSubject = async (): Promise<void> => {
        await form.validateFields();
        messageApi.info("Subject management API coming soon.");
        closeSubjectModal();
    };

    const handleDelete = (subjectId: string): void => {
        if (selectedSubjectId === subjectId && subjects && subjects.length > 0) {
            setSelectedSubjectId(subjects.find((s) => s.id !== subjectId)?.id ?? "");
        }
        setDraftBySubject((prev) => { const next = { ...prev }; delete next[subjectId]; return next; });
        messageApi.info("Subject deletion API coming soon.");
    };

    const handleCreateLesson = async (input: IUploadLessonInput): Promise<void> => {
        const result = await createLesson(input);
        if (result) {
            setIsLessonModalOpen(false);
            messageApi.success(`Lesson "${result.title}" created with ${result.translations.length} translations.`);
        }
    };

    const handleSelectTopic = (topicId: string): void => {
        setSelectedTopicId(topicId);
        getLessonsByTopic(topicId);
    };

    const loadAssessments = async (lessonId: string): Promise<void> => {
        setIsAssessmentsLoading(true);
        try {
            const response = await apiClient.get<{ result: { assessments: IAssessmentResult[] } }>(GET_LESSON_ASSESSMENTS_ENDPOINT, {
                params: { lessonId },
            });
            setAssessments(response.data.result?.assessments ?? []);
        } catch {
            setAssessments([]);
        } finally {
            setIsAssessmentsLoading(false);
        }
    };

    const handleViewLesson = async (lessonId: string, difficultyLevel: number): Promise<void> => {
        setIsLessonDrawerOpen(true);
        setAssessments(undefined);
        setCurrentLessonId(lessonId);
        setCurrentLessonDifficulty(difficultyLevel);
        getLesson(lessonId);
        loadAssessments(lessonId);
    };

    const handleGenerateQuiz = async (): Promise<void> => {
        if (!currentLessonId) return;
        setIsGeneratingQuiz(true);
        try {
            await apiClient.post(GENERATE_LESSON_QUIZ_ENDPOINT, { lessonId: currentLessonId, difficultyLevel: currentLessonDifficulty, isPublished: true });
            messageApi.success("Quiz generated successfully.");
            loadAssessments(currentLessonId);
        } catch {
            messageApi.error("Failed to generate quiz. Please try again.");
        } finally {
            setIsGeneratingQuiz(false);
        }
    };

    const handleUpdateItemStatus = (section: DraftSection, itemId: string, status: ReviewStatus): void => {
        if (!selectedSubject || !selectedDraft) return;
        setDraftBySubject((prev) => ({
            ...prev,
            [selectedSubject.id]: {
                ...selectedDraft,
                [section]: selectedDraft[section].map((item) =>
                    item.id === itemId ? { ...item, reviewStatus: status } : item
                ),
            },
        }));
    };

    const handleApproveAll = (): void => {
        if (!selectedSubject || !selectedDraft) return;
        const approve = (items: IAiDraftItem[]) => items.map((item) => ({ ...item, reviewStatus: "Approved" as ReviewStatus }));
        setDraftBySubject((prev) => ({
            ...prev,
            [selectedSubject.id]: {
                ...selectedDraft,
                topics: approve(selectedDraft.topics),
                lessons: approve(selectedDraft.lessons),
                assessments: approve(selectedDraft.assessments),
            },
        }));
        messageApi.success("All draft items approved.");
    };

    const subjectOptions = subjects?.map((s) => ({
        label: `${s.name}${s.gradeLevel ? ` — ${s.gradeLevel}` : ""}`,
        value: s.id,
    })) ?? [];

    const topicOptions = topics?.map((t) => ({
        label: `${t.sequenceOrder}. ${t.name}`,
        value: t.id,
    })) ?? [];

    return (
        <div>
            {messageContextHolder}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <PageHeader title={t("dashboard.admin.curriculum.title")} subtitle={t("dashboard.admin.curriculum.subtitle")} />
                <Button type="primary" icon={<BookOutlined />} onClick={() => setIsLessonModalOpen(true)} style={{ marginTop: 8 }}>
                    Create Lessons
                </Button>
            </div>

            <Card style={{ marginBottom: 16 }}>
                <Row gutter={[24, 16]} align="bottom">
                    <Col xs={24} md={12}>
                        <Text strong style={{ display: "block", marginBottom: 6 }}>Subject</Text>
                        <Space.Compact style={{ width: "100%" }}>
                            <Select
                                style={{ flex: 1 }}
                                placeholder="Select a subject"
                                loading={isLoading}
                                value={selectedSubjectId || undefined}
                                onChange={(val) => setSelectedSubjectId(val)}
                                options={subjectOptions}
                            />
                            {selectedSubject && (
                                <>
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={() => openEditModal(selectedSubject)}
                                    />
                                    <Popconfirm
                                        title="Delete subject?"
                                        description="This also removes generated drafts for the subject."
                                        okText="Delete"
                                        cancelText="Cancel"
                                        onConfirm={() => handleDelete(selectedSubject.id)}
                                    >
                                        <Button icon={<DeleteOutlined />} danger />
                                    </Popconfirm>
                                </>
                            )}
                        </Space.Compact>
                    </Col>

                    <Col xs={24} md={12}>
                        <Text strong style={{ display: "block", marginBottom: 6 }}>Topic</Text>
                        <Spin spinning={isTopicsLoading} size="small">
                            <Select
                                style={{ width: "100%" }}
                                placeholder={selectedSubjectId ? "Select a topic" : "Select a subject first"}
                                disabled={!selectedSubjectId || isTopicsLoading}
                                value={selectedTopicId || undefined}
                                onChange={handleSelectTopic}
                                options={topicOptions}
                            />
                        </Spin>
                    </Col>
                </Row>
            </Card>

            {selectedTopicId && (
                <Card style={{ marginBottom: 16 }}>
                    <Title level={5} style={{ marginBottom: 12, marginTop: 0 }}>
                        Lessons — {selectedTopic?.name}
                    </Title>
                    <Spin spinning={isLessonsLoading}>
                        <List
                            dataSource={lessons ?? []}
                            locale={{ emptyText: "No lessons found for this topic." }}
                            renderItem={(lesson) => (
                                <List.Item
                                    key={lesson.id}
                                    actions={[
                                        <Button
                                            key="view"
                                            type="text"
                                            icon={<EyeOutlined />}
                                            onClick={() => handleViewLesson(lesson.id, lesson.difficultyLevel)}
                                        >
                                            View
                                        </Button>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={<Text strong>{lesson.title}</Text>}
                                        description={
                                            <Space size={8}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {lesson.estimatedMinutes} min
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    Difficulty {lesson.difficultyLevel}
                                                </Text>
                                                <Tag color={lesson.isPublished ? "green" : "default"}>
                                                    {lesson.isPublished ? "Published" : "Draft"}
                                                </Tag>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Spin>
                </Card>
            )}

            <LessonTranslationsPanel createdLesson={createdLesson} />

            <AiDraftReview selectedDraft={selectedDraft} onApproveAll={handleApproveAll} onUpdateItemStatus={handleUpdateItemStatus} />

            <SubjectFormModal open={isSubjectModalOpen} editingSubjectId={editingSubjectId} form={form} onCancel={closeSubjectModal} onOk={handleSubmitSubject} />

            <CreateLessonModal
                open={isLessonModalOpen}
                subjects={subjects ?? []}
                initialSubjectId={selectedSubjectId}
                isCreating={isCreatingLesson}
                onCancel={() => setIsLessonModalOpen(false)}
                onSubmit={handleCreateLesson}
            />

            <Drawer
                title={selectedLesson?.title ?? "Lesson Detail"}
                open={isLessonDrawerOpen}
                onClose={() => setIsLessonDrawerOpen(false)}
                width={700}
            >
                <Spin spinning={isLessonLoading}>
                    {selectedLesson && (
                        <Tabs
                            defaultActiveKey="details"
                            items={[
                                {
                                    key: "details",
                                    label: "Details",
                                    children: (
                                        <Descriptions column={2} size="small">
                                            <Descriptions.Item label="Duration">{selectedLesson.estimatedMinutes} min</Descriptions.Item>
                                            <Descriptions.Item label="Difficulty">{selectedLesson.difficultyLevel}</Descriptions.Item>
                                            <Descriptions.Item label="Status">
                                                <Tag color={selectedLesson.isPublished ? "green" : "default"}>
                                                    {selectedLesson.isPublished ? "Published" : "Draft"}
                                                </Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Translations">{selectedLesson.translations.length}</Descriptions.Item>
                                            {selectedLesson.learningObjective && (
                                                <Descriptions.Item label="Learning Objective" span={2}>
                                                    {selectedLesson.learningObjective}
                                                </Descriptions.Item>
                                            )}
                                            {selectedLesson.summary && (
                                                <Descriptions.Item label="Summary" span={2}>
                                                    {selectedLesson.summary}
                                                </Descriptions.Item>
                                            )}
                                            {selectedLesson.revisionSummary && (
                                                <Descriptions.Item label="Revision Summary" span={2}>
                                                    {selectedLesson.revisionSummary}
                                                </Descriptions.Item>
                                            )}
                                        </Descriptions>
                                    ),
                                },
                                {
                                    key: "translations",
                                    label: `Translations (${selectedLesson.translations.length})`,
                                    children: selectedLesson.translations.length > 0 ? (
                                        <Tabs
                                            tabPosition="left"
                                            items={selectedLesson.translations.map((t) => ({
                                                key: t.languageCode,
                                                label: t.languageName,
                                                children: (
                                                    <div style={{ paddingLeft: 8 }}>
                                                        {t.isAutoTranslated && (
                                                            <Tag color="blue" style={{ marginBottom: 12 }}>Auto-translated</Tag>
                                                        )}
                                                        {[
                                                            { label: "Title", value: t.title },
                                                            { label: "Content", value: t.content },
                                                            { label: "Summary", value: t.summary },
                                                            { label: "Examples", value: t.examples },
                                                            { label: "Revision Summary", value: t.revisionSummary },
                                                        ].filter((f) => f.value).map((field) => (
                                                            <div key={field.label} style={{ marginBottom: 16 }}>
                                                                <Text strong style={{ display: "block", marginBottom: 4 }}>{field.label}</Text>
                                                                <div
                                                                    style={{
                                                                        padding: "10px 14px",
                                                                        background: "#fafafa",
                                                                        borderRadius: 6,
                                                                        border: "1px solid #f0f0f0",
                                                                        lineHeight: 1.7,
                                                                        fontSize: 13,
                                                                    }}
                                                                >
                                                                    <ReactMarkdown>{field.value ?? ""}</ReactMarkdown>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ),
                                            }))}
                                        />
                                    ) : <Text type="secondary">No translations available.</Text>,
                                },
                                {
                                    key: "assessment",
                                    label: `Assessment${assessments ? ` (${assessments.length})` : ""}`,
                                    children: (
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                                <Button
                                                    type="primary"
                                                    loading={isGeneratingQuiz}
                                                    onClick={handleGenerateQuiz}
                                                >
                                                    Generate {["Easy", "Medium", "Hard"][currentLessonDifficulty - 1]} Quiz
                                                </Button>
                                            </div>
                                            <LessonAssessmentPanel
                                                assessments={assessments}
                                                isLoading={isAssessmentsLoading}
                                            />
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    )}
                </Spin>
            </Drawer>
        </div>
    );
}

/** Admin curriculum management page for subject CRUD and AI-assisted curriculum review workflow. */
export default function AdminCurriculumPage() {
    return (
        <SubjectProvider>
            <CurriculumPageContent />
        </SubjectProvider>
    );
}
