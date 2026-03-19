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
import { normalizePlatformLanguageCode } from "@/i18n/platformLanguages";
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

const I18NEXT_LANGUAGE_STORAGE_KEY = "i18nextLng";

function setCachedLanguage(languageCode: string): void {
    localStorage.setItem(PLATFORM_LANGUAGE_STORAGE_KEY, languageCode);
    localStorage.setItem(I18NEXT_LANGUAGE_STORAGE_KEY, languageCode);
}

export const I18nProvider = ({ children }: II18nProviderProps) => {
    const [state, dispatch] = useReducer(i18nReducer, INITIAL_STATE);
    const { i18n } = useTranslation();
    const { isAuthenticated, isLoading: isAuthLoading, userId } = useAuthState();
    const syncedLanguageUserIdRef = useRef<number | null>(null);
    const activeUpdateRequestIdRef = useRef<number>(0);

    useEffect(() => {
        const cachedLanguage = localStorage.getItem(PLATFORM_LANGUAGE_STORAGE_KEY);
        if (!cachedLanguage) {
            const activeLanguage = normalizePlatformLanguageCode(i18n.language);
            dispatch(setLanguage(activeLanguage));
            document.documentElement.lang = activeLanguage;
            return;
        }

        const savedLanguage = normalizePlatformLanguageCode(cachedLanguage);

        if (i18n.language !== savedLanguage) {
            void i18n.changeLanguage(savedLanguage);
        } else {
            dispatch(setLanguage(savedLanguage));
            document.documentElement.lang = savedLanguage;
        }

        if (cachedLanguage !== savedLanguage) {
            setCachedLanguage(savedLanguage);
        }
    }, [i18n]);

    useEffect(() => {
        const handleLanguageChanged = (languageCode: string): void => {
            const normalizedLanguageCode = normalizePlatformLanguageCode(languageCode);
            dispatch(setLanguage(normalizedLanguageCode));
            document.documentElement.lang = normalizedLanguageCode;
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
            try {
                const profile = await userProfileService.getMyProfile();
                if (isCancelled || activeUpdateRequestIdRef.current > 0) {
                    return;
                }

                const serverLanguageCode = normalizePlatformLanguageCode(profile.preferredLanguage);
                const activeLanguageCode = normalizePlatformLanguageCode(i18n.language);

                if (serverLanguageCode !== activeLanguageCode) {
                    await i18n.changeLanguage(serverLanguageCode);
                }

                setCachedLanguage(serverLanguageCode);
                syncedLanguageUserIdRef.current = userId;
            } catch {
                // keep cached language when profile lookup fails
            }
        };

        void syncLanguageFromServer();

        return () => {
            isCancelled = true;
        };
    }, [i18n, isAuthLoading, isAuthenticated, userId]);

    const updateLanguage = useCallback(async (languageCode: string): Promise<void> => {
        const normalizedLanguageCode = normalizePlatformLanguageCode(languageCode);
        const previousLanguageCode = normalizePlatformLanguageCode(i18n.language);

        if (normalizedLanguageCode === previousLanguageCode) {
            return;
        }

        const requestId = activeUpdateRequestIdRef.current + 1;
        activeUpdateRequestIdRef.current = requestId;

        dispatch(setLoading(true));

        try {
            await i18n.changeLanguage(normalizedLanguageCode);
            setCachedLanguage(normalizedLanguageCode);

            if (isAuthenticated && userId !== null) {
                try {
                    await userProfileService.updateMyPlatformLanguage(normalizedLanguageCode);
                    if (requestId !== activeUpdateRequestIdRef.current) {
                        return;
                    }

                    syncedLanguageUserIdRef.current = userId;
                } catch (error) {
                    if (requestId !== activeUpdateRequestIdRef.current) {
                        return;
                    }

                    await i18n.changeLanguage(previousLanguageCode);
                    setCachedLanguage(previousLanguageCode);
                    throw error;
                }
            }
        } finally {
            if (requestId === activeUpdateRequestIdRef.current) {
                dispatch(setLoading(false));
            }
        }
    }, [i18n, isAuthenticated, userId]);

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
