import { createContext } from "react";

export interface ISubject {
    id: string;
    name: string;
    description: string;
    gradeLevel: string;
    isActive: boolean;
}

export interface ITopic {
    id: string;
    subjectId: string;
    name: string;
    description: string | null;
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

export interface ILessonDetail {
    id: string;
    topicId: string;
    title: string;
    summary: string | null;
    learningObjective: string | null;
    revisionSummary: string | null;
    difficultyLevel: number;
    estimatedMinutes: number;
    isPublished: boolean;
    translations: ILessonTranslation[];
}

export interface ILessonTranslation {
    languageCode: string;
    languageName: string;
    title: string;
    content: string;
    summary: string | null;
    examples: string | null;
    revisionSummary: string | null;
    isAutoTranslated: boolean;
}

export interface IUploadLessonInput {
    subjectId: string;
    topicId: string;
    topicName: string;
    topicDescription: string | null;
    title: string;
    content: string;
    summary?: string;
    examples?: string;
    revisionSummary?: string;
    learningObjective?: string;
    difficultyLevel: number;
    estimatedMinutes: number;
    isPublished: boolean;
    sourceLanguageCode: string;
    gradeLevel?: string;
    description?: string;
}

export interface IUploadLessonOutput {
    sourceMaterialId: string;
    subjectId: string;
    topicId: string;
    lessonId: string;
    title: string;
    sourceLanguageCode: string;
    translations: ILessonTranslation[];
}

export interface ISubjectState {
    isLoading: boolean;
    isTopicsLoading: boolean;
    isLessonsLoading: boolean;
    isLessonLoading: boolean;
    isCreatingLesson: boolean;
    isSuccess: boolean;
    isError: boolean;
    errorMessage: string | null;
    subjects?: ISubject[];
    mySubjects?: ISubject[];
    topics?: ITopic[];
    lessons?: ILessonSummary[];
    selectedLesson?: ILessonDetail;
    createdLesson?: IUploadLessonOutput;
}

export type ISubjectContextState = ISubjectState;

export interface ISubjectContextActions {
    getSubjects: () => Promise<void>;
    getMySubjects: () => Promise<void>;
    getTopicsBySubject: (subjectId: string) => Promise<void>;
    getLessonsByTopic: (topicId: string) => Promise<void>;
    getLesson: (lessonId: string) => Promise<void>;
    createLesson: (input: IUploadLessonInput) => Promise<IUploadLessonOutput | undefined>;
}

export const INITIAL_STATE: ISubjectState = {
    isLoading: false,
    isTopicsLoading: false,
    isLessonsLoading: false,
    isLessonLoading: false,
    isCreatingLesson: false,
    isSuccess: false,
    isError: false,
    errorMessage: null,
};

export const SubjectStateContext = createContext<ISubjectContextState | undefined>(undefined);
export const SubjectActionsContext = createContext<ISubjectContextActions | undefined>(undefined);
