import {
    ADMIN_DASHBOARD_SUMMARY_ENDPOINT,
    CURRICULUM_CREATE_LESSON_ENDPOINT,
    CURRICULUM_CREATE_TOPIC_ENDPOINT,
    CURRICULUM_GET_ENDPOINT,
    CURRICULUM_GET_LESSON_ENDPOINT,
    CURRICULUM_UPDATE_LESSON_ENDPOINT,
    CURRICULUM_UPDATE_TOPIC_ENDPOINT,
    CURRICULUM_UPSERT_TRANSLATION_ENDPOINT,
    PROMPT_CONFIGURATION_GET_ENDPOINT,
    PROMPT_CONFIGURATION_UPDATE_ENDPOINT,
} from "@/constants/api";
import { apiClient } from "@/lib/api/client";

interface IAbpResponseEnvelope<T> {
    result: T;
}

export interface IAdminDashboardSummary {
    adminCount: number;
    studentCount: number;
    lifeSciencesTopicCount: number;
    lifeSciencesLessonCount: number;
    promptConfigurationReady: boolean;
}

export interface IPromptConfiguration {
    generalPrompt: string;
    lifeSciencesPrompt: string;
    responseStyle: string;
    masteryThreshold: number;
    retryLimit: number;
}

export interface ILessonSummary {
    id: string;
    topicId: string;
    title: string;
    difficultyLevel: number;
    estimatedMinutes: number;
    isPublished: boolean;
}

export interface ITopicDetail {
    id: string;
    name: string;
    description?: string | null;
    difficultyLevel: number;
    sequenceOrder: number;
    isActive: boolean;
    masteryThreshold: number;
    lessons: ILessonSummary[];
}

export interface ICurriculum {
    subjectId: string;
    subjectName: string;
    gradeLevel: string;
    description?: string | null;
    topics: ITopicDetail[];
}

export interface ITranslationSummary {
    languageCode: string;
    languageName: string;
    title: string;
    content: string;
    summary?: string | null;
    examples?: string | null;
    revisionSummary?: string | null;
    isAutoTranslated: boolean;
}

export interface ILessonDetail extends ILessonSummary {
    summary?: string | null;
    learningObjective?: string | null;
    revisionSummary?: string | null;
    translations: ITranslationSummary[];
}

export interface ITopicInput {
    name: string;
    description?: string;
    difficultyLevel: number;
    sequenceOrder: number;
    isActive: boolean;
    masteryThreshold: number;
}

export interface ILessonInput {
    title: string;
    summary?: string;
    learningObjective?: string;
    revisionSummary?: string;
    difficultyLevel: number;
    estimatedMinutes: number;
    isPublished: boolean;
}

export interface ITranslationInput {
    languageCode: string;
    title: string;
    content: string;
    summary?: string;
    examples?: string;
    revisionSummary?: string;
}

async function getDashboardSummary(): Promise<IAdminDashboardSummary> {
    const response = await apiClient.get<IAbpResponseEnvelope<IAdminDashboardSummary>>(ADMIN_DASHBOARD_SUMMARY_ENDPOINT);
    return response.data.result;
}

async function getPromptConfiguration(): Promise<IPromptConfiguration> {
    const response = await apiClient.get<IAbpResponseEnvelope<IPromptConfiguration>>(PROMPT_CONFIGURATION_GET_ENDPOINT);
    return response.data.result;
}

async function updatePromptConfiguration(input: IPromptConfiguration): Promise<IPromptConfiguration> {
    const response = await apiClient.put<IAbpResponseEnvelope<IPromptConfiguration>>(PROMPT_CONFIGURATION_UPDATE_ENDPOINT, input);
    return response.data.result;
}

async function getCurriculum(): Promise<ICurriculum> {
    const response = await apiClient.get<IAbpResponseEnvelope<ICurriculum>>(CURRICULUM_GET_ENDPOINT);
    return response.data.result;
}

async function createTopic(input: ITopicInput): Promise<ITopicDetail> {
    await apiClient.post(CURRICULUM_CREATE_TOPIC_ENDPOINT, input);
    const refreshed = await getCurriculum();
    return refreshed.topics[refreshed.topics.length - 1];
}

async function updateTopic(topicId: string, input: ITopicInput): Promise<void> {
    await apiClient.put(`${CURRICULUM_UPDATE_TOPIC_ENDPOINT}?topicId=${topicId}`, input);
}

async function createLesson(topicId: string, input: ILessonInput): Promise<ILessonDetail> {
    const response = await apiClient.post<IAbpResponseEnvelope<ILessonDetail>>(`${CURRICULUM_CREATE_LESSON_ENDPOINT}?topicId=${topicId}`, input);
    return response.data.result;
}

async function getLesson(lessonId: string): Promise<ILessonDetail> {
    const response = await apiClient.get<IAbpResponseEnvelope<ILessonDetail>>(`${CURRICULUM_GET_LESSON_ENDPOINT}?lessonId=${lessonId}`);
    return response.data.result;
}

async function updateLesson(lessonId: string, input: ILessonInput): Promise<ILessonDetail> {
    const response = await apiClient.put<IAbpResponseEnvelope<ILessonDetail>>(`${CURRICULUM_UPDATE_LESSON_ENDPOINT}?lessonId=${lessonId}`, input);
    return response.data.result;
}

async function upsertTranslation(lessonId: string, input: ITranslationInput): Promise<ILessonDetail> {
    const response = await apiClient.put<IAbpResponseEnvelope<ILessonDetail>>(`${CURRICULUM_UPSERT_TRANSLATION_ENDPOINT}?lessonId=${lessonId}`, input);
    return response.data.result;
}

export const adminService = {
    getDashboardSummary,
    getPromptConfiguration,
    updatePromptConfiguration,
    getCurriculum,
    createTopic,
    updateTopic,
    createLesson,
    getLesson,
    updateLesson,
    upsertTranslation,
};
