"use client";

import { Alert, Button, Card, Col, Collapse, Form, Input, InputNumber, Row, Select, Spin, Tabs, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout";
import {
    adminService,
    type ICurriculum,
    type ILessonDetail,
    type ILessonInput,
    type ITopicInput,
} from "@/services/admin/adminService";

const DIFFICULTY_OPTIONS = [
    { value: 1, label: "Easy" },
    { value: 2, label: "Medium" },
    { value: 3, label: "Hard" },
];

const LANGUAGE_OPTIONS = [
    { value: "en", label: "English" },
    { value: "zu", label: "isiZulu" },
    { value: "st", label: "Sesotho" },
    { value: "af", label: "Afrikaans" },
];

export default function AdminCurriculumPage() {
    const [curriculum, setCurriculum] = useState<ICurriculum | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creatingTopic, setCreatingTopic] = useState(false);
    const [creatingLesson, setCreatingLesson] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState<string>("");
    const [selectedLesson, setSelectedLesson] = useState<ILessonDetail | null>(null);
    const [translationLanguage, setTranslationLanguage] = useState("en");
    const [topicForm] = Form.useForm<ITopicInput>();
    const [lessonForm] = Form.useForm<ILessonInput>();
    const [translationForm] = Form.useForm();

    const loadCurriculum = async () => {
        setLoading(true);
        try {
            const data = await adminService.getCurriculum();
            setCurriculum(data);
            setError(null);
            const firstTopicId = data.topics[0]?.id ?? "";
            setSelectedTopicId((previous) => previous || firstTopicId);
        } catch {
            setError("Could not load the Life Sciences curriculum.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadCurriculum();
    }, []);

    const selectedTopic = useMemo(
        () => curriculum?.topics.find((topic) => topic.id === selectedTopicId) ?? curriculum?.topics[0] ?? null,
        [curriculum, selectedTopicId]
    );

    const handleCreateTopic = async () => {
        setCreatingTopic(true);
        try {
            const values = await topicForm.validateFields();
            await adminService.createTopic(values);
            topicForm.resetFields();
            message.success("Topic created.");
            await loadCurriculum();
        } catch {
            message.error("Could not create topic.");
        } finally {
            setCreatingTopic(false);
        }
    };

    const handleCreateLesson = async () => {
        if (!selectedTopic) {
            message.warning("Select a topic first.");
            return;
        }

        setCreatingLesson(true);
        try {
            const values = await lessonForm.validateFields();
            const lesson = await adminService.createLesson(selectedTopic.id, values);
            setSelectedLesson(lesson);
            lessonForm.resetFields();
            message.success("Lesson created.");
            await loadCurriculum();
        } catch {
            message.error("Could not create lesson.");
        } finally {
            setCreatingLesson(false);
        }
    };

    const handleSaveTranslation = async () => {
        if (!selectedLesson) {
            message.warning("Create a lesson first or select one from a topic.");
            return;
        }

        try {
            const values = await translationForm.validateFields();
            const lesson = await adminService.upsertTranslation(selectedLesson.id, {
                languageCode: translationLanguage,
                title: values.title,
                content: values.content,
                summary: values.summary,
                examples: values.examples,
                revisionSummary: values.revisionSummary,
            });
            setSelectedLesson(lesson);
            message.success("Translation saved.");
        } catch {
            message.error("Could not save lesson translation.");
        }
    };

    const openLesson = (lessonId: string) => {
        adminService.getLesson(lessonId)
            .then(setSelectedLesson)
            .catch(() => message.error("Could not load lesson details."));
    };

    useEffect(() => {
        const translation = selectedLesson?.translations.find((item) => item.languageCode === translationLanguage);
        translationForm.setFieldsValue({
            title: translation?.title ?? selectedLesson?.title ?? "",
            content: translation?.content ?? "",
            summary: translation?.summary ?? selectedLesson?.summary ?? "",
            examples: translation?.examples ?? "",
            revisionSummary: translation?.revisionSummary ?? selectedLesson?.revisionSummary ?? "",
        });
    }, [selectedLesson, translationLanguage, translationForm]);

    return (
        <div>
            <PageHeader title="Curriculum" subtitle="Manage the Life Sciences subject, topics, lessons, and translations for the MVP." />

            {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

            <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={10}>
                        <Card title="Add Topic">
                            <Form
                                form={topicForm}
                                layout="vertical"
                                initialValues={{ difficultyLevel: 2, sequenceOrder: 1, isActive: true, masteryThreshold: 0.7 }}
                            >
                                <Form.Item name="name" label="Topic Name" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="description" label="Description">
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item name="difficultyLevel" label="Difficulty" rules={[{ required: true }]}>
                                            <Select options={DIFFICULTY_OPTIONS} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="sequenceOrder" label="Sequence" rules={[{ required: true }]}>
                                            <InputNumber min={1} style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item name="masteryThreshold" label="Mastery Threshold" rules={[{ required: true }]}>
                                    <InputNumber min={0.1} max={1} step={0.05} style={{ width: "100%" }} />
                                </Form.Item>
                                <Button type="primary" loading={creatingTopic} onClick={() => void handleCreateTopic()}>
                                    Create Topic
                                </Button>
                            </Form>
                        </Card>
                    </Col>

                    <Col xs={24} lg={14}>
                        <Card title={curriculum ? `${curriculum.subjectName} (${curriculum.gradeLevel})` : "Life Sciences"}>
                            <Collapse
                                items={(curriculum?.topics ?? []).map((topic) => ({
                                    key: topic.id,
                                    label: `${topic.sequenceOrder}. ${topic.name}`,
                                    children: (
                                        <div>
                                            <p>{topic.description || "No topic description yet."}</p>
                                            <Button type="link" onClick={() => setSelectedTopicId(topic.id)} style={{ paddingLeft: 0 }}>
                                                Use this topic in the lesson editor
                                            </Button>
                                            {(topic.lessons ?? []).map((lesson) => (
                                                <div key={lesson.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                                                    <span>{lesson.title}</span>
                                                    <Button type="link" onClick={() => openLesson(lesson.id)}>
                                                        Open lesson
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ),
                                }))}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Card title={`Add Lesson${selectedTopic ? ` - ${selectedTopic.name}` : ""}`}>
                            <Form
                                form={lessonForm}
                                layout="vertical"
                                initialValues={{ difficultyLevel: 2, estimatedMinutes: 20, isPublished: true }}
                            >
                                <Form.Item name="title" label="Lesson Title" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="summary" label="Summary">
                                    <Input.TextArea rows={2} />
                                </Form.Item>
                                <Form.Item name="learningObjective" label="Learning Objective">
                                    <Input.TextArea rows={2} />
                                </Form.Item>
                                <Form.Item name="revisionSummary" label="Revision Summary">
                                    <Input.TextArea rows={2} />
                                </Form.Item>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Form.Item name="difficultyLevel" label="Difficulty" rules={[{ required: true }]}>
                                            <Select options={DIFFICULTY_OPTIONS} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="estimatedMinutes" label="Estimated Minutes" rules={[{ required: true }]}>
                                            <InputNumber min={5} style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Button type="primary" loading={creatingLesson} onClick={() => void handleCreateLesson()}>
                                    Create Lesson
                                </Button>
                            </Form>
                        </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Card title={selectedLesson ? `Translations - ${selectedLesson.title}` : "Lesson Translation"}>
                            <Tabs
                                activeKey={translationLanguage}
                                onChange={setTranslationLanguage}
                                items={LANGUAGE_OPTIONS.map((language) => ({
                                    key: language.value,
                                    label: language.label,
                                    children: (
                                        <Form form={translationForm} layout="vertical">
                                            <Form.Item name="title" label="Translated Title" rules={[{ required: true }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="content" label="Content" rules={[{ required: true }]}>
                                                <Input.TextArea rows={6} />
                                            </Form.Item>
                                            <Form.Item name="summary" label="Summary">
                                                <Input.TextArea rows={2} />
                                            </Form.Item>
                                            <Form.Item name="examples" label="Examples">
                                                <Input.TextArea rows={2} />
                                            </Form.Item>
                                            <Form.Item name="revisionSummary" label="Revision Summary">
                                                <Input.TextArea rows={2} />
                                            </Form.Item>
                                            <Button type="primary" disabled={!selectedLesson} onClick={() => void handleSaveTranslation()}>
                                                Save Translation
                                            </Button>
                                        </Form>
                                    ),
                                }))}
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
}
