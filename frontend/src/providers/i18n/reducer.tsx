import { I18nAction, I18nActionType } from "./actions";
import { II18nState } from "./context";

export const i18nReducer = (state: II18nState, action: I18nAction): II18nState => {
    switch (action.type) {
        case I18nActionType.SetLoading:
            return {
                ...state,
                isLoading: action.payload,
            };

        case I18nActionType.SetLanguage:
            return {
                ...state,
                currentLanguage: action.payload,
            };

        default:
            return state;
    }
};
