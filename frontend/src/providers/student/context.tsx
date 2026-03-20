/**
 * StudentDashboard Context Types and State
 * Defines the shape of dashboard data, state, and actions following React Context + Reducer pattern.
 */

export interface NextLessonRecommendation {
    subjectId: string;
    lessonId: string;
    title: string;
    topicName: string;
    subjectName: string;
    estimatedMinutes: number;
    ruleBasisReason: string;
    aiEnhancedExplanation?: string;
}

export interface RevisionAdvice {
    topicId: string;
    topicName: string;
    subjectName: string;
    masteryPercent: number;
    ruleBasisAction: string;
    aiEnhancedAction?: string;
    recommendedLessonId?: string;
    recommendedLessonTitle?: string;
}

export interface MotivationalGuidance {
    baseMessage: string;
    aiEnhancedMessage?: string;
}

export interface HeatmapItem {
    topicId: string;
    topicName: string;
    subjectName: string;
    masteryPercent: number;
    severityBucket: "strong" | "moderate" | "weak" | "critical";
}

export interface StudentDashboardData {
    studentName: string;
    gradeLevel: string;
    overallScore: number;
    topicsMastered: number;
    totalTopics: number;
    lessonsCompleted: number;
    areasNeedingAttentionCount: number;
    recommendedNextLesson?: NextLessonRecommendation;
    areasNeedingAttention: RevisionAdvice[];
    guidance?: MotivationalGuidance;
    masteryHeatmap: HeatmapItem[];
}

export interface IStudentDashboardState {
    isLoading: boolean;
    data: StudentDashboardData | null;
    error: string | null;
}

export interface IStudentDashboardContextActions {
    fetchDashboard(): Promise<void>;
    clearError(): void;
    reset(): void;
}

export const INITIAL_STATE: IStudentDashboardState = {
    isLoading: false,
    data: null,
    error: null,
};
