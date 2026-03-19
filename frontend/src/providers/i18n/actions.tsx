export enum I18nActionType {
    SetLoading = "SET_LOADING",
    SetLanguage = "SET_LANGUAGE",
}

export interface ISetLoadingAction {
    type: I18nActionType.SetLoading;
    payload: boolean;
}

export interface ISetLanguageAction {
    type: I18nActionType.SetLanguage;
    payload: string;
}

export type I18nAction = ISetLoadingAction | ISetLanguageAction;

export const setLoading = (isLoading: boolean): ISetLoadingAction => ({
    type: I18nActionType.SetLoading,
    payload: isLoading,
});

export const setLanguage = (languageCode: string): ISetLanguageAction => ({
    type: I18nActionType.SetLanguage,
    payload: languageCode,
});
