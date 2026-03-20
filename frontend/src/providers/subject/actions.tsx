import type { ISubject, ITopic, ILessonSummary, ILessonDetail, IUploadLessonOutput } from "./context";

export enum SubjectActionType {
    // All subjects
    GetSubjectsPending = "GET_SUBJECTS_PENDING",
    GetSubjectsSuccess = "GET_SUBJECTS_SUCCESS",
    GetSubjectsError = "GET_SUBJECTS_ERROR",

    // My subjects (enrolled)
    GetMySubjectsPending = "GET_MY_SUBJECTS_PENDING",
    GetMySubjectsSuccess = "GET_MY_SUBJECTS_SUCCESS",
    GetMySubjectsError = "GET_MY_SUBJECTS_ERROR",

    // Topics by subject
    GetTopicsBySubjectPending = "GET_TOPICS_BY_SUBJECT_PENDING",
    GetTopicsBySubjectSuccess = "GET_TOPICS_BY_SUBJECT_SUCCESS",
    GetTopicsBySubjectError = "GET_TOPICS_BY_SUBJECT_ERROR",

    // Lessons by topic
    GetLessonsByTopicPending = "GET_LESSONS_BY_TOPIC_PENDING",
    GetLessonsByTopicSuccess = "GET_LESSONS_BY_TOPIC_SUCCESS",
    GetLessonsByTopicError = "GET_LESSONS_BY_TOPIC_ERROR",

    // Get lesson detail
    GetLessonPending = "GET_LESSON_PENDING",
    GetLessonSuccess = "GET_LESSON_SUCCESS",
    GetLessonError = "GET_LESSON_ERROR",

    // Create lesson
    CreateLessonPending = "CREATE_LESSON_PENDING",
    CreateLessonSuccess = "CREATE_LESSON_SUCCESS",
    CreateLessonError = "CREATE_LESSON_ERROR",
}

// Action interfaces

export interface IGetSubjectsPendingAction {
    type: SubjectActionType.GetSubjectsPending;
}

export interface IGetSubjectsSuccessAction {
    type: SubjectActionType.GetSubjectsSuccess;
    payload: ISubject[];
}

export interface IGetSubjectsErrorAction {
    type: SubjectActionType.GetSubjectsError;
    payload: string;
}

export interface IGetMySubjectsPendingAction {
    type: SubjectActionType.GetMySubjectsPending;
}

export interface IGetMySubjectsSuccessAction {
    type: SubjectActionType.GetMySubjectsSuccess;
    payload: ISubject[];
}

export interface IGetMySubjectsErrorAction {
    type: SubjectActionType.GetMySubjectsError;
    payload: string;
}

export interface IGetTopicsBySubjectPendingAction {
    type: SubjectActionType.GetTopicsBySubjectPending;
}

export interface IGetTopicsBySubjectSuccessAction {
    type: SubjectActionType.GetTopicsBySubjectSuccess;
    payload: ITopic[];
}

export interface IGetTopicsBySubjectErrorAction {
    type: SubjectActionType.GetTopicsBySubjectError;
    payload: string;
}

export interface IGetLessonsByTopicPendingAction {
    type: SubjectActionType.GetLessonsByTopicPending;
}

export interface IGetLessonsByTopicSuccessAction {
    type: SubjectActionType.GetLessonsByTopicSuccess;
    payload: ILessonSummary[];
}

export interface IGetLessonsByTopicErrorAction {
    type: SubjectActionType.GetLessonsByTopicError;
    payload: string;
}

export interface IGetLessonPendingAction {
    type: SubjectActionType.GetLessonPending;
}

export interface IGetLessonSuccessAction {
    type: SubjectActionType.GetLessonSuccess;
    payload: ILessonDetail;
}

export interface IGetLessonErrorAction {
    type: SubjectActionType.GetLessonError;
    payload: string;
}

export interface ICreateLessonPendingAction {
    type: SubjectActionType.CreateLessonPending;
}

export interface ICreateLessonSuccessAction {
    type: SubjectActionType.CreateLessonSuccess;
    payload: IUploadLessonOutput;
}

export interface ICreateLessonErrorAction {
    type: SubjectActionType.CreateLessonError;
    payload: string;
}

export type SubjectAction =
    | IGetSubjectsPendingAction
    | IGetSubjectsSuccessAction
    | IGetSubjectsErrorAction
    | IGetMySubjectsPendingAction
    | IGetMySubjectsSuccessAction
    | IGetMySubjectsErrorAction
    | IGetTopicsBySubjectPendingAction
    | IGetTopicsBySubjectSuccessAction
    | IGetTopicsBySubjectErrorAction
    | IGetLessonsByTopicPendingAction
    | IGetLessonsByTopicSuccessAction
    | IGetLessonsByTopicErrorAction
    | IGetLessonPendingAction
    | IGetLessonSuccessAction
    | IGetLessonErrorAction
    | ICreateLessonPendingAction
    | ICreateLessonSuccessAction
    | ICreateLessonErrorAction;

// Action creators

export const getSubjectsPending = (): IGetSubjectsPendingAction => ({
    type: SubjectActionType.GetSubjectsPending,
});

export const getSubjectsSuccess = (subjects: ISubject[]): IGetSubjectsSuccessAction => ({
    type: SubjectActionType.GetSubjectsSuccess,
    payload: subjects,
});

export const getSubjectsError = (message: string): IGetSubjectsErrorAction => ({
    type: SubjectActionType.GetSubjectsError,
    payload: message,
});

export const getMySubjectsPending = (): IGetMySubjectsPendingAction => ({
    type: SubjectActionType.GetMySubjectsPending,
});

export const getMySubjectsSuccess = (subjects: ISubject[]): IGetMySubjectsSuccessAction => ({
    type: SubjectActionType.GetMySubjectsSuccess,
    payload: subjects,
});

export const getMySubjectsError = (message: string): IGetMySubjectsErrorAction => ({
    type: SubjectActionType.GetMySubjectsError,
    payload: message,
});

export const getTopicsBySubjectPending = (): IGetTopicsBySubjectPendingAction => ({
    type: SubjectActionType.GetTopicsBySubjectPending,
});

export const getTopicsBySubjectSuccess = (topics: ITopic[]): IGetTopicsBySubjectSuccessAction => ({
    type: SubjectActionType.GetTopicsBySubjectSuccess,
    payload: topics,
});

export const getTopicsBySubjectError = (message: string): IGetTopicsBySubjectErrorAction => ({
    type: SubjectActionType.GetTopicsBySubjectError,
    payload: message,
});

export const getLessonsByTopicPending = (): IGetLessonsByTopicPendingAction => ({
    type: SubjectActionType.GetLessonsByTopicPending,
});

export const getLessonsByTopicSuccess = (lessons: ILessonSummary[]): IGetLessonsByTopicSuccessAction => ({
    type: SubjectActionType.GetLessonsByTopicSuccess,
    payload: lessons,
});

export const getLessonsByTopicError = (message: string): IGetLessonsByTopicErrorAction => ({
    type: SubjectActionType.GetLessonsByTopicError,
    payload: message,
});

export const getLessonPending = (): IGetLessonPendingAction => ({
    type: SubjectActionType.GetLessonPending,
});

export const getLessonSuccess = (lesson: ILessonDetail): IGetLessonSuccessAction => ({
    type: SubjectActionType.GetLessonSuccess,
    payload: lesson,
});

export const getLessonError = (message: string): IGetLessonErrorAction => ({
    type: SubjectActionType.GetLessonError,
    payload: message,
});

export const createLessonPending = (): ICreateLessonPendingAction => ({
    type: SubjectActionType.CreateLessonPending,
});

export const createLessonSuccess = (output: IUploadLessonOutput): ICreateLessonSuccessAction => ({
    type: SubjectActionType.CreateLessonSuccess,
    payload: output,
});

export const createLessonError = (message: string): ICreateLessonErrorAction => ({
    type: SubjectActionType.CreateLessonError,
    payload: message,
});
