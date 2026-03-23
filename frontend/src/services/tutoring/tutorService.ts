import axios from "axios";
import { apiClient } from "@/lib/api/client";
import { getCachedResource, invalidateCachedResource } from "@/lib/api/requestCache";
import {
    STUDENT_TUTOR_GET_AVAILABLE_TUTORS_ENDPOINT,
    STUDENT_TUTOR_REQUEST_TUTOR_ENDPOINT,
    STUDENT_TUTOR_GET_MY_REQUESTS_ENDPOINT,
    STUDENT_TUTOR_GET_MY_TUTORS_ENDPOINT,
    STUDENT_TUTOR_REQUEST_MEETING_ENDPOINT,
    STUDENT_TUTOR_GET_MY_MEETINGS_ENDPOINT,
    STUDENT_TUTOR_GET_MEETING_ACCESS_ENDPOINT,
    TUTOR_PORTAL_GET_SETUP_STATUS_ENDPOINT,
    TUTOR_PORTAL_GET_AVAILABLE_SUBJECTS_ENDPOINT,
    TUTOR_PORTAL_COMPLETE_SETUP_ENDPOINT,
    TUTOR_PORTAL_GET_DASHBOARD_ENDPOINT,
    TUTOR_PORTAL_GET_STUDENT_REQUESTS_ENDPOINT,
    TUTOR_PORTAL_RESPOND_STUDENT_REQUEST_ENDPOINT,
    TUTOR_PORTAL_GET_MEETINGS_ENDPOINT,
    TUTOR_PORTAL_RESPOND_MEETING_REQUEST_ENDPOINT,
    TUTOR_PORTAL_START_MEETING_ENDPOINT,
    TUTOR_PORTAL_GET_MEETING_ACCESS_ENDPOINT,
} from "@/constants/api";

interface IAbpResponseEnvelope<T> {
    result: T;
}

const STUDENT_TUTOR_CACHE_PREFIX = "student-tutor:";
const TUTOR_PORTAL_CACHE_PREFIX = "tutor-portal:";
const MEETING_ACCESS_CACHE_TTL_MS = 5000;
const DEFAULT_CACHE_TTL_MS = 30000;

export interface TutorSetupStatus {
    isComplete: boolean;
    subjectId?: string | null;
    subjectName?: string | null;
    bio?: string | null;
    specialization?: string | null;
}

export interface TutorSubjectOption {
    subjectId: string;
    subjectName: string;
    gradeLevel?: string | null;
}

export interface AvailableTutor {
    tutorUserId: number;
    tutorName: string;
    subjectId: string;
    subjectName: string;
    bio?: string | null;
    specialization?: string | null;
    hasPendingRequest: boolean;
    isLinked: boolean;
}

export interface TutorRequest {
    requestId: string;
    studentUserId: number;
    tutorUserId: number;
    studentName: string;
    tutorName: string;
    subjectId: string;
    subjectName: string;
    status: string;
    message?: string | null;
    responseMessage?: string | null;
    createdAt: string;
    respondedAtUtc?: string | null;
}

export interface LinkedTutor {
    linkId: string;
    tutorUserId: number;
    tutorName: string;
    subjectId: string;
    subjectName: string;
    bio?: string | null;
    specialization?: string | null;
    linkedAtUtc: string;
}

export interface MeetingRequest {
    meetingRequestId: string;
    linkId: string;
    studentUserId: number;
    tutorUserId: number;
    studentName: string;
    tutorName: string;
    subjectId: string;
    subjectName: string;
    scheduledStartUtc: string;
    durationMinutes: number;
    status: string;
    studentMessage?: string | null;
    tutorResponseMessage?: string | null;
    meetingSessionId?: string | null;
    canJoin: boolean;
}

export interface TutorStudentStat {
    studentUserId: number;
    studentName: string;
    subjectId: string;
    subjectName: string;
    masteryScore: number;
    needsIntervention: boolean;
}

export interface TutorDashboardData {
    linkedStudentsCount: number;
    pendingTutorRequestsCount: number;
    pendingMeetingRequestsCount: number;
    upcomingMeetingsCount: number;
    averageStudentMasteryScore: number;
    pendingTutorRequests: TutorRequest[];
    upcomingMeetings: MeetingRequest[];
    studentsNeedingAttention: TutorStudentStat[];
}

export interface MeetingAccess {
    meetingRequestId: string;
    meetingSessionId: string;
    subjectName: string;
    otherParticipantName: string;
    isTutor: boolean;
    canJoin: boolean;
    hubUrl: string;
}

function extractErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const abpMessage: string | undefined = error.response?.data?.error?.message;
        if (abpMessage) {
            return abpMessage;
        }

        if (error.response?.status === 401) return "You are not logged in.";
        if (error.response?.status === 403) return "You do not have permission to perform this action.";
        if (error.response?.status === 404) return "Resource not found.";
    }

    return "An unexpected error occurred.";
}

async function getAvailableTutors(subjectId?: string): Promise<AvailableTutor[]> {
    return getCachedResource(`${STUDENT_TUTOR_CACHE_PREFIX}available:${subjectId ?? "all"}`, async () => {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<AvailableTutor[]>>(STUDENT_TUTOR_GET_AVAILABLE_TUTORS_ENDPOINT, {
                params: subjectId ? { subjectId } : {},
            });
            return response.data.result;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    }, DEFAULT_CACHE_TTL_MS);
}

async function requestTutor(tutorUserId: number, subjectId: string, message?: string): Promise<TutorRequest> {
    try {
        const response = await apiClient.post<IAbpResponseEnvelope<TutorRequest>>(STUDENT_TUTOR_REQUEST_TUTOR_ENDPOINT, {
            tutorUserId,
            subjectId,
            message,
        });
        invalidateCachedResource(STUDENT_TUTOR_CACHE_PREFIX);
        invalidateCachedResource(TUTOR_PORTAL_CACHE_PREFIX);
        return response.data.result;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

async function getMyTutorRequests(): Promise<TutorRequest[]> {
    return getCachedResource(`${STUDENT_TUTOR_CACHE_PREFIX}requests`, async () => {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<TutorRequest[]>>(STUDENT_TUTOR_GET_MY_REQUESTS_ENDPOINT);
            return response.data.result;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    }, DEFAULT_CACHE_TTL_MS);
}

async function getMyTutors(): Promise<LinkedTutor[]> {
    return getCachedResource(`${STUDENT_TUTOR_CACHE_PREFIX}linked`, async () => {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<LinkedTutor[]>>(STUDENT_TUTOR_GET_MY_TUTORS_ENDPOINT);
            return response.data.result;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    }, DEFAULT_CACHE_TTL_MS);
}

async function requestMeeting(linkId: string, scheduledStartUtc: string, durationMinutes: number, message?: string): Promise<MeetingRequest> {
    try {
        const response = await apiClient.post<IAbpResponseEnvelope<MeetingRequest>>(STUDENT_TUTOR_REQUEST_MEETING_ENDPOINT, {
            linkId,
            scheduledStartUtc,
            durationMinutes,
            message,
        });
        invalidateCachedResource(STUDENT_TUTOR_CACHE_PREFIX);
        invalidateCachedResource(TUTOR_PORTAL_CACHE_PREFIX);
        return response.data.result;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

async function getMyMeetingRequests(): Promise<MeetingRequest[]> {
    return getCachedResource(`${STUDENT_TUTOR_CACHE_PREFIX}meetings`, async () => {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<MeetingRequest[]>>(STUDENT_TUTOR_GET_MY_MEETINGS_ENDPOINT);
            return response.data.result;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    }, DEFAULT_CACHE_TTL_MS);
}

async function getStudentMeetingAccess(meetingRequestId: string): Promise<MeetingAccess> {
    return getCachedResource(`${STUDENT_TUTOR_CACHE_PREFIX}meeting-access:${meetingRequestId}`, async () => {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<MeetingAccess>>(STUDENT_TUTOR_GET_MEETING_ACCESS_ENDPOINT, {
                params: { meetingRequestId },
            });
            return response.data.result;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    }, MEETING_ACCESS_CACHE_TTL_MS);
}

async function getTutorSetupStatus(): Promise<TutorSetupStatus> {
    return getCachedResource(`${TUTOR_PORTAL_CACHE_PREFIX}setup`, async () => {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<TutorSetupStatus>>(TUTOR_PORTAL_GET_SETUP_STATUS_ENDPOINT);
            return response.data.result;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    }, DEFAULT_CACHE_TTL_MS);
}

async function getTutorAvailableSubjects(): Promise<TutorSubjectOption[]> {
    return getCachedResource(`${TUTOR_PORTAL_CACHE_PREFIX}available-subjects`, async () => {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<TutorSubjectOption[]>>(TUTOR_PORTAL_GET_AVAILABLE_SUBJECTS_ENDPOINT);
            return response.data.result;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    }, DEFAULT_CACHE_TTL_MS);
}

async function completeTutorSetup(subjectId: string, bio?: string, specialization?: string): Promise<TutorSetupStatus> {
    try {
        const response = await apiClient.post<IAbpResponseEnvelope<TutorSetupStatus>>(TUTOR_PORTAL_COMPLETE_SETUP_ENDPOINT, {
            subjectId,
            bio,
            specialization,
        });
        invalidateCachedResource(TUTOR_PORTAL_CACHE_PREFIX);
        invalidateCachedResource(STUDENT_TUTOR_CACHE_PREFIX);
        return response.data.result;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

async function getTutorDashboard(): Promise<TutorDashboardData> {
    return getCachedResource(`${TUTOR_PORTAL_CACHE_PREFIX}dashboard`, async () => {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<TutorDashboardData>>(TUTOR_PORTAL_GET_DASHBOARD_ENDPOINT);
            return response.data.result;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    }, DEFAULT_CACHE_TTL_MS);
}

async function getTutorStudentRequests(): Promise<TutorRequest[]> {
    return getCachedResource(`${TUTOR_PORTAL_CACHE_PREFIX}student-requests`, async () => {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<TutorRequest[]>>(TUTOR_PORTAL_GET_STUDENT_REQUESTS_ENDPOINT);
            return response.data.result;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    }, DEFAULT_CACHE_TTL_MS);
}

async function respondToTutorRequest(requestId: string, accept: boolean, responseMessage?: string): Promise<TutorRequest> {
    try {
        const response = await apiClient.post<IAbpResponseEnvelope<TutorRequest>>(TUTOR_PORTAL_RESPOND_STUDENT_REQUEST_ENDPOINT, {
            requestId,
            accept,
            responseMessage,
        });
        invalidateCachedResource(TUTOR_PORTAL_CACHE_PREFIX);
        invalidateCachedResource(STUDENT_TUTOR_CACHE_PREFIX);
        return response.data.result;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

async function getTutorMeetings(): Promise<MeetingRequest[]> {
    return getCachedResource(`${TUTOR_PORTAL_CACHE_PREFIX}meetings`, async () => {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<MeetingRequest[]>>(TUTOR_PORTAL_GET_MEETINGS_ENDPOINT);
            return response.data.result;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    }, DEFAULT_CACHE_TTL_MS);
}

async function respondToMeetingRequest(meetingRequestId: string, accept: boolean, responseMessage?: string): Promise<MeetingRequest> {
    try {
        const response = await apiClient.post<IAbpResponseEnvelope<MeetingRequest>>(TUTOR_PORTAL_RESPOND_MEETING_REQUEST_ENDPOINT, {
            meetingRequestId,
            accept,
            responseMessage,
        });
        invalidateCachedResource(TUTOR_PORTAL_CACHE_PREFIX);
        invalidateCachedResource(STUDENT_TUTOR_CACHE_PREFIX);
        return response.data.result;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

async function startTutorMeeting(meetingRequestId: string): Promise<MeetingAccess> {
    try {
        const response = await apiClient.post<IAbpResponseEnvelope<MeetingAccess>>(TUTOR_PORTAL_START_MEETING_ENDPOINT, null, {
            params: { meetingRequestId },
        });
        invalidateCachedResource(TUTOR_PORTAL_CACHE_PREFIX);
        invalidateCachedResource(STUDENT_TUTOR_CACHE_PREFIX);
        return response.data.result;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

async function getTutorMeetingAccess(meetingRequestId: string): Promise<MeetingAccess> {
    return getCachedResource(`${TUTOR_PORTAL_CACHE_PREFIX}meeting-access:${meetingRequestId}`, async () => {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<MeetingAccess>>(TUTOR_PORTAL_GET_MEETING_ACCESS_ENDPOINT, {
                params: { meetingRequestId },
            });
            return response.data.result;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    }, MEETING_ACCESS_CACHE_TTL_MS);
}

export const tutorService = {
    getAvailableTutors,
    requestTutor,
    getMyTutorRequests,
    getMyTutors,
    requestMeeting,
    getMyMeetingRequests,
    getStudentMeetingAccess,
    getTutorSetupStatus,
    getTutorAvailableSubjects,
    completeTutorSetup,
    getTutorDashboard,
    getTutorStudentRequests,
    respondToTutorRequest,
    getTutorMeetings,
    respondToMeetingRequest,
    startTutorMeeting,
    getTutorMeetingAccess,
};
