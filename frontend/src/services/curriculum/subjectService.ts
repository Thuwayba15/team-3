import { apiClient } from "@/lib/api/client";
import {
    ADMIN_SUBJECTS_CREATE_ENDPOINT,
    ADMIN_SUBJECTS_DELETE_ENDPOINT,
    ADMIN_SUBJECTS_GET_ALL_ENDPOINT,
    ADMIN_SUBJECTS_UPDATE_ENDPOINT,
} from "@/constants/api";

export interface ISubject {
    id: string;
    name: string;
    gradeLevel: string;
    description: string;
    isActive: boolean;
}

export interface ICreateSubjectRequest {
    name: string;
    gradeLevel: string;
    description: string;
}

export interface IUpdateSubjectRequest {
    name: string;
    gradeLevel: string;
    description: string;
    isActive: boolean;
}

interface IAbpEnvelope<T> {
    result: T;
    success: boolean;
}

/** Fetches all subjects (admin view, includes inactive). */
async function getAll(): Promise<ISubject[]> {
    const response = await apiClient.get<IAbpEnvelope<ISubject[]>>(ADMIN_SUBJECTS_GET_ALL_ENDPOINT);
    return response.data.result;
}

/** Creates a new subject. */
async function create(input: ICreateSubjectRequest): Promise<ISubject> {
    const response = await apiClient.post<IAbpEnvelope<ISubject>>(ADMIN_SUBJECTS_CREATE_ENDPOINT, input);
    return response.data.result;
}

/** Updates an existing subject. */
async function update(id: string, input: IUpdateSubjectRequest): Promise<ISubject> {
    const response = await apiClient.put<IAbpEnvelope<ISubject>>(
        ADMIN_SUBJECTS_UPDATE_ENDPOINT,
        input,
        { params: { id } }
    );
    return response.data.result;
}

/** Deletes a subject by id. */
async function remove(id: string): Promise<void> {
    await apiClient.delete(ADMIN_SUBJECTS_DELETE_ENDPOINT, { params: { id } });
}

export const subjectService = { getAll, create, update, remove };
