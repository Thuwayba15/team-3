"use client";

import axios from "axios";
import { ReactNode, useContext, useEffect, useReducer } from "react";
import { useI18nState } from "@/providers/i18n";
import { apiClient } from "@/lib/api/client";
import { getCachedResource, invalidateCachedResource } from "@/lib/api/requestCache";
import {
    SUBJECT_GET_ALL_ENDPOINT,
    SUBJECT_GET_MY_ENDPOINT,
    TOPIC_GET_BY_SUBJECT_ENDPOINT,
    LESSON_GET_BY_TOPIC_ENDPOINT,
    LESSON_GET_ENDPOINT,
    UPLOAD_TEXT_MATERIAL_ENDPOINT,
} from "@/constants/api";
import {
    getSubjectsPending, getSubjectsSuccess, getSubjectsError,
    getMySubjectsPending, getMySubjectsSuccess, getMySubjectsError,
    getTopicsBySubjectPending, getTopicsBySubjectSuccess, getTopicsBySubjectError,
    getLessonsByTopicPending, getLessonsByTopicSuccess, getLessonsByTopicError,
    getLessonPending, getLessonSuccess, getLessonError,
    createLessonPending, createLessonSuccess, createLessonError,
} from "./actions";
import type {
    ISubject, ITopic, ILessonSummary, ILessonDetail,
    IUploadLessonInput, IUploadLessonOutput, ILessonTranslation,
    ISubjectContextActions, ISubjectContextState,
} from "./context";
import { INITIAL_STATE, SubjectActionsContext, SubjectStateContext } from "./context";
import { subjectReducer } from "./reducer";

export type { ISubject, ITopic, ILessonSummary, ILessonDetail, IUploadLessonInput, IUploadLessonOutput, ILessonTranslation };

interface IAbpResponse<T> {
    result: T;
    success: boolean;
}

interface ISubjectProviderProps {
    children: ReactNode;
}

export const SubjectProvider = ({ children }: ISubjectProviderProps) => {
    const [state, dispatch] = useReducer(subjectReducer, INITIAL_STATE);
    const { currentLanguage } = useI18nState();
    const languageKey = currentLanguage ?? "default";

    const getSubjects = async (): Promise<void> => {
        dispatch(getSubjectsPending());
        try {
            const subjects = await getCachedResource(`subjects:all:${languageKey}`, async () => {
                const response = await apiClient.get<IAbpResponse<ISubject[]>>(SUBJECT_GET_ALL_ENDPOINT);
                return response.data.result;
            }, 300000);
            dispatch(getSubjectsSuccess(subjects));
        } catch (error) {
            dispatch(getSubjectsError(resolveErrorMessage(error)));
        }
    };

    const getMySubjects = async (): Promise<void> => {
        dispatch(getMySubjectsPending());
        try {
            const subjects = await getCachedResource(`subjects:mine:${languageKey}`, async () => {
                const response = await apiClient.get<IAbpResponse<ISubject[]>>(SUBJECT_GET_MY_ENDPOINT);
                return response.data.result;
            }, 300000);
            dispatch(getMySubjectsSuccess(subjects));
        } catch (error) {
            dispatch(getMySubjectsError(resolveErrorMessage(error)));
        }
    };

    const getTopicsBySubject = async (subjectId: string): Promise<void> => {
        dispatch(getTopicsBySubjectPending());
        try {
            const topics = await getCachedResource(`subjects:topics:${languageKey}:${subjectId}`, async () => {
                const response = await apiClient.get<IAbpResponse<ITopic[]>>(TOPIC_GET_BY_SUBJECT_ENDPOINT, {
                    params: { subjectId },
                });
                return response.data.result;
            }, 300000);
            dispatch(getTopicsBySubjectSuccess(topics));
        } catch (error) {
            dispatch(getTopicsBySubjectError(resolveErrorMessage(error)));
        }
    };

    const getLessonsByTopic = async (topicId: string): Promise<void> => {
        dispatch(getLessonsByTopicPending());
        try {
            const lessons = await getCachedResource(`subjects:lessons:${languageKey}:${topicId}`, async () => {
                const response = await apiClient.get<IAbpResponse<ILessonSummary[]>>(LESSON_GET_BY_TOPIC_ENDPOINT, {
                    params: { topicId },
                });
                return response.data.result;
            }, 300000);
            dispatch(getLessonsByTopicSuccess(lessons));
        } catch (error) {
            dispatch(getLessonsByTopicError(resolveErrorMessage(error)));
        }
    };

    const getLesson = async (lessonId: string): Promise<void> => {
        dispatch(getLessonPending());
        try {
            const lesson = await getCachedResource(`subjects:lesson:${languageKey}:${lessonId}`, async () => {
                const response = await apiClient.get<IAbpResponse<ILessonDetail>>(LESSON_GET_ENDPOINT, {
                    params: { lessonId },
                });
                return response.data.result;
            }, 300000);
            dispatch(getLessonSuccess(lesson));
        } catch (error) {
            dispatch(getLessonError(resolveErrorMessage(error)));
        }
    };

    const createLesson = async (input: IUploadLessonInput): Promise<IUploadLessonOutput | undefined> => {
        dispatch(createLessonPending());
        try {
            const response = await apiClient.post<IAbpResponse<IUploadLessonOutput>>(UPLOAD_TEXT_MATERIAL_ENDPOINT, input);
            invalidateCachedResource(`subjects:lessons:${languageKey}:${input.topicId}`);
            invalidateCachedResource(`subjects:lesson:${languageKey}:`);
            dispatch(createLessonSuccess(response.data.result));
            return response.data.result;
        } catch (error) {
            dispatch(createLessonError(resolveErrorMessage(error)));
            return undefined;
        }
    };

    const actionsValue: ISubjectContextActions = { getSubjects, getMySubjects, getTopicsBySubject, getLessonsByTopic, getLesson, createLesson };

    // refresh subject/topic/lesson data when language preference changes
    useEffect(() => {
        if (state.mySubjects && state.mySubjects.length > 0) {
            void getMySubjects();
        }

        if (state.topics && state.topics.length > 0) {
            const subjectId = state.topics[0]?.subjectId;
            if (subjectId) {
                void getTopicsBySubject(subjectId);
            }
        }

        if (state.subjects && state.subjects.length > 0) {
            void getSubjects();
        }

        if (state.lessons && state.lessons.length > 0) {
            const topicId = state.lessons[0]?.topicId;
            if (topicId) {
                void getLessonsByTopic(topicId);
            }
        }

        if (state.selectedLesson?.id) {
            void getLesson(state.selectedLesson.id);
        }
    }, [currentLanguage]);

    return (
        <SubjectStateContext.Provider value={state}>
            <SubjectActionsContext.Provider value={actionsValue}>
                {children}
            </SubjectActionsContext.Provider>
        </SubjectStateContext.Provider>
    );
};

/** Returns the current subject state. Must be used inside <SubjectProvider>. */
export const useSubjectState = (): ISubjectContextState => {
    const context = useContext(SubjectStateContext);
    if (!context) throw new Error("useSubjectState must be used within SubjectProvider.");
    return context;
};

/** Returns subject action methods. Must be used inside <SubjectProvider>. */
export const useSubjectActions = (): ISubjectContextActions => {
    const context = useContext(SubjectActionsContext);
    if (!context) throw new Error("useSubjectActions must be used within SubjectProvider.");
    return context;
};

function resolveErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const abpMessage: string | undefined = error.response?.data?.error?.message;
        if (abpMessage) return abpMessage;
        if (error.response?.status === 403) return "You do not have permission to perform this action.";
        if (error.response?.status === 404) return "Resource not found.";
    }
    return "An unexpected error occurred. Please try again.";
}
