"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from "react";
import { useTranslation } from "react-i18next";
import { setLanguage, setLoading } from "./actions";
import {
    II18nContextActions,
    II18nContextState,
    INITIAL_STATE,
    PLATFORM_LANGUAGE_STORAGE_KEY,
} from "./context";
import { i18nReducer } from "./reducer";
import "@/i18n/i18n";

const I18nStateContext = createContext<II18nContextState | undefined>(undefined);
const I18nActionsContext = createContext<II18nContextActions | undefined>(undefined);

interface II18nProviderProps {
    children: ReactNode;
}

export const I18nProvider = ({ children }: II18nProviderProps) => {
    const [state, dispatch] = useReducer(i18nReducer, INITIAL_STATE);
    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem(PLATFORM_LANGUAGE_STORAGE_KEY) ?? "en";

        dispatch(setLanguage(savedLanguage));
        document.documentElement.lang = savedLanguage;

        if (i18n.language !== savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, [i18n]);

    const updateLanguage = async (languageCode: string): Promise<void> => {
        dispatch(setLoading(true));

        try {
            await i18n.changeLanguage(languageCode);
            localStorage.setItem(PLATFORM_LANGUAGE_STORAGE_KEY, languageCode);
            document.documentElement.lang = languageCode;
            dispatch(setLanguage(languageCode));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const actionsValue = useMemo<II18nContextActions>(
        () => ({
            setLanguage: updateLanguage,
        }),
        []
    );

    return (
        <I18nStateContext.Provider value={state}>
            <I18nActionsContext.Provider value={actionsValue}>
                {children}
            </I18nActionsContext.Provider>
        </I18nStateContext.Provider>
    );
};

export const useI18nState = (): II18nContextState => {
    const context = useContext(I18nStateContext);

    if (!context) {
        throw new Error("useI18nState must be used within I18nProvider.");
    }

    return context;
};

export const useI18nActions = (): II18nContextActions => {
    const context = useContext(I18nActionsContext);

    if (!context) {
        throw new Error("useI18nActions must be used within I18nProvider.");
    }

    return context;
};

export const useI18n = () => {
    const state = useI18nState();
    const actions = useI18nActions();

    return {
        currentLanguage: state.currentLanguage,
        isLoading: state.isLoading,
        setLanguage: actions.setLanguage,
    };
};
