"use client";

import {
    DeleteOutlined,
    EditOutlined,
    FileAddOutlined,
    RobotOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Empty,
    Form,
    Input,
    List,
    Modal,
    Popconfirm,
    Row,
    Space,
    Steps,
    Table,
    Tabs,
    Tag,
    Typography,
    Upload,
    message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload/interface";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout";
import { useStyles } from "./styles";

const { Text, Title } = Typography;
const { Dragger } = Upload;

type ReviewStatus = "Pending" | "Approved" | "Changes Requested";
type DraftSection = "topics" | "lessons" | "assessments";

interface ISubject {
    id: string;
    name: string;
    code: string;
    description: string;
}

interface IAiDraftItem {
    id: string;
    title: string;
    detail: string;
    confidence: number;
    reviewStatus: ReviewStatus;
}

interface IAiDraft {
    generatedAt: string;
    topics: IAiDraftItem[];
    lessons: IAiDraftItem[];
    assessments: IAiDraftItem[];
}

interface ISubjectFormValues {
    name: string;
    code: string;
    description: string;
}

const INITIAL_SUBJECTS: ISubject[] = [
    {
        id: "subject-1",
        name: "Mathematics",
        code: "MATH",
        description: "Core numeracy and problem-solving curriculum.",
    },
    {
        id: "subject-2",
        name: "Natural Sciences",
        code: "SCI",
        description: "Scientific inquiry, physics, chemistry, and biology foundations.",
    },
    {
        id: "subject-3",
        name: "English",
        code: "ENG",
        description: "Reading, writing, speaking, and comprehension competencies.",
    },
];

function createDraftTemplate(subjectName: string): IAiDraft {
    return {
        generatedAt: new Date().toLocaleString(),
        topics: [
            {
                id: "topic-1",
                title: `${subjectName}: Foundations`,
                detail: "AI grouped introductory concepts into one onboarding unit.",
                confidence: 94,
                reviewStatus: "Pending",
            },
            {
                id: "topic-2",
                title: `${subjectName}: Applied Practice`,
                detail: "AI proposed practical, exam-aligned application themes.",
                confidence: 88,
                reviewStatus: "Pending",
            },
        ],
        lessons: [
            {
                id: "lesson-1",
                title: "Lesson Sequence A",
                detail: "AI created scaffolded sequencing from beginner to advanced outcomes.",
                confidence: 86,
                reviewStatus: "Pending",
            },
            {
                id: "lesson-2",
                title: "Lesson Sequence B",
                detail: "AI recommended reinforcement lessons for difficult concepts.",
                confidence: 82,
                reviewStatus: "Pending",
            },
        ],
        assessments: [
            {
                id: "assessment-1",
                title: "Baseline Diagnostic",
                detail: "AI added a first-week diagnostic to calibrate learner level.",
                confidence: 89,
                reviewStatus: "Pending",
            },
            {
                id: "assessment-2",
                title: "End-of-Unit Checkpoint",
                detail: "AI proposed periodic formative checks after each concept block.",
                confidence: 91,
                reviewStatus: "Pending",
            },
        ],
    };
}

function createSubjectId(): string {
    return `subject-${Date.now()}`;
}

function getConfidenceClassName(value: number): "confidenceHigh" | "confidenceMedium" | "confidenceLow" {
    if (value >= 90) {
        return "confidenceHigh";
    }
    if (value >= 75) {
        return "confidenceMedium";
    }
    return "confidenceLow";
}

function getReviewStatusClassName(status: ReviewStatus): "reviewPending" | "reviewApproved" | "reviewChanges" {
    if (status === "Approved") {
        return "reviewApproved";
    }
    if (status === "Changes Requested") {
        return "reviewChanges";
    }
    return "reviewPending";
}

/** Admin curriculum management page for subject CRUD and AI-assisted curriculum review workflow. */
export default function AdminCurriculumPage() {
    const { styles } = useStyles();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [form] = Form.useForm<ISubjectFormValues>();

    const [subjects, setSubjects] = useState<ISubject[]>(INITIAL_SUBJECTS);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>(INITIAL_SUBJECTS[0].id);

    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

    const [documentsBySubject, setDocumentsBySubject] = useState<Record<string, UploadFile[]>>({});
    const [draftBySubject, setDraftBySubject] = useState<Record<string, IAiDraft>>({});

    const selectedSubject = useMemo(
        () => subjects.find((subject) => subject.id === selectedSubjectId) ?? null,
        [subjects, selectedSubjectId]
    );

    const selectedDocuments = useMemo(
        () => (selectedSubject ? documentsBySubject[selectedSubject.id] ?? [] : []),
        [documentsBySubject, selectedSubject]
    );

    const selectedDraft = useMemo(
        () => (selectedSubject ? draftBySubject[selectedSubject.id] : undefined),
        [draftBySubject, selectedSubject]
    );

    const flowStep = selectedDraft ? 2 : selectedDocuments.length > 0 ? 1 : 0;

    const openCreateSubjectModal = (): void => {
        setEditingSubjectId(null);
        form.resetFields();
        setIsSubjectModalOpen(true);
    };

    const openEditSubjectModal = (subject: ISubject): void => {
        setEditingSubjectId(subject.id);
        form.setFieldsValue({
            name: subject.name,
            code: subject.code,
            description: subject.description,
        });
        setIsSubjectModalOpen(true);
    };

    const closeSubjectModal = (): void => {
        setIsSubjectModalOpen(false);
        setEditingSubjectId(null);
        form.resetFields();
    };

    const handleSubmitSubject = async (): Promise<void> => {
        const values = await form.validateFields();

        if (editingSubjectId) {
            setSubjects((previous) =>
                previous.map((subject) =>
                    subject.id === editingSubjectId
                        ? {
                            ...subject,
                            ...values,
                        }
                        : subject
                )
            );
            messageApi.success("Subject updated.");
        } else {
            const createdSubject: ISubject = {
                id: createSubjectId(),
                ...values,
            };
            setSubjects((previous) => [createdSubject, ...previous]);
            setSelectedSubjectId(createdSubject.id);
            messageApi.success("Subject created.");
        }

        closeSubjectModal();
    };

    const handleDeleteSubject = (subjectId: string): void => {
        setSubjects((previous) => {
            const updated = previous.filter((subject) => subject.id !== subjectId);
            if (updated.length === 0) {
                setSelectedSubjectId("");
            } else if (selectedSubjectId === subjectId) {
                setSelectedSubjectId(updated[0].id);
            }
            return updated;
        });

        setDocumentsBySubject((previous) => {
            const next = { ...previous };
            delete next[subjectId];
            return next;
        });

        setDraftBySubject((previous) => {
            const next = { ...previous };
            delete next[subjectId];
            return next;
        });

        messageApi.success("Subject deleted.");
    };

    const handleUploadChange = (info: UploadChangeParam<UploadFile>): void => {
        if (!selectedSubject) {
            return;
        }

        setDocumentsBySubject((previous) => ({
            ...previous,
            [selectedSubject.id]: info.fileList,
        }));
    };

    const handleGenerateDraft = (): void => {
        if (!selectedSubject) {
            messageApi.warning("Create or select a subject first.");
            return;
        }

        if (selectedDocuments.length === 0) {
            messageApi.warning("Upload at least one curriculum source document first.");
            return;
        }

        setDraftBySubject((previous) => ({
            ...previous,
            [selectedSubject.id]: createDraftTemplate(selectedSubject.name),
        }));

        messageApi.success("AI draft generated. Review topics, lessons, and assessments below.");
    };

    const updateDraftItemStatus = (section: DraftSection, itemId: string, reviewStatus: ReviewStatus): void => {
        if (!selectedSubject) {
            return;
        }

        setDraftBySubject((previous) => {
            const existingDraft = previous[selectedSubject.id];
            if (!existingDraft) {
                return previous;
            }

            const updatedSection = existingDraft[section].map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        reviewStatus,
                    }
                    : item
            );

            return {
                ...previous,
                [selectedSubject.id]: {
                    ...existingDraft,
                    [section]: updatedSection,
                },
            };
        });
    };

    const approveAllDraftItems = (): void => {
        if (!selectedSubject || !selectedDraft) {
            return;
        }

        const updateStatus = (items: IAiDraftItem[]): IAiDraftItem[] => items.map((item) => ({ ...item, reviewStatus: "Approved" }));

        setDraftBySubject((previous) => ({
            ...previous,
            [selectedSubject.id]: {
                ...selectedDraft,
                topics: updateStatus(selectedDraft.topics),
                lessons: updateStatus(selectedDraft.lessons),
                assessments: updateStatus(selectedDraft.assessments),
            },
        }));

        messageApi.success("All draft items approved.");
    };

    const subjectColumns: ColumnsType<ISubject> = [
        {
            title: "Subject",
            dataIndex: "name",
            key: "name",
            render: (value: string, record: ISubject) => (
                <div className={styles.subjectNameCell}>
                    <Text className={styles.subjectName}>{value}</Text>
                    <Text className={styles.subjectCode}>{record.code}</Text>
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 130,
            render: (_value: unknown, record: ISubject) => (
                <Space size={8}>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        className={styles.iconAction}
                        onClick={(event) => {
                            event.stopPropagation();
                            openEditSubjectModal(record);
                        }}
                    />
                    <Popconfirm
                        title="Delete subject?"
                        description="This also removes uploaded files and generated drafts for the subject."
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={(event) => {
                            event?.stopPropagation();
                            handleDeleteSubject(record.id);
                        }}
                        onCancel={(event) => event?.stopPropagation()}
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className={styles.deleteAction}
                            onClick={(event) => event.stopPropagation()}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

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
            render: (value: number) => <span className={`${styles.confidenceText} ${styles[getConfidenceClassName(value)]}`}>{value}%</span>,
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
            render: (_value: unknown, record: IAiDraftItem) => (
                <Space size={6} wrap>
                    <Button
                        size="small"
                        className={styles.approveAction}
                        onClick={() => updateDraftItemStatus(section, record.id, "Approved")}
                    >
                        Approve
                    </Button>
                    <Button
                        size="small"
                        className={styles.requestChangesAction}
                        onClick={() => updateDraftItemStatus(section, record.id, "Changes Requested")}
                    >
                        Request Changes
                    </Button>
                </Space>
            ),
        },
    ];

    const uploadProps: UploadProps = {
        accept: ".pdf,.doc,.docx",
        beforeUpload: () => false,
        fileList: selectedDocuments,
        onChange: handleUploadChange,
        disabled: !selectedSubject,
        multiple: false,
    };

    return (
        <div>
            {messageContextHolder}

            <PageHeader
                title="Curriculum Management"
                subtitle="Create subjects, upload source documents, and review AI-generated curriculum drafts"
            />

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card className={styles.panelCard}>
                        <div className={styles.panelHeader}>
                            <div>
                                <Title level={4} className={styles.panelTitle}>Subjects</Title>
                                <Text className={styles.panelSubtitle}>Create, edit, and manage available subjects.</Text>
                            </div>
                            <Button type="primary" icon={<FileAddOutlined />} className={styles.primaryButton} onClick={openCreateSubjectModal}>
                                Add Subject
                            </Button>
                        </div>

                        <Table
                            className={styles.subjectTable}
                            columns={subjectColumns}
                            dataSource={subjects}
                            rowKey="id"
                            pagination={false}
                            scroll={{ x: "max-content" }}
                            onRow={(record) => ({
                                onClick: () => setSelectedSubjectId(record.id),
                            })}
                            rowClassName={(record) => (record.id === selectedSubjectId ? styles.selectedSubjectRow : "")}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card className={styles.panelCard}>
                        <div className={styles.panelHeader}>
                            <div>
                                <Title level={4} className={styles.panelTitle}>Document Upload</Title>
                                <Text className={styles.panelSubtitle}>Choose a subject and upload a textbook or study guide.</Text>
                            </div>
                            {selectedSubject && <Tag className={styles.selectedSubjectTag}>{selectedSubject.name}</Tag>}
                        </div>

                        <Steps
                            className={styles.steps}
                            current={flowStep}
                            items={[
                                { title: "Select Subject" },
                                { title: "Upload Document" },
                                { title: "Review AI Draft" },
                            ]}
                        />

                        <Dragger {...uploadProps} className={styles.uploadDragger}>
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined className={styles.uploadIcon} />
                            </p>
                            <p className={styles.uploadTitle}>Drop curriculum source file here or click to upload</p>
                            <p className={styles.uploadHint}>Supported formats: PDF, DOC, DOCX</p>
                        </Dragger>

                        {selectedDocuments.length > 0 && (
                            <List
                                className={styles.fileList}
                                dataSource={selectedDocuments}
                                renderItem={(file) => (
                                    <List.Item className={styles.fileItem}>
                                        <Text className={styles.fileName}>{file.name}</Text>
                                        <Text className={styles.fileSize}>{typeof file.size === "number" ? `${Math.round(file.size / 1024)} KB` : "Uploaded"}</Text>
                                    </List.Item>
                                )}
                            />
                        )}

                        <div className={styles.generateRow}>
                            <Button
                                type="primary"
                                icon={<RobotOutlined />}
                                className={styles.primaryButton}
                                disabled={!selectedSubject || selectedDocuments.length === 0}
                                onClick={handleGenerateDraft}
                            >
                                Generate AI Curriculum Draft
                            </Button>
                        </div>

                    </Card>
                </Col>
            </Row>

            <Card className={styles.reviewCard}>
                <div className={styles.panelHeader}>
                    <div>
                        <Title level={4} className={styles.panelTitle}>AI Draft Review</Title>
                        <Text className={styles.panelSubtitle}>Review generated topics, lessons, and assessments before publishing.</Text>
                    </div>
                    <Button className={styles.approveAllButton} onClick={approveAllDraftItems} disabled={!selectedDraft}>
                        Approve All
                    </Button>
                </div>

                {!selectedDraft ? (
                    <Empty description="Generate a draft to start review." />
                ) : (
                    <>
                        <Text className={styles.generatedAt}>Generated: {selectedDraft.generatedAt}</Text>

                        <Tabs
                            className={styles.reviewTabs}
                            items={[
                                {
                                    key: "topics",
                                    label: "Topics",
                                    children: (
                                        <Table
                                            className={styles.reviewTable}
                                            rowKey="id"
                                            columns={createDraftColumns("topics")}
                                            dataSource={selectedDraft.topics}
                                            pagination={false}
                                            scroll={{ x: "max-content" }}
                                        />
                                    ),
                                },
                                {
                                    key: "lessons",
                                    label: "Lessons",
                                    children: (
                                        <Table
                                            className={styles.reviewTable}
                                            rowKey="id"
                                            columns={createDraftColumns("lessons")}
                                            dataSource={selectedDraft.lessons}
                                            pagination={false}
                                            scroll={{ x: "max-content" }}
                                        />
                                    ),
                                },
                                {
                                    key: "assessments",
                                    label: "Assessments",
                                    children: (
                                        <Table
                                            className={styles.reviewTable}
                                            rowKey="id"
                                            columns={createDraftColumns("assessments")}
                                            dataSource={selectedDraft.assessments}
                                            pagination={false}
                                            scroll={{ x: "max-content" }}
                                        />
                                    ),
                                },
                            ]}
                        />
                    </>
                )}
            </Card>

            <Modal
                title={editingSubjectId ? "Edit Subject" : "Create Subject"}
                open={isSubjectModalOpen}
                onCancel={closeSubjectModal}
                onOk={handleSubmitSubject}
                okText={editingSubjectId ? "Save Changes" : "Create Subject"}
            >
                <Form form={form} layout="vertical" className={styles.subjectForm}>
                    <Form.Item<ISubjectFormValues>
                        label="Subject Name"
                        name="name"
                        rules={[{ required: true, message: "Subject name is required." }]}
                    >
                        <Input placeholder="e.g. Mathematics" />
                    </Form.Item>

                    <Form.Item<ISubjectFormValues>
                        label="Code"
                        name="code"
                        rules={[{ required: true, message: "Subject code is required." }]}
                    >
                        <Input placeholder="e.g. MATH" maxLength={12} />
                    </Form.Item>

                    <Form.Item<ISubjectFormValues>
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Description is required." }]}
                    >
                        <Input.TextArea rows={4} placeholder="Briefly describe the subject curriculum scope." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
