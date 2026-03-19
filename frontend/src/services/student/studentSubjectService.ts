import {
    STUDENT_SUBJECT_BULK_ENROLL_ENDPOINT,
    STUDENT_SUBJECT_GET_ALL_SUBJECTS_ENDPOINT,
    STUDENT_SUBJECT_GET_LESSON_ENDPOINT,
    STUDENT_SUBJECT_GET_MY_SUBJECTS_ENDPOINT,
} from "@/constants/api";
import { apiClient } from "@/lib/api/client";

interface IAbpResponseEnvelope<T> {
    result: T;
    success?: boolean;
}

export type DifficultyLevel = 1 | 2 | 3;

export interface IStudentSubject {
    id: string;
    name: string;
    description: string;
    gradeLevel: string;
    isActive: boolean;
}

export interface ILessonTranslationSummary {
    languageCode: string;
    languageName: string;
    title: string;
    content: string;
    summary: string;
    examples: string;
    revisionSummary: string;
    isAutoTranslated: boolean;
}

export interface ILessonDetail {
    id: string;
    topicId: string;
    title: string;
    summary: string;
    learningObjective: string;
    revisionSummary: string;
    difficultyLevel: DifficultyLevel;
    estimatedMinutes: number;
    isPublished: boolean;
    translations: ILessonTranslationSummary[];
}

export interface IBulkEnrollInput {
    subjectIds: string[];
}

export interface IBulkEnrollOutput {
    enrolledSubjectIds: string[];
    alreadyEnrolledSubjectIds: string[];
    notFoundSubjectIds: string[];
}

async function getMySubjects(): Promise<IStudentSubject[]> {
    const response = await apiClient.get<IAbpResponseEnvelope<IStudentSubject[]>>(STUDENT_SUBJECT_GET_MY_SUBJECTS_ENDPOINT);
    return response.data.result;
}

async function getAllSubjects(): Promise<IStudentSubject[]> {
    const response = await apiClient.get<IAbpResponseEnvelope<IStudentSubject[]>>(STUDENT_SUBJECT_GET_ALL_SUBJECTS_ENDPOINT);
    return response.data.result;
}

async function bulkEnroll(input: IBulkEnrollInput): Promise<IBulkEnrollOutput> {
    const response = await apiClient.post<IAbpResponseEnvelope<IBulkEnrollOutput>>(STUDENT_SUBJECT_BULK_ENROLL_ENDPOINT, input);
    return response.data.result;
}

async function getLesson(lessonId: string): Promise<ILessonDetail> {
    const response = await apiClient.get<IAbpResponseEnvelope<ILessonDetail>>(STUDENT_SUBJECT_GET_LESSON_ENDPOINT, {
        params: { lessonId },
    });
    return response.data.result;
}

export const studentSubjectService = {
    getAllSubjects,
    getMySubjects,
    bulkEnroll,
    getLesson,
};
