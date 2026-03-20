import { apiClient } from "@/lib/api/client";
import {
    LANGUAGES_CREATE_ENDPOINT,
    LANGUAGES_DELETE_ENDPOINT,
    LANGUAGES_GET_ALL_ENDPOINT,
    LANGUAGES_UPDATE_ENDPOINT,
} from "@/constants/api";

export interface ILanguage {
    id: string;
    code: string;
    name: string;
    nativeName: string | null;
    isActive: boolean;
    isDefault: boolean;
    sortOrder: number;
}

export interface ICreateLanguageRequest {
    code: string;
    name: string;
    nativeName: string;
    isDefault: boolean;
    isActive: boolean;
    sortOrder: number;
}

export interface IUpdateLanguageRequest {
    name: string;
    nativeName: string;
    isActive: boolean;
    isDefault: boolean;
    sortOrder: number;
}

interface IAbpEnvelope<T> {
    result: T;
    success: boolean;
}

/** Fetches all platform languages. */
async function getAll(): Promise<ILanguage[]> {
    const response = await apiClient.get<IAbpEnvelope<ILanguage[]>>(LANGUAGES_GET_ALL_ENDPOINT);
    return response.data.result;
}

/** Creates a new platform language. */
async function create(input: ICreateLanguageRequest): Promise<ILanguage> {
    const response = await apiClient.post<IAbpEnvelope<ILanguage>>(LANGUAGES_CREATE_ENDPOINT, input);
    return response.data.result;
}

/** Updates an existing platform language. */
async function update(id: string, input: IUpdateLanguageRequest): Promise<ILanguage> {
    const response = await apiClient.put<IAbpEnvelope<ILanguage>>(
        LANGUAGES_UPDATE_ENDPOINT,
        input,
        { params: { id } }
    );
    return response.data.result;
}

/** Deletes a platform language by id. */
async function remove(id: string): Promise<void> {
    await apiClient.delete(LANGUAGES_DELETE_ENDPOINT, { params: { id } });
}

export const languageService = { getAll, create, update, remove };
