import type { IAIPromptTemplate } from "./context";

export enum AIPromptTemplateActionType {
    // Get all
    GetTemplatesPending = "GET_AI_PROMPT_TEMPLATES_PENDING",
    GetTemplatesSuccess = "GET_AI_PROMPT_TEMPLATES_SUCCESS",
    GetTemplatesError = "GET_AI_PROMPT_TEMPLATES_ERROR",

    // Create
    CreateTemplatePending = "CREATE_AI_PROMPT_TEMPLATE_PENDING",
    CreateTemplateSuccess = "CREATE_AI_PROMPT_TEMPLATE_SUCCESS",
    CreateTemplateError = "CREATE_AI_PROMPT_TEMPLATE_ERROR",

    // Update
    UpdateTemplatePending = "UPDATE_AI_PROMPT_TEMPLATE_PENDING",
    UpdateTemplateSuccess = "UPDATE_AI_PROMPT_TEMPLATE_SUCCESS",
    UpdateTemplateError = "UPDATE_AI_PROMPT_TEMPLATE_ERROR",

    // Delete
    DeleteTemplatePending = "DELETE_AI_PROMPT_TEMPLATE_PENDING",
    DeleteTemplateSuccess = "DELETE_AI_PROMPT_TEMPLATE_SUCCESS",
    DeleteTemplateError = "DELETE_AI_PROMPT_TEMPLATE_ERROR",
}

// Action interfaces

export interface IGetTemplatesPendingAction { type: AIPromptTemplateActionType.GetTemplatesPending; }
export interface IGetTemplatesSuccessAction { type: AIPromptTemplateActionType.GetTemplatesSuccess; payload: IAIPromptTemplate[]; }
export interface IGetTemplatesErrorAction { type: AIPromptTemplateActionType.GetTemplatesError; payload: string; }

export interface ICreateTemplatePendingAction { type: AIPromptTemplateActionType.CreateTemplatePending; }
export interface ICreateTemplateSuccessAction { type: AIPromptTemplateActionType.CreateTemplateSuccess; payload: IAIPromptTemplate; }
export interface ICreateTemplateErrorAction { type: AIPromptTemplateActionType.CreateTemplateError; payload: string; }

export interface IUpdateTemplatePendingAction { type: AIPromptTemplateActionType.UpdateTemplatePending; }
export interface IUpdateTemplateSuccessAction { type: AIPromptTemplateActionType.UpdateTemplateSuccess; payload: IAIPromptTemplate; }
export interface IUpdateTemplateErrorAction { type: AIPromptTemplateActionType.UpdateTemplateError; payload: string; }

export interface IDeleteTemplatePendingAction { type: AIPromptTemplateActionType.DeleteTemplatePending; }
export interface IDeleteTemplateSuccessAction { type: AIPromptTemplateActionType.DeleteTemplateSuccess; payload: string; }
export interface IDeleteTemplateErrorAction { type: AIPromptTemplateActionType.DeleteTemplateError; payload: string; }

export type AIPromptTemplateAction =
    | IGetTemplatesPendingAction | IGetTemplatesSuccessAction | IGetTemplatesErrorAction
    | ICreateTemplatePendingAction | ICreateTemplateSuccessAction | ICreateTemplateErrorAction
    | IUpdateTemplatePendingAction | IUpdateTemplateSuccessAction | IUpdateTemplateErrorAction
    | IDeleteTemplatePendingAction | IDeleteTemplateSuccessAction | IDeleteTemplateErrorAction;

// Action creators

export const getTemplatesPending = (): IGetTemplatesPendingAction => ({ type: AIPromptTemplateActionType.GetTemplatesPending });
export const getTemplatesSuccess = (templates: IAIPromptTemplate[]): IGetTemplatesSuccessAction => ({ type: AIPromptTemplateActionType.GetTemplatesSuccess, payload: templates });
export const getTemplatesError = (message: string): IGetTemplatesErrorAction => ({ type: AIPromptTemplateActionType.GetTemplatesError, payload: message });

export const createTemplatePending = (): ICreateTemplatePendingAction => ({ type: AIPromptTemplateActionType.CreateTemplatePending });
export const createTemplateSuccess = (template: IAIPromptTemplate): ICreateTemplateSuccessAction => ({ type: AIPromptTemplateActionType.CreateTemplateSuccess, payload: template });
export const createTemplateError = (message: string): ICreateTemplateErrorAction => ({ type: AIPromptTemplateActionType.CreateTemplateError, payload: message });

export const updateTemplatePending = (): IUpdateTemplatePendingAction => ({ type: AIPromptTemplateActionType.UpdateTemplatePending });
export const updateTemplateSuccess = (template: IAIPromptTemplate): IUpdateTemplateSuccessAction => ({ type: AIPromptTemplateActionType.UpdateTemplateSuccess, payload: template });
export const updateTemplateError = (message: string): IUpdateTemplateErrorAction => ({ type: AIPromptTemplateActionType.UpdateTemplateError, payload: message });

export const deleteTemplatePending = (): IDeleteTemplatePendingAction => ({ type: AIPromptTemplateActionType.DeleteTemplatePending });
export const deleteTemplateSuccess = (id: string): IDeleteTemplateSuccessAction => ({ type: AIPromptTemplateActionType.DeleteTemplateSuccess, payload: id });
export const deleteTemplateError = (message: string): IDeleteTemplateErrorAction => ({ type: AIPromptTemplateActionType.DeleteTemplateError, payload: message });
