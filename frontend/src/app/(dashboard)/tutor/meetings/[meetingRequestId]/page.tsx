"use client";

import { Alert, Spin } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MeetingRoom } from "@/components/tutoring/MeetingRoom";
import { tutorService, type MeetingAccess } from "@/services/tutoring/tutorService";

export default function TutorMeetingRoomPage() {
    const { t } = useTranslation();
    const params = useParams<{ meetingRequestId: string }>();
    const [access, setAccess] = useState<MeetingAccess | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAccess = async () => {
            try {
                const nextAccess = await tutorService.getTutorMeetingAccess(params.meetingRequestId);
                setAccess(nextAccess);
                setError(null);
            } catch (nextError) {
                setError(nextError instanceof Error ? nextError.message : t("meeting.errors.failedToLoad"));
            } finally {
                setLoading(false);
            }
        };

        void loadAccess();
    }, [params.meetingRequestId, t]);

    if (loading) {
        return <Spin />;
    }

    if (error || !access) {
        return <Alert type="error" message={error ?? t("meeting.errors.failedToLoad")} />;
    }

    return <MeetingRoom access={access} leaveHref="/tutor/meetings" autoStart />;
}
