/** All possible action type identifiers for the auth reducer. */
export enum AuthActionType {
    SetLoading = "SET_LOADING",
    SetAuthenticated = "SET_AUTHENTICATED",
    SetUnauthenticated = "SET_UNAUTHENTICATED",
    SetError = "SET_ERROR",
    ClearError = "CLEAR_ERROR",
}

// Action payload shapes

export interface ISetLoadingAction {
    type: AuthActionType.SetLoading;
    payload: boolean;
}

export interface ISetAuthenticatedPayload {
    accessToken: string;
    userId: number;
}

export interface ISetAuthenticatedAction {
    type: AuthActionType.SetAuthenticated;
    payload: ISetAuthenticatedPayload;
}

export interface ISetUnauthenticatedAction {
    type: AuthActionType.SetUnauthenticated;
}

export interface ISetErrorAction {
    type: AuthActionType.SetError;
    payload: string;
}

export interface IClearErrorAction {
    type: AuthActionType.ClearError;
}

export type AuthAction =
    | ISetLoadingAction
    | ISetAuthenticatedAction
    | ISetUnauthenticatedAction
    | ISetErrorAction
    | IClearErrorAction;

// Action creators

export const setLoading = (isLoading: boolean): ISetLoadingAction => ({
    type: AuthActionType.SetLoading,
    payload: isLoading,
});

export const setAuthenticated = (
    payload: ISetAuthenticatedPayload
): ISetAuthenticatedAction => ({
    type: AuthActionType.SetAuthenticated,
    payload,
});

export const setUnauthenticated = (): ISetUnauthenticatedAction => ({
    type: AuthActionType.SetUnauthenticated,
});

export const setError = (message: string): ISetErrorAction => ({
    type: AuthActionType.SetError,
    payload: message,
});

export const clearError = (): IClearErrorAction => ({
    type: AuthActionType.ClearError,
});
