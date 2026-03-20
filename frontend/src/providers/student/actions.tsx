/**
 * StudentDashboard Action Types and Creators
 * Defines all reducer action types and action creation helpers.
 */

import type { StudentDashboardData } from "./context";

export enum StudentDashboardActionType {
    SetLoading = "SET_LOADING",
    SetData = "SET_DATA",
    SetError = "SET_ERROR",
    ClearError = "CLEAR_ERROR",
    Reset = "RESET",
}

export interface ISetLoadingAction {
    type: StudentDashboardActionType.SetLoading;
    payload: boolean;
}

export interface ISetDataAction {
    type: StudentDashboardActionType.SetData;
    payload: StudentDashboardData;
}

export interface ISetErrorAction {
    type: StudentDashboardActionType.SetError;
    payload: string;
}

export interface IClearErrorAction {
    type: StudentDashboardActionType.ClearError;
}

export interface IResetAction {
    type: StudentDashboardActionType.Reset;
}

export type StudentDashboardAction =
    | ISetLoadingAction
    | ISetDataAction
    | ISetErrorAction
    | IClearErrorAction
    | IResetAction;

// Action creators
export const setLoading = (isLoading: boolean): ISetLoadingAction => ({
    type: StudentDashboardActionType.SetLoading,
    payload: isLoading,
});

export const setData = (data: StudentDashboardData): ISetDataAction => ({
    type: StudentDashboardActionType.SetData,
    payload: data,
});

export const setError = (error: string): ISetErrorAction => ({
    type: StudentDashboardActionType.SetError,
    payload: error,
});

export const clearError = (): IClearErrorAction => ({
    type: StudentDashboardActionType.ClearError,
});

export const reset = (): IResetAction => ({
    type: StudentDashboardActionType.Reset,
});
