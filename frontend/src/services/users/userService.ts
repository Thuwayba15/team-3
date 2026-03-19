import { apiClient } from "@/lib/api/client";
import { USERS_GET_ALL_ENDPOINT, USERS_GET_ENDPOINT, USERS_UPDATE_ENDPOINT } from "@/constants/api";

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

interface IPagedResult<T> {
    totalCount: number;
    items: T[];
}

interface IAbpResponseEnvelope<T> {
    result: T;
    success: boolean;
}

/** Fetches all platform users from the ABP User AppService. */
async function getAll(): Promise<IPagedResult<IUser>> {
    const response = await apiClient.get<IAbpResponseEnvelope<IPagedResult<IUser>>>(
        USERS_GET_ALL_ENDPOINT
    );
    return response.data.result;
}

/** Fetches a single platform user by id from the ABP User AppService. */
async function getById(id: number): Promise<IUser> {
    const response = await apiClient.get<IAbpResponseEnvelope<IUser>>(USERS_GET_ENDPOINT, {
        params: { Id: id },
    });
    return response.data.result;
}

/** Updates a user from the ABP User AppService and returns the latest user payload. */
async function update(user: IUser): Promise<IUser> {
    const response = await apiClient.put<IAbpResponseEnvelope<IUser>>(USERS_UPDATE_ENDPOINT, user);
    return response.data.result;
}

export const userService = {
    getAll,
    getById,
    update,
};
