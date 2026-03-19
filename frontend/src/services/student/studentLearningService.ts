import {
    STUDENT_DASHBOARD_ENDPOINT,
    STUDENT_DIAGNOSTIC_START_ENDPOINT,
    STUDENT_DIAGNOSTIC_SUBMIT_ENDPOINT,
    STUDENT_LEARNING_PATH_ENDPOINT,
    STUDENT_LESSON_ENDPOINT,
    STUDENT_PROGRESS_OVERVIEW_ENDPOINT,
    STUDENT_TUTOR_CONFIGURATION_ENDPOINT,
} from "@/constants/api";
import { apiClient } from "@/lib/api/client";

interface IAbpResponseEnvelope<T> {
    result: T;
}

export interface ISubject {
    id: string;
    name: string;
    description?: string | null;
    gradeLevel: string;
    isActive: boolean;
}

export interface ITopic {
    id: string;
    subjectId: string;
    name: string;
    description?: string | null;
    difficultyLevel: number;
    sequenceOrder: number;
    isActive: boolean;
}

export interface ILessonSummary {
    id: string;
    topicId: string;
    title: string;
    difficultyLevel: number;
    estimatedMinutes: number;
    isPublished: boolean;
}

export interface ITopicDetail extends ITopic {
    masteryThreshold: number;
    lessons: ILessonSummary[];
}

export interface IStudentProgress {
    id: string;
    studentId: number;
    subjectId: string;
    subjectName: string;
    masteryScore: number;
    progressStatus: string;
    lastAssessmentScore: number;
    attemptCount: number;
    needsIntervention: boolean;
    updatedAt: string;
    completedLessonCount: number;
    revisionNeeded: boolean;
}

export interface IDiagnosticQuestion {
    id: string;
    prompt: string;
    options: string[];
}

export interface IDiagnosticQuestionSet {
    subjectId: string;
    topicId: string;
    subjectName: string;
    topicName: string;
    questions: IDiagnosticQuestion[];
}

export interface IDiagnosticResult {
    subjectId: string;
    topicId: string;
    topicName: string;
    scorePercent: number;
    correctAnswers: number;
    totalQuestions: number;
    recommendation: string;
}

export interface ILessonTranslation {
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
    translations: ILessonTranslation[];
}

export interface IStudentDashboard {
    subject?: ISubject | null;
    recommendedTopic?: ITopic | null;
    recommendedLesson?: ILessonSummary | null;
    progress?: IStudentProgress | null;
    latestDiagnostic?: IDiagnosticResult | null;
}

export interface ITutorConfiguration {
    generalPrompt: string;
    lifeSciencesPrompt: string;
    responseStyle: string;
    masteryThreshold: number;
    retryLimit: number;
}

export interface IStudentLearningPath {
    subject: ISubject;
    progress: IStudentProgress;
    topics: ITopicDetail[];
    recommendedTopic?: ITopic | null;
    recommendedLesson?: ILessonSummary | null;
    latestDiagnostic?: IDiagnosticResult | null;
}

export interface IStudentProgressOverview {
    subject: ISubject;
    progress: IStudentProgress;
    latestDiagnostic?: IDiagnosticResult | null;
    focusTopics: string[];
    publishedLessonCount: number;
}

async function getDashboard(): Promise<IStudentDashboard> {
    const response = await apiClient.get<IAbpResponseEnvelope<IStudentDashboard>>(STUDENT_DASHBOARD_ENDPOINT);
    return response.data.result;
}

async function getTutorConfiguration(): Promise<ITutorConfiguration> {
    const response = await apiClient.get<IAbpResponseEnvelope<ITutorConfiguration>>(STUDENT_TUTOR_CONFIGURATION_ENDPOINT);
    return response.data.result;
}

async function getLearningPath(): Promise<IStudentLearningPath> {
    const response = await apiClient.get<IAbpResponseEnvelope<IStudentLearningPath>>(STUDENT_LEARNING_PATH_ENDPOINT);
    return response.data.result;
}

async function getProgressOverview(): Promise<IStudentProgressOverview> {
    const response = await apiClient.get<IAbpResponseEnvelope<IStudentProgressOverview>>(STUDENT_PROGRESS_OVERVIEW_ENDPOINT);
    return response.data.result;
}

async function startDiagnostic(topicId: string): Promise<IDiagnosticQuestionSet> {
    const response = await apiClient.post<IAbpResponseEnvelope<IDiagnosticQuestionSet>>(`${STUDENT_DIAGNOSTIC_START_ENDPOINT}?topicId=${topicId}`);
    return response.data.result;
}

async function submitDiagnostic(topicId: string, answers: Record<string, string>): Promise<IDiagnosticResult> {
    const response = await apiClient.post<IAbpResponseEnvelope<IDiagnosticResult>>(STUDENT_DIAGNOSTIC_SUBMIT_ENDPOINT, { topicId, answers });
    return response.data.result;
}

async function getLesson(lessonId: string, languageCode?: string): Promise<ILessonDetail> {
    const suffix = languageCode ? `?lessonId=${lessonId}&languageCode=${languageCode}` : `?lessonId=${lessonId}`;
    const response = await apiClient.get<IAbpResponseEnvelope<ILessonDetail>>(`${STUDENT_LESSON_ENDPOINT}${suffix}`);
    return response.data.result;
}

export const studentLearningService = {
    getDashboard,
    getTutorConfiguration,
    getLearningPath,
    getProgressOverview,
    startDiagnostic,
    submitDiagnostic,
    getLesson,
};
