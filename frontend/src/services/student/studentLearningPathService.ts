import {
    STUDENT_LEARNING_PATH_COMPLETE_LESSON_ENDPOINT,
    STUDENT_LEARNING_PATH_GET_SUBJECT_PATH_ENDPOINT,
} from "@/constants/api";
import { apiClient } from "@/lib/api/client";
import type { DifficultyLevel } from "@/services/student/studentSubjectService";

interface IAbpResponseEnvelope<T> {
    result: T;
    success?: boolean;
}

export type LearningPathStatus = "completed" | "current" | "locked";

export interface IStudentLearningPathLesson {
    lessonId: string;
    title: string;
    difficultyLevel: DifficultyLevel;
    estimatedMinutes: number;
    status: LearningPathStatus;
    actionState: "available" | "review" | "locked";
    canComplete: boolean;
    quizAssessmentId: string | null;
    quizStatus: "available" | "unavailable";
    quizUnavailableReason?: string | null;
}

export interface IStudentLearningPathTopic {
    topicId: string;
    name: string;
    description?: string | null;
    status: LearningPathStatus;
    assignedDifficultyLevel: DifficultyLevel | null;
    masteryScore: number;
    needsRevision: boolean;
    diagnosticAssessmentId: string | null;
    recommendedAction: string;
    lessons: IStudentLearningPathLesson[];
}

export interface IStudentLearningPath {
    subjectId: string;
    subjectName: string;
    gradeLevel: string;
    overallProgressPercent: number;
    recommendedAction: string;
    topics: IStudentLearningPathTopic[];
}

export interface ICompleteLessonInput {
    lessonId: string;
}

export interface ICompleteLessonOutput {
    lessonId: string;
    status: string;
    actionState: "available" | "review" | "locked";
    nextRecommendedAction: string;
    subjectId: string;
    topicId: string;
}

async function getSubjectPath(subjectId: string): Promise<IStudentLearningPath> {
    const response = await apiClient.get<IAbpResponseEnvelope<IStudentLearningPath>>(STUDENT_LEARNING_PATH_GET_SUBJECT_PATH_ENDPOINT, {
        params: { subjectId },
    });
    return response.data.result;
}

async function completeLesson(input: ICompleteLessonInput): Promise<ICompleteLessonOutput> {
    const response = await apiClient.post<IAbpResponseEnvelope<ICompleteLessonOutput>>(STUDENT_LEARNING_PATH_COMPLETE_LESSON_ENDPOINT, input);
    return response.data.result;
}

export const studentLearningPathService = {
    getSubjectPath,
    completeLesson,
};
