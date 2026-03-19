import { apiClient } from "@/lib/api/client";
import {
    AI_PROMPT_TEMPLATES_CREATE_ENDPOINT,
    AI_PROMPT_TEMPLATES_DELETE_ENDPOINT,
    AI_PROMPT_TEMPLATES_GET_ALL_ENDPOINT,
    AI_PROMPT_TEMPLATES_UPDATE_ENDPOINT,
} from "@/constants/api";

export interface IAIPromptTemplate {
    id: string;
    name: string;
    purpose: string;
    templateText: string;
    temperature: number;
}

export interface ICreateAIPromptTemplateRequest {
    name: string;
    purpose: string;
    templateText: string;
    temperature: number;
}

export interface IUpdateAIPromptTemplateRequest {
    name: string;
    purpose: string;
    templateText: string;
    temperature: number;
}

interface IAbpResponseEnvelope<T> {
    result: T;
    success: boolean;
}

/** Fetches all AI prompt templates. */
async function getAll(): Promise<IAIPromptTemplate[]> {
    const response = await apiClient.get<IAbpResponseEnvelope<IAIPromptTemplate[]>>(
        AI_PROMPT_TEMPLATES_GET_ALL_ENDPOINT
    );
    return response.data.result;
}

/** Creates a new AI prompt template. */
async function create(input: ICreateAIPromptTemplateRequest): Promise<IAIPromptTemplate> {
    const response = await apiClient.post<IAbpResponseEnvelope<IAIPromptTemplate>>(
        AI_PROMPT_TEMPLATES_CREATE_ENDPOINT,
        input
    );
    return response.data.result;
}

/** Updates an existing AI prompt template. */
async function update(id: string, input: IUpdateAIPromptTemplateRequest): Promise<IAIPromptTemplate> {
    const response = await apiClient.put<IAbpResponseEnvelope<IAIPromptTemplate>>(
        AI_PROMPT_TEMPLATES_UPDATE_ENDPOINT,
        input,
        { params: { id } }
    );
    return response.data.result;
}

/** Deletes an AI prompt template by id. */
async function remove(id: string): Promise<void> {
    await apiClient.delete(AI_PROMPT_TEMPLATES_DELETE_ENDPOINT, { params: { id } });
}

export const aiPromptTemplateService = {
    getAll,
    create,
    update,
    remove,
};
