"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useMemo,
    useReducer,
} from "react";
import axios from "axios";
import {
    clearError,
    setAuthenticated,
    setError,
    setLoading,
    setUnauthenticated,
} from "./actions";
import {
    IAuthContextActions,
    IAuthContextState,
    ILoginValues,
    INITIAL_STATE,
} from "./context";
import { authReducer } from "./reducer";
import { authService } from "@/services/auth/authService";
import { authStorage } from "@/lib/auth/authStorage";

// Contexts

const AuthStateContext = createContext<IAuthContextState | undefined>(
    undefined
);
const AuthActionsContext = createContext<IAuthContextActions | undefined>(
    undefined
);

// Provider

interface IAuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
    const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

    const login = async (values: ILoginValues): Promise<void> => {
        dispatch(setLoading(true));

        try {
            const response = await authService.login({
                userNameOrEmailAddress: values.userNameOrEmailAddress,
                password: values.password,
                rememberClient: values.rememberClient,
            });

            authStorage.saveAuthData(response.accessToken, response.userId);

            dispatch(
                setAuthenticated({
                    accessToken: response.accessToken,
                    userId: response.userId,
                })
            );
        } catch (error) {
            const message = resolveErrorMessage(error);
            dispatch(setError(message));
        }
    };

    const logout = (): void => {
        authStorage.clearAuthData();
        dispatch(setUnauthenticated());
    };

    const clearAuthError = (): void => {
        dispatch(clearError());
    };

    const actionsValue = useMemo<IAuthContextActions>(
        () => ({ login, logout, clearAuthError }),
        []
    );

    return (
        <AuthStateContext.Provider value={state}>
            <AuthActionsContext.Provider value={actionsValue}>
                {children}
            </AuthActionsContext.Provider>
        </AuthStateContext.Provider>
    );
};

// Hooks

/** Returns the current auth state. Must be used inside <AuthProvider>. */
export const useAuthState = (): IAuthContextState => {
    const context = useContext(AuthStateContext);

    if (!context) {
        throw new Error("useAuthState must be used within AuthProvider.");
    }

    return context;
};

/** Returns auth action methods. Must be used inside <AuthProvider>. */
export const useAuthActions = (): IAuthContextActions => {
    const context = useContext(AuthActionsContext);

    if (!context) {
        throw new Error("useAuthActions must be used within AuthProvider.");
    }

    return context;
};

function resolveErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const abpMessage: string | undefined =
            error.response?.data?.error?.message;
        if (abpMessage) {
            return abpMessage;
        }

        if (error.response?.status === 401) {
            return "Invalid username or password.";
        }

        return "An unexpected error occurred. Please try again.";
    }

    return "An unexpected error occurred. Please try again.";
}
