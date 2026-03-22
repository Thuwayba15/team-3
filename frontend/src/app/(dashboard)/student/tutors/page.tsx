"use client";

import { CalendarOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Empty, Form, Input, InputNumber, List, Modal, Space, Tag, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { tutorService, type LinkedTutor, type MeetingRequest } from "@/services/tutoring/tutorService";

const { Paragraph, Text } = Typography;

function formatDateTimeLocalMinimum(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function StudentTutorsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [tutors, setTutors] = useState<LinkedTutor[]>([]);
    const [meetings, setMeetings] = useState<MeetingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<LinkedTutor | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();
    const [minimumStartDateTime, setMinimumStartDateTime] = useState(() => formatDateTimeLocalMinimum(new Date()));

    const loadData = async () => {
        setLoading(true);
        try {
            const [nextTutors, nextMeetings] = await Promise.all([
                tutorService.getMyTutors(),
                tutorService.getMyMeetingRequests(),
            ]);
            setTutors(nextTutors);
            setMeetings(nextMeetings);
            setError(null);
        } catch (nextError) {
            setError(nextError instanceof Error ? nextError.message : t("tutoring.errors.loadTutors"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const openMeetingModal = (tutor: LinkedTutor) => {
        setSelectedTutor(tutor);
        form.resetFields();
        setMinimumStartDateTime(formatDateTimeLocalMinimum(new Date()));
        setIsModalOpen(true);
    };

    const handleRequestMeeting = async () => {
        if (!selectedTutor) return;

        try {
            const values = await form.validateFields();
            setSubmitting(true);
            await tutorService.requestMeeting(
                selectedTutor.linkId,
                new Date(values.scheduledStartUtc).toISOString(),
                values.durationMinutes,
                values.message,
            );
            message.success(t("tutoring.student.tutors.messages.meetingRequested"));
            setIsModalOpen(false);
            await loadData();
        } catch (nextError) {
            if (nextError instanceof Error && nextError.message) {
                message.error(nextError.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <PageHeader title={t("tutoring.student.tutors.title")} subtitle={t("tutoring.student.tutors.subtitle")} />
            {error ? <Alert type="error" message={error} /> : null}

            <Card title={t("tutoring.student.tutors.linkedTitle")} loading={loading}>
                {tutors.length === 0 && !loading ? (
                    <Empty description={t("tutoring.student.tutors.empty")} />
                ) : (
                    <List
                        dataSource={tutors}
                        renderItem={(tutor) => (
                            <List.Item
                                actions={[
                                    <Button key="meeting" type="primary" icon={<CalendarOutlined />} onClick={() => openMeetingModal(tutor)}>
                                        {t("tutoring.student.tutors.actions.requestMeeting")}
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={tutor.tutorName}
                                    description={(
                                        <Space direction="vertical" size={4}>
                                            <Tag>{tutor.subjectName}</Tag>
                                            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                                {tutor.bio || t("tutoring.student.availableTutors.noBio")}
                                            </Paragraph>
                                        </Space>
                                    )}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Card>

            <Card title={t("tutoring.student.tutors.meetingsTitle")} loading={loading}>
                {meetings.length === 0 && !loading ? (
                    <Empty description={t("tutoring.student.tutors.noMeetings")} />
                ) : (
                    <List
                        dataSource={meetings}
                        renderItem={(meeting) => (
                            <List.Item
                                actions={[
                                    meeting.canJoin ? (
                                        <Button
                                            key="join"
                                            icon={<VideoCameraOutlined />}
                                            onClick={() => router.push(`/student/tutors/meetings/${meeting.meetingRequestId}`)}
                                        >
                                            {t("tutoring.student.tutors.actions.joinMeeting")}
                                        </Button>
                                    ) : null,
                                ].filter(Boolean)}
                            >
                                <List.Item.Meta
                                    title={`${meeting.tutorName} • ${meeting.subjectName}`}
                                    description={(
                                        <Space direction="vertical" size={4}>
                                            <Text type="secondary">{new Date(meeting.scheduledStartUtc).toLocaleString()}</Text>
                                            <Space wrap>
                                                <Tag>{meeting.status}</Tag>
                                                <Tag>{t("tutoring.student.tutors.duration", { minutes: meeting.durationMinutes })}</Tag>
                                            </Space>
                                            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                                {meeting.studentMessage || t("tutoring.student.tutors.noMeetingMessage")}
                                            </Paragraph>
                                        </Space>
                                    )}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Card>

            <Modal
                title={t("tutoring.student.tutors.requestMeetingTitle")}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => {
                    void handleRequestMeeting();
                }}
                confirmLoading={submitting}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="scheduledStartUtc"
                        label={t("tutoring.student.tutors.form.start")}
                        rules={[
                            { required: true, message: t("tutoring.validation.required") },
                            {
                                validator: async (_, value) => {
                                    if (!value) {
                                        return;
                                    }

                                    const selectedDate = new Date(value);
                                    if (Number.isNaN(selectedDate.getTime()) || selectedDate.getTime() < Date.now()) {
                                        throw new Error("Please choose a current or future meeting time.");
                                    }
                                },
                            },
                        ]}
                    >
                        <Input type="datetime-local" min={minimumStartDateTime} />
                    </Form.Item>
                    <Form.Item
                        name="durationMinutes"
                        label={t("tutoring.student.tutors.form.duration")}
                        initialValue={30}
                        rules={[{ required: true, message: t("tutoring.validation.required") }]}
                    >
                        <InputNumber min={15} max={120} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="message" label={t("tutoring.student.tutors.form.message")}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
}
