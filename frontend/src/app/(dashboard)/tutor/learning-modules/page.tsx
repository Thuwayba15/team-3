"use client";

import { BookOutlined, InboxOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Collapse,
    Input,
    Radio,
    Select,
    Typography,
    Upload,
} from "antd";
import { useState } from "react";
import { useStyles } from "./styles";

const { Title, Text } = Typography;

interface ModuleItem {
    label: string;
}

interface SubjectGroup {
    key: string;
    subject: string;
    modules: ModuleItem[];
}

const LIBRARY: SubjectGroup[] = [
    {
        key: "mathematics",
        subject: "Mathematics",
        modules: [
            { label: "Algebra" },
            { label: "Geometry" },
            { label: "Trigonometry" },
        ],
    },
    {
        key: "natural-sciences",
        subject: "Natural Sciences",
        modules: [{ label: "Physics" }, { label: "Chemistry" }],
    },
    {
        key: "english",
        subject: "English",
        modules: [{ label: "Grammar" }, { label: "Literature" }],
    },
];

const SUBJECTS = [
    "Mathematics",
    "Natural Sciences",
    "English",
    "Life Sciences",
    "History",
];

type Difficulty = "Easy" | "Medium" | "Hard";

interface FormState {
    subject: string;
    topic: string;
    title: string;
    content: string;
    difficulty: Difficulty;
}

const INITIAL_FORM: FormState = {
    subject: "Mathematics",
    topic: "",
    title: "",
    content: "",
    difficulty: "Medium",
};

export default function TutorLearningModulesPage() {
    const { styles } = useStyles();
    const [form, setForm] = useState<FormState>(INITIAL_FORM);

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    const collapseItems = LIBRARY.map(({ key, subject, modules }) => ({
        key,
        label: subject,
        children: (
            <>
                {modules.map(({ label }) => (
                    <div key={label} className={styles.moduleItem}>
                        <BookOutlined className={styles.moduleIcon} />
                        {label}
                    </div>
                ))}
            </>
        ),
    }));

    return (
        <div>
            <div className={styles.pageHeader}>
                <Title level={2} style={{ marginBottom: 0 }}>
                    Learning Module Management
                </Title>
                <Text type="secondary">
                    Create and organize curriculum content
                </Text>
            </div>

            <div className={styles.layout}>
                {/* Left — module library */}
                <Card title="Module Library" className={styles.libraryCard}>
                    <Collapse
                        defaultActiveKey={LIBRARY.map((g) => g.key)}
                        className={styles.collapse}
                        items={collapseItems}
                    />
                </Card>

                {/* Right — create new module form */}
                <Card title="Create New Module" className={styles.formCard}>
                    {/* Subject + Topic */}
                    <div className={styles.formRow}>
                        <div>
                            <span className={styles.fieldLabel}>Subject</span>
                            <Select
                                style={{ width: "100%" }}
                                value={form.subject}
                                onChange={(v) => update("subject", v)}
                                options={SUBJECTS.map((s) => ({
                                    label: s,
                                    value: s,
                                }))}
                            />
                        </div>
                        <div>
                            <span className={styles.fieldLabel}>Topic</span>
                            <Input
                                placeholder="e.g., Algebra"
                                value={form.topic}
                                onChange={(e) =>
                                    update("topic", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Lesson title */}
                    <div className={styles.formField}>
                        <span className={styles.fieldLabel}>Lesson Title</span>
                        <Input
                            placeholder="e.g., Introduction to Quadratic Equations"
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                        />
                    </div>

                    {/* Lesson content */}
                    <div className={styles.formField}>
                        <span className={styles.fieldLabel}>
                            Lesson Content
                        </span>
                        <Input.TextArea
                            rows={6}
                            placeholder="Write the lesson content here..."
                            value={form.content}
                            onChange={(e) =>
                                update("content", e.target.value)
                            }
                        />
                    </div>

                    {/* Difficulty level */}
                    <div className={styles.formField}>
                        <span className={styles.fieldLabel}>
                            Difficulty Level
                        </span>
                        <Radio.Group
                            value={form.difficulty}
                            onChange={(e) =>
                                update("difficulty", e.target.value)
                            }
                            className={styles.difficultyGroup}
                            buttonStyle="solid"
                        >
                            {(["Easy", "Medium", "Hard"] as Difficulty[]).map(
                                (d) => (
                                    <Radio.Button key={d} value={d}>
                                        {d}
                                    </Radio.Button>
                                )
                            )}
                        </Radio.Group>
                    </div>

                    {/* Upload */}
                    <div className={styles.formField}>
                        <span className={styles.fieldLabel}>
                            Upload Materials (Optional)
                        </span>
                        <Upload.Dragger
                            className={styles.uploadDragger}
                            accept=".pdf,.docx,.pptx,image/*"
                            beforeUpload={() => false}
                            showUploadList={false}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click to upload or drag and drop
                            </p>
                            <p className="ant-upload-hint">
                                PDF, DOCX, PPTX or Images (max 10MB)
                            </p>
                        </Upload.Dragger>
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <Button onClick={() => setForm(INITIAL_FORM)}>
                            Save as Draft
                        </Button>
                        <Button type="primary">Publish Module</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
