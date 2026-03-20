"use client";

import { Alert, Button, Card, Form, Input, Select, Space, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { tutorService, type TutorSubjectOption } from "@/services/tutoring/tutorService";

export default function TutorSetupPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [subjects, setSubjects] = useState<TutorSubjectOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const load = async () => {
            try {
                const [setupStatus, availableSubjects] = await Promise.all([
                    tutorService.getTutorSetupStatus(),
                    tutorService.getTutorAvailableSubjects(),
                ]);
                if (setupStatus.isComplete) {
                    form.setFieldsValue({
                        subjectId: setupStatus.subjectId,
                        bio: setupStatus.bio,
                        specialization: setupStatus.specialization,
                    });
                }
                setSubjects(availableSubjects);
                setError(null);
            } catch (nextError) {
                setError(nextError instanceof Error ? nextError.message : t("tutoring.errors.loadTutorSetup"));
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [form, t]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);
            await tutorService.completeTutorSetup(values.subjectId, values.bio, values.specialization);
            message.success(t("tutoring.tutor.setup.messages.saved"));
            router.push("/tutor/dashboard");
        } catch (nextError) {
            if (nextError instanceof Error && nextError.message) {
                message.error(nextError.message);
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <PageHeader title={t("tutoring.tutor.setup.title")} subtitle={t("tutoring.tutor.setup.subtitle")} />
            {error ? <Alert type="error" message={error} /> : null}

            <Card loading={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="subjectId"
                        label={t("tutoring.tutor.setup.form.subject")}
                        rules={[{ required: true, message: t("tutoring.validation.required") }]}
                    >
                        <Select
                            options={subjects.map((subject) => ({
                                value: subject.subjectId,
                                label: `${subject.subjectName}${subject.gradeLevel ? ` • ${subject.gradeLevel}` : ""}`,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item name="specialization" label={t("tutoring.tutor.setup.form.specialization")}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="bio" label={t("tutoring.tutor.setup.form.bio")}>
                        <Input.TextArea rows={5} />
                    </Form.Item>
                    <Button type="primary" loading={saving} onClick={() => void handleSubmit()}>
                        {t("tutoring.tutor.setup.actions.save")}
                    </Button>
                </Form>
            </Card>
        </Space>
    );
}
