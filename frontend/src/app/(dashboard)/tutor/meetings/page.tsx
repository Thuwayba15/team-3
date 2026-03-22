"use client";

import { CheckOutlined, CloseOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Empty, List, Space, Tag, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout";
import { tutorService, type MeetingRequest, type TutorRequest, type TutorSetupStatus } from "@/services/tutoring/tutorService";

const { Paragraph, Text } = Typography;
const LATE_START_GRACE_PERIOD_MS = 30 * 60 * 1000;

function getMeetingStartWindowState(scheduledStartUtc: string) {
    const scheduledStartTime = new Date(scheduledStartUtc).getTime();
    const overdueByMs = Date.now() - scheduledStartTime;

    return {
        isWithinLateWindow: overdueByMs > 0 && overdueByMs <= LATE_START_GRACE_PERIOD_MS,
        isExpiredForStart: overdueByMs > LATE_START_GRACE_PERIOD_MS,
    };
}

export default function TutorMeetingsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [setupStatus, setSetupStatus] = useState<TutorSetupStatus | null>(null);
    const [tutorRequests, setTutorRequests] = useState<TutorRequest[]>([]);
    const [meetings, setMeetings] = useState<MeetingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const nextSetupStatus = await tutorService.getTutorSetupStatus();
            setSetupStatus(nextSetupStatus);

            if (!nextSetupStatus.isComplete) {
                setTutorRequests([]);
                setMeetings([]);
                setError(null);
                return;
            }

            const [nextTutorRequests, nextMeetings] = await Promise.all([
                tutorService.getTutorStudentRequests(),
                tutorService.getTutorMeetings(),
            ]);
            setTutorRequests(nextTutorRequests);
            setMeetings(nextMeetings);
            setError(null);
        } catch (nextError) {
            setError(nextError instanceof Error ? nextError.message : t("tutoring.errors.loadTutorMeetings"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const handleTutorRequest = async (requestId: string, accept: boolean) => {
        try {
            await tutorService.respondToTutorRequest(requestId, accept);
            message.success(accept ? t("tutoring.tutor.meetings.messages.requestAccepted") : t("tutoring.tutor.meetings.messages.requestDeclined"));
            await loadData();
        } catch (nextError) {
            message.error(nextError instanceof Error ? nextError.message : t("tutoring.errors.respondTutorRequest"));
        }
    };

    const handleMeetingRequest = async (meetingRequestId: string, accept: boolean) => {
        try {
            await tutorService.respondToMeetingRequest(meetingRequestId, accept);
            message.success(accept ? t("tutoring.tutor.meetings.messages.meetingAccepted") : t("tutoring.tutor.meetings.messages.meetingDeclined"));
            await loadData();
        } catch (nextError) {
            message.error(nextError instanceof Error ? nextError.message : t("tutoring.errors.respondMeetingRequest"));
        }
    };

    const handleStartMeeting = async (meetingRequestId: string) => {
        try {
            await tutorService.startTutorMeeting(meetingRequestId);
            router.push(`/tutor/meetings/${meetingRequestId}`);
        } catch (nextError) {
            message.error(nextError instanceof Error ? nextError.message : t("tutoring.errors.startMeeting"));
        }
    };

    return (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <PageHeader title={t("tutoring.tutor.meetings.title")} subtitle={t("tutoring.tutor.meetings.subtitle")} />
            {error ? <Alert type="error" message={error} /> : null}

            {setupStatus && !setupStatus.isComplete ? (
                <Card loading={loading}>
                    <Paragraph>{t("tutoring.tutor.meetings.setupPrompt")}</Paragraph>
                    <Button type="primary" onClick={() => router.push("/tutor/setup")}>
                        {t("tutoring.tutor.dashboard.actions.completeSetup")}
                    </Button>
                </Card>
            ) : (
                <>
                    <Card title={t("tutoring.tutor.meetings.tutorRequestsTitle")} loading={loading}>
                        {tutorRequests.length === 0 && !loading ? (
                            <Empty description={t("tutoring.tutor.meetings.emptyTutorRequests")} />
                        ) : (
                            <List
                                dataSource={tutorRequests}
                                renderItem={(request) => (
                                    <List.Item
                                        actions={request.status === "Pending"
                                            ? [
                                                <Button key="accept" type="primary" icon={<CheckOutlined />} onClick={() => void handleTutorRequest(request.requestId, true)}>
                                                    {t("tutoring.tutor.meetings.actions.accept")}
                                                </Button>,
                                                <Button key="decline" danger icon={<CloseOutlined />} onClick={() => void handleTutorRequest(request.requestId, false)}>
                                                    {t("tutoring.tutor.meetings.actions.decline")}
                                                </Button>,
                                            ]
                                            : [<Tag key="status">{request.status}</Tag>]}
                                    >
                                        <List.Item.Meta
                                            title={`${request.studentName} • ${request.subjectName}`}
                                            description={request.message || t("tutoring.tutor.dashboard.noStudentMessage")}
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>

                    <Card title={t("tutoring.tutor.meetings.meetingRequestsTitle")} loading={loading}>
                        {meetings.length === 0 && !loading ? (
                            <Empty description={t("tutoring.tutor.meetings.emptyMeetings")} />
                        ) : (
                            <List
                                dataSource={meetings}
                                renderItem={(meeting) => {
                                    const { isWithinLateWindow, isExpiredForStart } = getMeetingStartWindowState(meeting.scheduledStartUtc);

                                    return (
                                        <List.Item
                                            actions={meeting.status === "Pending"
                                                ? [
                                                    <Button key="accept" type="primary" icon={<CheckOutlined />} onClick={() => void handleMeetingRequest(meeting.meetingRequestId, true)}>
                                                        {t("tutoring.tutor.meetings.actions.accept")}
                                                    </Button>,
                                                    <Button key="decline" danger icon={<CloseOutlined />} onClick={() => void handleMeetingRequest(meeting.meetingRequestId, false)}>
                                                        {t("tutoring.tutor.meetings.actions.decline")}
                                                    </Button>,
                                                ]
                                                : meeting.status === "Accepted"
                                                    ? [
                                                        <Button
                                                            key="start"
                                                            type="primary"
                                                            icon={<VideoCameraOutlined />}
                                                            disabled={isExpiredForStart}
                                                            onClick={() => void handleStartMeeting(meeting.meetingRequestId)}
                                                        >
                                                            {t("tutoring.tutor.meetings.actions.startMeeting")}
                                                        </Button>,
                                                    ]
                                                    : [<Tag key="status">{meeting.status}</Tag>]}
                                        >
                                            <List.Item.Meta
                                                title={`${meeting.studentName} • ${meeting.subjectName}`}
                                                description={(
                                                    <Space direction="vertical" size={4}>
                                                        <Text type="secondary">{new Date(meeting.scheduledStartUtc).toLocaleString()}</Text>
                                                        {meeting.status === "Accepted" ? (
                                                            <Space wrap size={[8, 8]}>
                                                                {isWithinLateWindow ? <Tag color="gold">Late start window available</Tag> : null}
                                                                {isExpiredForStart ? <Tag>Start window expired</Tag> : null}
                                                            </Space>
                                                        ) : null}
                                                        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                                            {meeting.studentMessage || t("tutoring.tutor.meetings.noMeetingMessage")}
                                                        </Paragraph>
                                                    </Space>
                                                )}
                                            />
                                        </List.Item>
                                    );
                                }}
                            />
                        )}
                    </Card>
                </>
            )}
        </Space>
    );
}
