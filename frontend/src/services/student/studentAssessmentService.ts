import {
    STUDENT_ASSESSMENT_GET_ENDPOINT,
    STUDENT_ASSESSMENT_SUBMIT_DIAGNOSTIC_ENDPOINT,
    STUDENT_ASSESSMENT_SUBMIT_LESSON_QUIZ_ENDPOINT,
} from "@/constants/api";
import { apiClient } from "@/lib/api/client";
import type { DifficultyLevel } from "@/services/student/studentSubjectService";

interface IAbpResponseEnvelope<T> {
    result: T;
    success?: boolean;
}

export type AssessmentType = 1 | 2 | 3 | 4;
export type QuestionType = 1 | 2 | 3;

export interface IStudentAssessmentQuestion {
    questionId: string;
    questionType: QuestionType;
    sequenceOrder: number;
    marks: number;
    questionText: string;
    optionA?: string | null;
    optionB?: string | null;
    optionC?: string | null;
    optionD?: string | null;
    hintText?: string | null;
    languageCode: string;
    languageName: string;
}

export interface IStudentAssessment {
    assessmentId: string;
    subjectId: string;
    topicId: string;
    lessonId: string | null;
    subjectName: string;
    topicName: string;
    title: string;
    assessmentType: AssessmentType;
    difficultyLevel: DifficultyLevel;
    totalMarks: number;
    languageCode: string;
    questions: IStudentAssessmentQuestion[];
}

export interface IStudentAssessmentAnswerInput {
    questionId: string;
    selectedOption?: string | null;
    answerText?: string | null;
}

export interface ISubmitStudentAssessmentInput {
    assessmentId: string;
    answers: IStudentAssessmentAnswerInput[];
}

export interface IStudentQuestionFeedback {
    questionId: string;
    selectedOption?: string | null;
    answerText?: string | null;
    isCorrect: boolean;
    marksAwarded: number;
    correctAnswer?: string | null;
    explanationText?: string | null;
}

export interface ISubmitStudentAssessmentOutput {
    attemptId: string;
    assessmentId: string;
    score: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
    assignedDifficultyLevel: DifficultyLevel;
    nextRecommendedAction: string;
    attemptNumber: number;
    feedback: IStudentQuestionFeedback[];
}

async function getAssessment(assessmentId: string): Promise<IStudentAssessment> {
    const response = await apiClient.get<IAbpResponseEnvelope<IStudentAssessment>>(STUDENT_ASSESSMENT_GET_ENDPOINT, {
        params: { assessmentId },
    });
    return response.data.result;
}

async function submitDiagnostic(input: ISubmitStudentAssessmentInput): Promise<ISubmitStudentAssessmentOutput> {
    const response = await apiClient.post<IAbpResponseEnvelope<ISubmitStudentAssessmentOutput>>(STUDENT_ASSESSMENT_SUBMIT_DIAGNOSTIC_ENDPOINT, input);
    return response.data.result;
}

async function submitLessonQuiz(input: ISubmitStudentAssessmentInput): Promise<ISubmitStudentAssessmentOutput> {
    const response = await apiClient.post<IAbpResponseEnvelope<ISubmitStudentAssessmentOutput>>(STUDENT_ASSESSMENT_SUBMIT_LESSON_QUIZ_ENDPOINT, input);
    return response.data.result;
}

export const studentAssessmentService = {
    getAssessment,
    submitDiagnostic,
    submitLessonQuiz,
};
