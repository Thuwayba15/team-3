/**
 * Student Dashboard Service
 * HTTP client for fetching personalized student dashboard data from the backend API.
 * Handles ABP response envelope structure and error extraction.
 */

import { apiClient } from "@/lib/api/client";
import { STUDENT_DASHBOARD_GET_MY_DASHBOARD_ENDPOINT } from "@/constants/api";
import type { StudentDashboardData } from "@/providers/student/context";

interface IStudentDashboardWeakTopicDto {
    topicId: string;
    topicName: string;
    masteryScore: number;
    needsRevision: boolean;
}

interface IStudentDashboardRecommendationDto {
    subjectId: string | null;
    subjectName: string | null;
    lessonId: string | null;
    lessonTitle: string | null;
    topicName: string | null;
    estimatedMinutes: number | null;
    actionState: string | null;
    reason: string | null;
}

interface IStudentDashboardRevisionAdviceDto {
    topicName: string | null;
    masteryScore: number;
    advice: string | null;
}

interface IStudentDashboardProgressDto {
    subjectName: string | null;
    overallScore: number;
    topicsMastered: number;
    lessonsCompleted: number;
    weakTopics: IStudentDashboardWeakTopicDto[];
    topicMasteries?: Array<{
        topicId: string;
        topicName: string;
        subjectName: string;
        masteryScore: number;
    }>;
    recommendedLesson: IStudentDashboardRecommendationDto | null;
    revisionAdvices: IStudentDashboardRevisionAdviceDto[];
    motivationalGuidance: string | null;
}

/**
 * Backend response envelope structure matching ABP convention.
 */
interface IAbpResponseEnvelope<T> {
    result: T;
    targetUrl: string | null;
    success: boolean;
    error: {
        message: string;
        details: string;
        code: string;
    } | null;
    unAuthorizedRequest: boolean;
    __abp: boolean;
}

const getSeverityBucket = (masteryPercent: number): "strong" | "moderate" | "weak" | "critical" => {
    if (masteryPercent >= 80) {
        return "strong";
    }

    if (masteryPercent >= 60) {
        return "moderate";
    }

    if (masteryPercent >= 40) {
        return "weak";
    }

    return "critical";
};

const mapProgressToDashboardData = (result: IStudentDashboardProgressDto): StudentDashboardData => {
    const weakTopics = result.weakTopics ?? [];
    const topicMasteries = result.topicMasteries ?? [];
    const revisionAdvices = result.revisionAdvices ?? [];
    const subjectNameByTopicId = new Map(topicMasteries.map((topic) => [topic.topicId, topic.subjectName]));
    const subjectNameByTopicName = new Map(topicMasteries.map((topic) => [topic.topicName, topic.subjectName]));
    const uniqueSubjectNames = Array.from(new Set(topicMasteries.map((topic) => topic.subjectName).filter((name) => name.trim().length > 0)));
    const resolvedPrimarySubjectName = result.subjectName?.trim().length
        ? result.subjectName
        : (uniqueSubjectNames.length === 1 ? uniqueSubjectNames[0] : "");
    const estimatedTotalTopics = topicMasteries.length > 0
        ? topicMasteries.length
        : result.topicsMastered + weakTopics.length;
    const totalTopics = estimatedTotalTopics > 0 ? estimatedTotalTopics : result.topicsMastered;

    const areasNeedingAttention = revisionAdvices.length > 0
        ? revisionAdvices.map((advice, index) => {
            const matchingWeakTopic = weakTopics.find((topic) => topic.topicName === advice.topicName);
            const subjectName = matchingWeakTopic?.topicId
                ? (subjectNameByTopicId.get(matchingWeakTopic.topicId) ?? resolvedPrimarySubjectName)
                : (advice.topicName ? (subjectNameByTopicName.get(advice.topicName) ?? resolvedPrimarySubjectName) : resolvedPrimarySubjectName);

            return {
                topicId: matchingWeakTopic?.topicId ?? `attention-${index + 1}`,
                topicName: advice.topicName ?? "Topic",
                subjectName,
                masteryPercent: advice.masteryScore,
                ruleBasisAction: advice.advice ?? "Review this topic with additional practice.",
            };
        })
        : weakTopics.map((topic) => ({
            topicId: topic.topicId,
            topicName: topic.topicName,
            subjectName: subjectNameByTopicId.get(topic.topicId) ?? resolvedPrimarySubjectName,
            masteryPercent: topic.masteryScore,
            ruleBasisAction: topic.needsRevision
                ? "Revision is recommended based on your recent activity."
                : "Strengthen this topic with focused practice.",
        }));

    const masteryHeatmap = topicMasteries.length > 0
        ? topicMasteries.map((topic) => ({
            topicId: topic.topicId,
            topicName: topic.topicName,
            subjectName: topic.subjectName,
            masteryPercent: topic.masteryScore,
            severityBucket: getSeverityBucket(topic.masteryScore),
        }))
        : weakTopics.map((topic) => ({
            topicId: topic.topicId,
            topicName: topic.topicName,
            subjectName: subjectNameByTopicId.get(topic.topicId) ?? resolvedPrimarySubjectName,
            masteryPercent: topic.masteryScore,
            severityBucket: getSeverityBucket(topic.masteryScore),
        }));

    const recommendedLessonSubjectName = result.recommendedLesson?.subjectName?.trim().length
        ? result.recommendedLesson.subjectName
        : result.recommendedLesson?.topicName
            ? (subjectNameByTopicName.get(result.recommendedLesson.topicName) ?? resolvedPrimarySubjectName)
            : resolvedPrimarySubjectName;

    const recommendedNextLesson =
        result.recommendedLesson?.lessonId && result.recommendedLesson?.lessonTitle
            ? {
                subjectId: result.recommendedLesson.subjectId ?? "",
                lessonId: result.recommendedLesson.lessonId,
                title: result.recommendedLesson.lessonTitle,
                topicName: result.recommendedLesson.topicName ?? "Topic",
                subjectName: recommendedLessonSubjectName,
                estimatedMinutes: result.recommendedLesson.estimatedMinutes ?? 20,
                ruleBasisReason: result.recommendedLesson.reason ?? "Recommended based on your current progress.",
            }
            : undefined;

    return {
        studentName: "Student",
        gradeLevel: "",
        overallScore: result.overallScore,
        topicsMastered: result.topicsMastered,
        totalTopics,
        lessonsCompleted: result.lessonsCompleted,
        areasNeedingAttentionCount: areasNeedingAttention.length,
        recommendedNextLesson,
        areasNeedingAttention,
        guidance: result.motivationalGuidance
            ? {
                baseMessage: result.motivationalGuidance,
            }
            : undefined,
        masteryHeatmap,
    };
};

class StudentDashboardService {
    /**
     * Fetches the complete dashboard for the current authenticated student.
     * Includes progress summary, recommendations, revision advice, and heatmap.
     *
     * Endpoint: GET /api/services/app/student-dashboard/get-my-dashboard
     *
     * @param subjectId - Optional subject UUID to filter dashboard data to a single subject
     * @returns Promise<StudentDashboardData> - Complete dashboard with all data
     * @throws Error if the request fails or returns an error from the backend
     */
    async getMyDashboard(subjectId?: string): Promise<StudentDashboardData> {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<IStudentDashboardProgressDto>>(
                STUDENT_DASHBOARD_GET_MY_DASHBOARD_ENDPOINT,
                {
                    params: subjectId ? { subjectId } : {},
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.error?.message || "Failed to load dashboard"
                );
            }

            return mapProgressToDashboardData(response.data.result);
        } catch (error) {
            // Re-throw with a user-friendly message
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unexpected error occurred while loading the dashboard");
        }
    }
}

export const studentDashboardService = new StudentDashboardService();
