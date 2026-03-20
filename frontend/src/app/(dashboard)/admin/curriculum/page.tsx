"use client";

import { BookOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { SubjectProvider, useSubjectActions, useSubjectState } from "@/providers/subject";
import type { ISubject, IUploadLessonInput } from "@/providers/subject";
import { AiDraftReview } from "./AiDraftReview";
import { CreateLessonModal } from "./CreateLessonModal";
import { LessonTranslationsPanel } from "./LessonTranslationsPanel";
import { SubjectFormModal } from "./SubjectFormModal";
import { SubjectsPanel } from "./SubjectsPanel";
import { TopicsPanel } from "./TopicsPanel";
import type { IAiDraft, IAiDraftItem, ISubjectFormValues, DraftSection, ReviewStatus } from "./types";

function CurriculumPageContent() {
    const { t } = useTranslation();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [form] = Form.useForm<ISubjectFormValues>();

    const { subjects, isLoading, isTopicsLoading, topics, isCreatingLesson, createdLesson, isError, errorMessage } = useSubjectState();
    const { getSubjects, getTopicsBySubject, createLesson } = useSubjectActions();

    const [userSelectedSubjectId, setSelectedSubjectId] = useState<string>("");
    const selectedSubjectId = userSelectedSubjectId || (subjects?.[0]?.id ?? "");
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
    const [draftBySubject, setDraftBySubject] = useState<Record<string, IAiDraft>>({});

    useEffect(() => { getSubjects(); }, []);

    useEffect(() => {
        if (selectedSubjectId) getTopicsBySubject(selectedSubjectId);
    }, [selectedSubjectId]);

    useEffect(() => {
        if (isError && errorMessage) messageApi.error(errorMessage);
    }, [isError, errorMessage]);

    const selectedSubject = useMemo(
        () => subjects?.find((s) => s.id === selectedSubjectId) ?? null,
        [subjects, selectedSubjectId]
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

    return (
        <div>
            {messageContextHolder}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <PageHeader title={t("dashboard.admin.curriculum.title")} subtitle={t("dashboard.admin.curriculum.subtitle")} />
                <Button type="primary" icon={<BookOutlined />} onClick={() => setIsLessonModalOpen(true)} style={{ marginTop: 8 }}>
                    Create Lessons
                </Button>   
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <SubjectsPanel
                        subjects={subjects}
                        isLoading={isLoading}
                        selectedSubjectId={selectedSubjectId}
                        onSelectSubject={setSelectedSubjectId}
                        onEditSubject={openEditModal}
                        onDeleteSubject={handleDelete}
                    />
                </Col>
                <Col xs={24} lg={14}>
                    <TopicsPanel selectedSubject={selectedSubject} topics={topics} isTopicsLoading={isTopicsLoading} />
                </Col>
            </Row>

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
