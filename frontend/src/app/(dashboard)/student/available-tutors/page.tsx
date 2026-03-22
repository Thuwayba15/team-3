"use client";

import { BookOutlined, MessageOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Empty, List, Space, Tag, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { tutorService, type AvailableTutor } from "@/services/tutoring/tutorService";

const { Paragraph, Text } = Typography;

export default function StudentAvailableTutorsPage() {
    const { t } = useTranslation();
    const [tutors, setTutors] = useState<AvailableTutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requestingTutorId, setRequestingTutorId] = useState<number | null>(null);

    const loadTutors = async () => {
        setLoading(true);
        try {
            const nextTutors = await tutorService.getAvailableTutors();
            setTutors(nextTutors);
            setError(null);
        } catch (nextError) {
            setError(nextError instanceof Error ? nextError.message : t("tutoring.errors.loadAvailableTutors"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadTutors();
    }, []);

    const handleRequestTutor = async (tutor: AvailableTutor) => {
        setRequestingTutorId(tutor.tutorUserId);
        try {
            await tutorService.requestTutor(tutor.tutorUserId, tutor.subjectId);
            message.success(t("tutoring.student.availableTutors.messages.requestSent"));
            await loadTutors();
        } catch (nextError) {
            message.error(nextError instanceof Error ? nextError.message : t("tutoring.errors.requestTutor"));
        } finally {
            setRequestingTutorId(null);
        }
    };

    return (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <PageHeader
                title={t("tutoring.student.availableTutors.title")}
                subtitle={t("tutoring.student.availableTutors.subtitle")}
            />

            {error ? <Alert type="error" message={error} /> : null}

            <Card loading={loading}>
                {tutors.length === 0 && !loading ? (
                    <Empty description={t("tutoring.student.availableTutors.empty")} />
                ) : (
                    <List
                        dataSource={tutors}
                        renderItem={(tutor) => (
                            <List.Item
                                actions={[
                                    <Button
                                        key="request"
                                        type="primary"
                                        icon={<MessageOutlined />}
                                        loading={requestingTutorId === tutor.tutorUserId}
                                        disabled={tutor.hasPendingRequest || tutor.isLinked}
                                        onClick={() => {
                                            void handleRequestTutor(tutor);
                                        }}
                                    >
                                        {tutor.isLinked
                                            ? t("tutoring.student.availableTutors.actions.linked")
                                            : tutor.hasPendingRequest
                                                ? t("tutoring.student.availableTutors.actions.pending")
                                                : t("tutoring.student.availableTutors.actions.requestTutor")}
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={tutor.tutorName}
                                    description={(
                                        <Space direction="vertical" size={4}>
                                            <Space wrap>
                                                <Tag icon={<BookOutlined />}>{tutor.subjectName}</Tag>
                                                {tutor.specialization ? <Tag>{tutor.specialization}</Tag> : null}
                                            </Space>
                                            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                                {tutor.bio || t("tutoring.student.availableTutors.noBio")}
                                            </Paragraph>
                                            <Text type="secondary">{t("tutoring.student.availableTutors.helper")}</Text>
                                        </Space>
                                    )}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </Space>
    );
}
