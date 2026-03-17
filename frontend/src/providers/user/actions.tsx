import type { IUser, UserRole } from "./context";

export enum UserActionType {
    // Single user
    GetUserPending = "GET_USER_PENDING",
    GetUserSuccess = "GET_USER_SUCCESS",
    GetUserError = "GET_USER_ERROR",

    // All users
    GetUsersPending = "GET_USERS_PENDING",
    GetUsersSuccess = "GET_USERS_SUCCESS",
    GetUsersError = "GET_USERS_ERROR",

    // Users by role
    GetUsersByRolePending = "GET_USERS_BY_ROLE_PENDING",
    GetUsersByRoleSuccess = "GET_USERS_BY_ROLE_SUCCESS",
    GetUsersByRoleError = "GET_USERS_BY_ROLE_ERROR",

    // Create user
    CreateUserPending = "CREATE_USER_PENDING",
    CreateUserSuccess = "CREATE_USER_SUCCESS",
    CreateUserError = "CREATE_USER_ERROR",

    // Update user
    UpdateUserPending = "UPDATE_USER_PENDING",
    UpdateUserSuccess = "UPDATE_USER_SUCCESS",
    UpdateUserError = "UPDATE_USER_ERROR",

    // Delete user
    DeleteUserPending = "DELETE_USER_PENDING",
    DeleteUserSuccess = "DELETE_USER_SUCCESS",
    DeleteUserError = "DELETE_USER_ERROR",
}

// Action interfaces

export interface IGetUserPendingAction {
    type: UserActionType.GetUserPending;
}

export interface IGetUserSuccessAction {
    type: UserActionType.GetUserSuccess;
    payload: IUser;
}

export interface IGetUserErrorAction {
    type: UserActionType.GetUserError;
    payload: string;
}

export interface IGetUsersPendingAction {
    type: UserActionType.GetUsersPending;
}

export interface IGetUsersSuccessAction {
    type: UserActionType.GetUsersSuccess;
    payload: IUser[];
}

export interface IGetUsersErrorAction {
    type: UserActionType.GetUsersError;
    payload: string;
}

export interface IGetUsersByRolePendingAction {
    type: UserActionType.GetUsersByRolePending;
    payload: UserRole;
}

export interface IGetUsersByRoleSuccessAction {
    type: UserActionType.GetUsersByRoleSuccess;
    payload: IUser[];
}

export interface IGetUsersByRoleErrorAction {
    type: UserActionType.GetUsersByRoleError;
    payload: string;
}

export interface ICreateUserPendingAction {
    type: UserActionType.CreateUserPending;
}

export interface ICreateUserSuccessAction {
    type: UserActionType.CreateUserSuccess;
    payload: IUser;
}

export interface ICreateUserErrorAction {
    type: UserActionType.CreateUserError;
    payload: string;
}

export interface IUpdateUserPendingAction {
    type: UserActionType.UpdateUserPending;
}

export interface IUpdateUserSuccessAction {
    type: UserActionType.UpdateUserSuccess;
    payload: IUser;
}

export interface IUpdateUserErrorAction {
    type: UserActionType.UpdateUserError;
    payload: string;
}

export interface IDeleteUserPendingAction {
    type: UserActionType.DeleteUserPending;
}

export interface IDeleteUserSuccessAction {
    type: UserActionType.DeleteUserSuccess;
    payload: number;
}

export interface IDeleteUserErrorAction {
    type: UserActionType.DeleteUserError;
    payload: string;
}

export type UserAction =
    | IGetUserPendingAction
    | IGetUserSuccessAction
    | IGetUserErrorAction
    | IGetUsersPendingAction
    | IGetUsersSuccessAction
    | IGetUsersErrorAction
    | IGetUsersByRolePendingAction
    | IGetUsersByRoleSuccessAction
    | IGetUsersByRoleErrorAction
    | ICreateUserPendingAction
    | ICreateUserSuccessAction
    | ICreateUserErrorAction
    | IUpdateUserPendingAction
    | IUpdateUserSuccessAction
    | IUpdateUserErrorAction
    | IDeleteUserPendingAction
    | IDeleteUserSuccessAction
    | IDeleteUserErrorAction;

// Action creators

export const getUserPending = (): IGetUserPendingAction => ({
    type: UserActionType.GetUserPending,
});

export const getUserSuccess = (user: IUser): IGetUserSuccessAction => ({
    type: UserActionType.GetUserSuccess,
    payload: user,
});

export const getUserError = (message: string): IGetUserErrorAction => ({
    type: UserActionType.GetUserError,
    payload: message,
});

export const getUsersPending = (): IGetUsersPendingAction => ({
    type: UserActionType.GetUsersPending,
});

export const getUsersSuccess = (users: IUser[]): IGetUsersSuccessAction => ({
    type: UserActionType.GetUsersSuccess,
    payload: users,
});

export const getUsersError = (message: string): IGetUsersErrorAction => ({
    type: UserActionType.GetUsersError,
    payload: message,
});

export const getUsersByRolePending = (role: UserRole): IGetUsersByRolePendingAction => ({
    type: UserActionType.GetUsersByRolePending,
    payload: role,
});

export const getUsersByRoleSuccess = (users: IUser[]): IGetUsersByRoleSuccessAction => ({
    type: UserActionType.GetUsersByRoleSuccess,
    payload: users,
});

export const getUsersByRoleError = (message: string): IGetUsersByRoleErrorAction => ({
    type: UserActionType.GetUsersByRoleError,
    payload: message,
});

export const createUserPending = (): ICreateUserPendingAction => ({
    type: UserActionType.CreateUserPending,
});

export const createUserSuccess = (user: IUser): ICreateUserSuccessAction => ({
    type: UserActionType.CreateUserSuccess,
    payload: user,
});

export const createUserError = (message: string): ICreateUserErrorAction => ({
    type: UserActionType.CreateUserError,
    payload: message,
});

export const updateUserPending = (): IUpdateUserPendingAction => ({
    type: UserActionType.UpdateUserPending,
});

export const updateUserSuccess = (user: IUser): IUpdateUserSuccessAction => ({
    type: UserActionType.UpdateUserSuccess,
    payload: user,
});

export const updateUserError = (message: string): IUpdateUserErrorAction => ({
    type: UserActionType.UpdateUserError,
    payload: message,
});

export const deleteUserPending = (): IDeleteUserPendingAction => ({
    type: UserActionType.DeleteUserPending,
});

export const deleteUserSuccess = (id: number): IDeleteUserSuccessAction => ({
    type: UserActionType.DeleteUserSuccess,
    payload: id,
});

export const deleteUserError = (message: string): IDeleteUserErrorAction => ({
    type: UserActionType.DeleteUserError,
    payload: message,
});
