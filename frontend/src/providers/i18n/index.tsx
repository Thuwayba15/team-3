"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { useAuthState } from "@/providers/auth";
import { userProfileService } from "@/services/users/userProfileService";
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

const SUPPORTED_LANGUAGE_CODES = ["en", "zu", "st", "af"] as const;

function normalizeLanguageCode(languageCode: string | null | undefined): string {
    if (!languageCode) {
        return "en";
    }

    const normalized = languageCode.trim().toLowerCase();
    return SUPPORTED_LANGUAGE_CODES.includes(normalized as (typeof SUPPORTED_LANGUAGE_CODES)[number])
        ? normalized
        : "en";
}

export const I18nProvider = ({ children }: II18nProviderProps) => {
    const [state, dispatch] = useReducer(i18nReducer, INITIAL_STATE);
    const { i18n } = useTranslation();
    const { isAuthenticated, isLoading: isAuthLoading, userId } = useAuthState();
    const syncedLanguageUserIdRef = useRef<number | null>(null);

    useEffect(() => {
        const savedLanguage = localStorage.getItem(PLATFORM_LANGUAGE_STORAGE_KEY) ?? "en";

        if (i18n.language !== savedLanguage) {
            void i18n.changeLanguage(savedLanguage);
        } else {
            dispatch(setLanguage(savedLanguage));
            document.documentElement.lang = savedLanguage;
        }
    }, [i18n]);

    useEffect(() => {
        const handleLanguageChanged = (languageCode: string): void => {
            dispatch(setLanguage(languageCode));
            document.documentElement.lang = languageCode;
        };

        i18n.on("languageChanged", handleLanguageChanged);

        return () => {
            i18n.off("languageChanged", handleLanguageChanged);
        };
    }, [i18n]);

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        if (!isAuthenticated || userId === null) {
            syncedLanguageUserIdRef.current = null;
            return;
        }

        if (syncedLanguageUserIdRef.current === userId) {
            return;
        }

        let isCancelled = false;

        const syncLanguageFromServer = async (): Promise<void> => {
            dispatch(setLoading(true));

            try {
                const profile = await userProfileService.getMyProfile();
                const serverLanguageCode = normalizeLanguageCode(profile.preferredLanguage);
                const activeLanguageCode = normalizeLanguageCode(i18n.language);

                if (serverLanguageCode !== activeLanguageCode) {
                    await i18n.changeLanguage(serverLanguageCode);
                }

                localStorage.setItem(PLATFORM_LANGUAGE_STORAGE_KEY, serverLanguageCode);
                syncedLanguageUserIdRef.current = userId;
            } catch {
                // keep cached language when profile lookup fails
            } finally {
                if (!isCancelled) {
                    dispatch(setLoading(false));
                }
            }
        };

        void syncLanguageFromServer();

        return () => {
            isCancelled = true;
        };
    }, [i18n, isAuthLoading, isAuthenticated, userId]);

    const updateLanguage = useCallback(async (languageCode: string): Promise<void> => {
        dispatch(setLoading(true));

        try {
            const normalizedLanguageCode = normalizeLanguageCode(languageCode);
            await i18n.changeLanguage(normalizedLanguageCode);
            localStorage.setItem(PLATFORM_LANGUAGE_STORAGE_KEY, normalizedLanguageCode);
        } finally {
            dispatch(setLoading(false));
        }
    }, [i18n]);

    const actionsValue = useMemo<II18nContextActions>(
        () => ({
            setLanguage: updateLanguage,
        }),
        [updateLanguage]
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
