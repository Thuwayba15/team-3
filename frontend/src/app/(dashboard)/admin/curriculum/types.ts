export type ReviewStatus = "Pending" | "Approved" | "Changes Requested";
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
