"use client";

import { Form, Input, InputNumber, Modal, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { getCachedResource } from "@/lib/api/requestCache";
import { useI18nState } from "@/providers/i18n";
import { TOPIC_GET_BY_SUBJECT_ENDPOINT } from "@/constants/api";
import type { ISubject, ITopic, IUploadLessonInput } from "@/providers/subject";

const { TextArea } = Input;

interface ICreateLessonFormValues {
    subjectId: string;
    topicId: string;
    title: string;
    content: string;
    summary?: string;
    examples?: string;
    revisionSummary?: string;
    learningObjective?: string;
    difficultyLevel: number;
    estimatedMinutes: number;
    isPublished: boolean;
    sourceLanguageCode: string;
}

interface ICreateLessonModalProps {
    open: boolean;
    subjects: ISubject[];
    initialSubjectId: string;
    isCreating: boolean;
    onCancel: () => void;
    onSubmit: (input: IUploadLessonInput) => void;
}

const DIFFICULTY_OPTIONS = [
    { label: "Easy", value: 1 },
    { label: "Medium", value: 2 },
    { label: "Hard", value: 3 },
];

const LANGUAGE_OPTIONS = [
    { label: "English", value: "en" },
    { label: "Afrikaans", value: "af" },
    { label: "Zulu", value: "zu" },
    { label: "Sotho", value: "st" },
];

interface IAbpResponse<T> { result: T; }

export function CreateLessonModal({ open, subjects, initialSubjectId, isCreating, onCancel, onSubmit }: ICreateLessonModalProps) {
    const [form] = Form.useForm<ICreateLessonFormValues>();
    const [modalTopics, setModalTopics] = useState<ITopic[]>([]);
    const [isLoadingTopics, setIsLoadingTopics] = useState(false);
    const { currentLanguage } = useI18nState();
    const languageKey = currentLanguage ?? "default";

    useEffect(() => {
        if (open) {
            form.setFieldsValue({ subjectId: initialSubjectId, difficultyLevel: 2, estimatedMinutes: 15, isPublished: true, sourceLanguageCode: "en" });
            if (initialSubjectId) fetchTopics(initialSubjectId);
        } else {
            form.resetFields();
            setModalTopics([]);
        }
    }, [open, initialSubjectId]);

    const fetchTopics = async (subjectId: string): Promise<void> => {
        setIsLoadingTopics(true);
        try {
            const topics = await getCachedResource(`subjects:topics:${languageKey}:${subjectId}`, async () => {
                const response = await apiClient.get<IAbpResponse<ITopic[]>>(TOPIC_GET_BY_SUBJECT_ENDPOINT, { params: { subjectId } });
                return response.data.result;
            }, 300000);
            setModalTopics(topics);
        } catch {
            setModalTopics([]);
        } finally {
            setIsLoadingTopics(false);
        }
    };

    const handleSubjectChange = (subjectId: string): void => {
        form.setFieldValue("topicId", undefined);
        setModalTopics([]);
        fetchTopics(subjectId);
    };

    const handleOk = async (): Promise<void> => {
        const values = await form.validateFields();
        const subject = subjects.find((s) => s.id === values.subjectId);
        const topic = modalTopics.find((t) => t.id === values.topicId);
        onSubmit({
            ...values,
            topicName: topic?.name ?? "",
            topicDescription: topic?.description ?? null,
            gradeLevel: subject?.gradeLevel,
            description: subject?.description,
        });
    };

    return (
        <Modal title="Create Lesson" open={open} onCancel={onCancel} onOk={handleOk} okText="Create & Translate" confirmLoading={isCreating} width={700}>
            <Form form={form} layout="vertical">
                <Form.Item label="Subject" name="subjectId" rules={[{ required: true, message: "Select a subject." }]}>
                    <Select placeholder="Select subject" options={subjects.map((s) => ({ label: s.name, value: s.id }))} onChange={handleSubjectChange} />
                </Form.Item>

                <Form.Item label="Topic" name="topicId" rules={[{ required: true, message: "Select a topic." }]}>
                    <Select placeholder="Select topic" loading={isLoadingTopics} disabled={isLoadingTopics || modalTopics.length === 0}
                        options={modalTopics.map((t) => ({ label: `${t.sequenceOrder}. ${t.name}`, value: t.id }))} />
                </Form.Item>

                <Form.Item label="Lesson Title" name="title" rules={[{ required: true, message: "Title is required." }]}>
                    <Input placeholder="e.g. Introduction to Algebra" />
                </Form.Item>

                <Form.Item label="Content" name="content" rules={[{ required: true, message: "Content is required." }]}>
                    <TextArea rows={5} placeholder="Full lesson content..." />
                </Form.Item>

                <Form.Item label="Summary" name="summary">
                    <TextArea rows={2} placeholder="Brief summary of the lesson." />
                </Form.Item>

                <Form.Item label="Examples" name="examples">
                    <TextArea rows={2} placeholder="Worked examples or sample problems." />
                </Form.Item>

                <Form.Item label="Revision Summary" name="revisionSummary">
                    <TextArea rows={2} placeholder="Key points for revision." />
                </Form.Item>

                <Form.Item label="Learning Objective" name="learningObjective">
                    <Input placeholder="What learners will achieve." />
                </Form.Item>

                <Form.Item label="Difficulty" name="difficultyLevel" rules={[{ required: true }]}>
                    <Select options={DIFFICULTY_OPTIONS} />
                </Form.Item>

                <Form.Item label="Estimated Minutes" name="estimatedMinutes" rules={[{ required: true }]}>
                    <InputNumber min={1} max={300} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Source Language" name="sourceLanguageCode" rules={[{ required: true }]}>
                    <Select options={LANGUAGE_OPTIONS} />
                </Form.Item>

                <Form.Item label="Publish immediately" name="isPublished" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
}
