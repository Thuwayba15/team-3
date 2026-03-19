import { createContext } from "react";
import { IAIPromptTemplate } from "@/services/ai/aiPromptTemplateService";

export type { IAIPromptTemplate };

export interface IAIPromptTemplateState {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    errorMessage: string | null;
    template?: IAIPromptTemplate;
    templates?: IAIPromptTemplate[];
}

export interface IAIPromptTemplateContextActions {
    getTemplates: () => Promise<void>;
    createTemplate: (template: Omit<IAIPromptTemplate, "id">) => Promise<void>;
    updateTemplate: (id: string, template: Omit<IAIPromptTemplate, "id">) => Promise<void>;
    deleteTemplate: (id: string) => Promise<void>;
}

export const INITIAL_STATE: IAIPromptTemplateState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: null,
};

export const AIPromptTemplateStateContext = createContext<IAIPromptTemplateState | undefined>(undefined);
export const AIPromptTemplateActionsContext = createContext<IAIPromptTemplateContextActions | undefined>(undefined);
