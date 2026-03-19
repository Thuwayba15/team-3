import axios from "axios";
import {
    USERS_ACTIVATE_ENDPOINT,
    USERS_CREATE_ENDPOINT,
    USERS_DEACTIVATE_ENDPOINT,
    USERS_GET_ALL_ENDPOINT,
    USERS_GET_ENDPOINT,
    USERS_GET_ROLES_ENDPOINT,
    USERS_UPDATE_ENDPOINT,
} from "@/constants/api";
import { apiClient } from "@/lib/api/client";

export interface IUser {
    id: number;
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    fullName: string;
    lastLoginTime: string | null;
    creationTime: string;
    roleNames: string[];
}

export interface IRoleOption {
    id: number;
    name: string;
    displayName: string;
    normalizedName: string;
}

export interface IUsersQuery {
    keyword?: string;
    isActive?: boolean;
    roleName?: string;
    sorting?: string;
    skipCount?: number;
    maxResultCount?: number;
}

export interface ICreateUserInput {
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    password: string;
    roleNames: string[];
}

export interface IUpdateUserInput {
    id: number;
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    roleNames: string[];
}

export interface IPagedResult<T> {
    totalCount: number;
    items: T[];
}

interface IAbpResponseEnvelope<T> {
    result: T;
    success?: boolean;
}

interface IListResult<T> {
    items: T[];
}

function toQueryParams(query: IUsersQuery) {
    return {
        Keyword: query.keyword,
        IsActive: query.isActive,
        RoleName: query.roleName,
        Sorting: query.sorting,
        SkipCount: query.skipCount,
        MaxResultCount: query.maxResultCount,
    };
}

async function putWithPostFallback<TResponse>(endpoint: string, payload: unknown): Promise<TResponse> {
    try {
        const response = await apiClient.put<IAbpResponseEnvelope<TResponse>>(endpoint, payload);
        return response.data.result;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 405) {
            const response = await apiClient.post<IAbpResponseEnvelope<TResponse>>(endpoint, payload);
            return response.data.result;
        }

        throw error;
    }
}

/** Fetches platform users with ABP paging and filtering. */
async function getAll(query: IUsersQuery = {}): Promise<IPagedResult<IUser>> {
    const response = await apiClient.get<IAbpResponseEnvelope<IPagedResult<IUser>>>(USERS_GET_ALL_ENDPOINT, {
        params: toQueryParams(query),
    });
    return response.data.result;
}

/** Fetches a single platform user by id from the ABP User AppService. */
async function getById(id: number): Promise<IUser> {
    const response = await apiClient.get<IAbpResponseEnvelope<IUser>>(USERS_GET_ENDPOINT, {
        params: { Id: id },
    });
    return response.data.result;
}

/** Creates a new platform user and returns the latest payload. */
async function create(input: ICreateUserInput): Promise<IUser> {
    const response = await apiClient.post<IAbpResponseEnvelope<IUser>>(USERS_CREATE_ENDPOINT, input);
    return response.data.result;
}

/** Updates a user from the ABP User AppService and returns the latest user payload. */
async function update(user: IUpdateUserInput): Promise<IUser> {
    return putWithPostFallback<IUser>(USERS_UPDATE_ENDPOINT, user);
}

/** Activates a platform user. */
async function activate(id: number): Promise<void> {
    await apiClient.post(USERS_ACTIVATE_ENDPOINT, { id });
}

/** Deactivates a platform user. */
async function deactivate(id: number): Promise<void> {
    await apiClient.post(USERS_DEACTIVATE_ENDPOINT, { id });
}

/** Returns available user roles for admin forms. */
async function getRoles(): Promise<IRoleOption[]> {
    const response = await apiClient.get<IAbpResponseEnvelope<IListResult<IRoleOption>>>(USERS_GET_ROLES_ENDPOINT);
    return response.data.result.items;
}

export const userService = {
    getAll,
    getById,
    create,
    update,
    activate,
    deactivate,
    getRoles,
};
