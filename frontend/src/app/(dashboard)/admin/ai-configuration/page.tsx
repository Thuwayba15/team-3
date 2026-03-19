"use client";

import { Alert, Button, Card, Col, Form, Input, InputNumber, Row, Select, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import { adminService, type IPromptConfiguration } from "@/services/admin/adminService";
import { useStyles } from "./styles";

const RESPONSE_STYLE_OPTIONS = [
    { value: "supportive-step-by-step", label: "Supportive, step by step" },
    { value: "concise-coaching", label: "Concise coaching" },
    { value: "exam-prep", label: "Exam preparation" },
];

export default function AdminAiConfigurationPage() {
    const { styles } = useStyles();
    const [form] = Form.useForm<IPromptConfiguration>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        adminService.getPromptConfiguration()
            .then((config) => {
                form.setFieldsValue(config);
                setError(null);
            })
            .catch(() => setError("Could not load AI prompt configuration."))
            .finally(() => setLoading(false));
    }, [form]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const values = await form.validateFields();
            const updated = await adminService.updatePromptConfiguration(values);
            form.setFieldsValue(updated);
            message.success("AI prompt configuration saved.");
        } catch (saveError) {
            if (!(saveError instanceof Error && saveError.message === "Validation error")) {
                message.error("Could not save AI prompt configuration.");
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <PageHeader title="AI Prompts" subtitle="Configure the prompt and recommendation settings used by the frontend AI tutor." />

            {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <Card className={styles.sectionCard} title="General Tutor Prompt">
                                <Form.Item name="generalPrompt" rules={[{ required: true, message: "General prompt is required." }]}>
                                    <Input.TextArea rows={10} />
                                </Form.Item>
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card className={styles.sectionCard} title="Life Sciences Prompt">
                                <Form.Item name="lifeSciencesPrompt" rules={[{ required: true, message: "Life Sciences prompt is required." }]}>
                                    <Input.TextArea rows={10} />
                                </Form.Item>
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card className={styles.sectionCard} title="Response Style">
                                <Form.Item name="responseStyle" rules={[{ required: true, message: "Response style is required." }]}>
                                    <Select options={RESPONSE_STYLE_OPTIONS} />
                                </Form.Item>
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card className={styles.sectionCard} title="Mastery Threshold">
                                <Form.Item name="masteryThreshold" rules={[{ required: true, message: "Mastery threshold is required." }]}>
                                    <InputNumber min={0} max={100} style={{ width: "100%" }} />
                                </Form.Item>
                            </Card>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card className={styles.sectionCard} title="Retry Limit">
                                <Form.Item name="retryLimit" rules={[{ required: true, message: "Retry limit is required." }]}>
                                    <InputNumber min={1} max={10} style={{ width: "100%" }} />
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>
                </Form>

                <Button type="primary" className={styles.saveButton} loading={saving} onClick={() => void handleSave()}>
                    Save Configuration
                </Button>
            </Spin>
        </div>
    );
}
