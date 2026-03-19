export interface II18nState {
    currentLanguage: string;
    isLoading: boolean;
}

export type II18nContextState = II18nState;

export interface II18nContextActions {
    setLanguage: (languageCode: string) => Promise<void>;
}

export const PLATFORM_LANGUAGE_STORAGE_KEY = "platformLanguage";

export const INITIAL_STATE: II18nState = {
    currentLanguage: "en",
    isLoading: false,
};
