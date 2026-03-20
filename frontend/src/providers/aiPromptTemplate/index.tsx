"use client";

import axios from "axios";
import { ReactNode, useContext, useMemo, useReducer } from "react";
import { aiPromptTemplateService } from "@/services/ai/aiPromptTemplateService";
import {
    createTemplateError,
    createTemplatePending,
    createTemplateSuccess,
    deleteTemplateError,
    deleteTemplatePending,
    deleteTemplateSuccess,
    getTemplatesError,
    getTemplatesPending,
    getTemplatesSuccess,
    updateTemplateError,
    updateTemplatePending,
    updateTemplateSuccess,
} from "./actions";
import {
    AIPromptTemplateActionsContext,
    AIPromptTemplateStateContext,
    IAIPromptTemplate,
    IAIPromptTemplateContextActions,
    IAIPromptTemplateState,
    INITIAL_STATE,
} from "./context";
import { aiPromptTemplateReducer } from "./reducer";

interface IAIPromptTemplateProviderProps {
    children: ReactNode;
}

export const AIPromptTemplateProvider = ({ children }: IAIPromptTemplateProviderProps) => {
    const [state, dispatch] = useReducer(aiPromptTemplateReducer, INITIAL_STATE);

    const getTemplates = async (): Promise<void> => {
        dispatch(getTemplatesPending());
        try {
            const templates = await aiPromptTemplateService.getAll();
            dispatch(getTemplatesSuccess(templates));
        } catch (error) {
            dispatch(getTemplatesError(resolveErrorMessage(error)));
        }
    };

    const createTemplate = async (template: Omit<IAIPromptTemplate, "id">): Promise<void> => {
        dispatch(createTemplatePending());
        try {
            const created = await aiPromptTemplateService.create(template);
            dispatch(createTemplateSuccess(created));
        } catch (error) {
            dispatch(createTemplateError(resolveErrorMessage(error)));
        }
    };

    const updateTemplate = async (id: string, template: Omit<IAIPromptTemplate, "id">): Promise<void> => {
        dispatch(updateTemplatePending());
        try {
            const updated = await aiPromptTemplateService.update(id, template);
            dispatch(updateTemplateSuccess(updated));
        } catch (error) {
            dispatch(updateTemplateError(resolveErrorMessage(error)));
        }
    };

    const deleteTemplate = async (id: string): Promise<void> => {
        dispatch(deleteTemplatePending());
        try {
            await aiPromptTemplateService.remove(id);
            dispatch(deleteTemplateSuccess(id));
        } catch (error) {
            dispatch(deleteTemplateError(resolveErrorMessage(error)));
        }
    };

    const actionsValue = useMemo<IAIPromptTemplateContextActions>(
        () => ({ getTemplates, createTemplate, updateTemplate, deleteTemplate }),
        []
    );

    return (
        <AIPromptTemplateStateContext.Provider value={state}>
            <AIPromptTemplateActionsContext.Provider value={actionsValue}>
                {children}
            </AIPromptTemplateActionsContext.Provider>
        </AIPromptTemplateStateContext.Provider>
    );
};

/** Returns the current AI prompt template state. Must be used inside <AIPromptTemplateProvider>. */
export const useAIPromptTemplateState = (): IAIPromptTemplateState => {
    const context = useContext(AIPromptTemplateStateContext);

    if (!context) {
        throw new Error("useAIPromptTemplateState must be used within AIPromptTemplateProvider.");
    }

    return context;
};

/** Returns AI prompt template action methods. Must be used inside <AIPromptTemplateProvider>. */
export const useAIPromptTemplateActions = (): IAIPromptTemplateContextActions => {
    const context = useContext(AIPromptTemplateActionsContext);

    if (!context) {
        throw new Error("useAIPromptTemplateActions must be used within AIPromptTemplateProvider.");
    }

    return context;
};

function resolveErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const abpMessage: string | undefined = error.response?.data?.error?.message;
        if (abpMessage) return abpMessage;

        if (error.response?.status === 404) return "Prompt template not found.";
        if (error.response?.status === 403) return "You do not have permission to perform this action.";
    }

    return "An unexpected error occurred. Please try again.";
}
