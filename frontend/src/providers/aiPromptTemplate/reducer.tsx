import { AIPromptTemplateAction, AIPromptTemplateActionType } from "./actions";
import { IAIPromptTemplateState } from "./context";

export const aiPromptTemplateReducer = (
    state: IAIPromptTemplateState,
    action: AIPromptTemplateAction
): IAIPromptTemplateState => {
    switch (action.type) {
        // Get all
        case AIPromptTemplateActionType.GetTemplatesPending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case AIPromptTemplateActionType.GetTemplatesSuccess:
            return { ...state, isLoading: false, isSuccess: true, isError: false, templates: action.payload };

        case AIPromptTemplateActionType.GetTemplatesError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        // Create
        case AIPromptTemplateActionType.CreateTemplatePending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case AIPromptTemplateActionType.CreateTemplateSuccess:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                template: action.payload,
                templates: state.templates ? [...state.templates, action.payload] : [action.payload],
            };

        case AIPromptTemplateActionType.CreateTemplateError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        // Update
        case AIPromptTemplateActionType.UpdateTemplatePending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case AIPromptTemplateActionType.UpdateTemplateSuccess:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                template: action.payload,
                templates: state.templates?.map((t) => (t.id === action.payload.id ? action.payload : t)),
            };

        case AIPromptTemplateActionType.UpdateTemplateError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        // Delete
        case AIPromptTemplateActionType.DeleteTemplatePending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case AIPromptTemplateActionType.DeleteTemplateSuccess:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                template: undefined,
                templates: state.templates?.filter((t) => t.id !== action.payload),
            };

        case AIPromptTemplateActionType.DeleteTemplateError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        default:
            return state;
    }
};
