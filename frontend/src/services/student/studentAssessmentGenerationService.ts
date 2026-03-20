import { ASSESSMENT_GENERATION_GET_LESSON_ASSESSMENTS_ENDPOINT } from "@/constants/api";
import { apiClient } from "@/lib/api/client";
import type { DifficultyLevel } from "@/services/student/studentSubjectService";

interface IAbpResponseEnvelope<T> {
    result: T;
    success?: boolean;
}

export interface IGeneratedAssessmentSummary {
    assessmentId: string;
    topicId: string;
    lessonId: string | null;
    title: string;
    assessmentType: number;
    difficultyLevel: DifficultyLevel;
    totalMarks: number;
}

interface IGeneratedAssessmentOutput {
    assessments: IGeneratedAssessmentSummary[];
}

async function getLessonAssessments(lessonId: string): Promise<IGeneratedAssessmentSummary[]> {
    const response = await apiClient.get<IAbpResponseEnvelope<IGeneratedAssessmentOutput>>(
        ASSESSMENT_GENERATION_GET_LESSON_ASSESSMENTS_ENDPOINT,
        {
            params: { lessonId },
        }
    );

    return response.data.result.assessments ?? [];
}

export function selectLessonAssessmentByDifficulty(
    assessments: IGeneratedAssessmentSummary[],
    assignedDifficulty: DifficultyLevel | null | undefined
): IGeneratedAssessmentSummary | null {
    if (assessments.length === 0) {
        return null;
    }

    return assessments.find((assessment) => assignedDifficulty != null && assessment.difficultyLevel === assignedDifficulty)
        ?? assessments.find((assessment) => assessment.difficultyLevel === 2)
        ?? assessments[0]
        ?? null;
}

export const studentAssessmentGenerationService = {
    getLessonAssessments,
};
