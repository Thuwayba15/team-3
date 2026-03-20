export type ReviewStatus = "Pending" | "Approved" | "Changes Requested";

export interface IQuestionTranslation {
    languageCode: string;
    languageName: string;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    explanationText: string;
}

export interface IAssessmentQuestion {
    questionId: string;
    questionType: number;
    correctAnswer: string;
    marks: number;
    sequenceOrder: number;
    translations: IQuestionTranslation[];
}

export interface IAssessmentResult {
    assessmentId: string;
    topicId: string;
    lessonId: string | null;
    title: string;
    assessmentType: number;
    difficultyLevel: number;
    totalMarks: number;
    questions: IAssessmentQuestion[];
}

export const DIFFICULTY_LABEL: Record<number, string> = { 1: "Easy", 2: "Medium", 3: "Hard" };
export const DIFFICULTY_COLOR: Record<number, string> = { 1: "green", 2: "orange", 3: "red" };
export type DraftSection = "topics" | "lessons" | "assessments";

export interface IAiDraftItem {
    id: string;
    title: string;
    detail: string;
    confidence: number;
    reviewStatus: ReviewStatus;
}

export interface IAiDraft {
    generatedAt: string;
    topics: IAiDraftItem[];
    lessons: IAiDraftItem[];
    assessments: IAiDraftItem[];
}

export interface ISubjectFormValues {
    name: string;
    gradeLevel: string;
    description: string;
}

export function getConfidenceClassName(value: number): "confidenceHigh" | "confidenceMedium" | "confidenceLow" {
    if (value >= 90) return "confidenceHigh";
    if (value >= 75) return "confidenceMedium";
    return "confidenceLow";
}

export function getReviewStatusClassName(status: ReviewStatus): "reviewPending" | "reviewApproved" | "reviewChanges" {
    if (status === "Approved") return "reviewApproved";
    if (status === "Changes Requested") return "reviewChanges";
    return "reviewPending";
}
