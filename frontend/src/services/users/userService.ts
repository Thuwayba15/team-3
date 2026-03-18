import { apiClient } from "@/lib/api/client";
import { USERS_GET_ALL_ENDPOINT } from "@/constants/api";

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

export const userService = {
    getAll,
};
