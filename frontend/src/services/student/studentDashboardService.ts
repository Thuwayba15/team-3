import { STUDENT_DASHBOARD_GET_PROGRESS_ENDPOINT } from "@/constants/api";
import { apiClient } from "@/lib/api/client";

interface IAbpResponseEnvelope<T> {
    result: T;
    success?: boolean;
}

export interface IStudentDashboardRecentQuiz {
    assessmentId: string;
    title: string;
    percentage: number;
    submittedAt: string;
    passed: boolean;
}

export interface IStudentDashboardCompletedLesson {
    lessonId: string;
    title: string;
    completedAt: string;
}

export interface IStudentDashboardWeakTopic {
    topicId: string;
    topicName: string;
    masteryScore: number;
    recommendedAction: string;
}

export interface IStudentDashboardProgress {
    subjectId: string;
    subjectName: string;
    overallScore: number;
    topicsMastered: number;
    lessonsCompleted: number;
    quizzesPassed: number;
    needsIntervention: boolean;
    recentQuizzes: IStudentDashboardRecentQuiz[];
    completedLessons: IStudentDashboardCompletedLesson[];
    weakTopics: IStudentDashboardWeakTopic[];
}

async function getProgress(subjectId?: string): Promise<IStudentDashboardProgress> {
    const response = await apiClient.get<IAbpResponseEnvelope<IStudentDashboardProgress>>(STUDENT_DASHBOARD_GET_PROGRESS_ENDPOINT, {
        params: subjectId ? { subjectId } : undefined,
    });
    return response.data.result;
}

export const studentDashboardService = {
    getProgress,
};
