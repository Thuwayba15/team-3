"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
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
    IRegisterValues,
} from "./context";
import { authReducer } from "./reducer";
import { authService } from "@/services/auth/authService";
import type { AppRole } from "@/types/navigation";

const ROLE_STORAGE_KEY = "userRole";

function resolveRole(roles: string[]): AppRole | null {
    const normalized = roles.map((r) => r.toLowerCase()) as AppRole[];
    const priority: AppRole[] = ["admin", "tutor", "parent", "student"];
    return priority.find((r) => normalized.includes(r)) ?? null;
}

// --- Contexts ---

const AuthStateContext = createContext<IAuthContextState | undefined>(undefined);
const AuthActionsContext = createContext<IAuthContextActions | undefined>(undefined);

// --- Provider ---

interface IAuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
    const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

    /**
     * On mount, check if the user has an active session (HttpOnly cookie).
     */
    useEffect(() => {
        dispatch(setLoading(true));
        authService
            .getMe()
            .then((me) => {
                const storedRole = localStorage.getItem(ROLE_STORAGE_KEY) as AppRole | null;
                dispatch(setAuthenticated({ userId: me.userId, role: storedRole }));
            })
            .catch(() => dispatch(setLoading(false)));
    }, []);

    const login = async (values: ILoginValues): Promise<void> => {
        dispatch(setLoading(true));
        try {
            const response = await authService.login({
                userNameOrEmailAddress: values.userNameOrEmailAddress,
                password: values.password,
                rememberClient: values.rememberClient,
            });

            const role = resolveRole(response.roles ?? []);
            if (role) localStorage.setItem(ROLE_STORAGE_KEY, role);
            dispatch(setAuthenticated({ userId: response.userId, role }));
        } catch (error) {
            const message = resolveErrorMessage(error);
            dispatch(setError(message));
        }
    };

    const register = async (values: IRegisterValues): Promise<void> => {
        dispatch(setLoading(true));
        try {
            await authService.register({
                userName: values.userName,
                name: values.name,
                surname: values.surname,
                emailAddress: values.emailAddress,
                password: values.password,
                roleNames: values.role ? [values.role] : [],
            });
            // Auto-login after successful registration
            await login({
                userNameOrEmailAddress: values.userName,
                password: values.password,
                rememberClient: false,
            });
        } catch (error) {
            const message = resolveErrorMessage(error);
            dispatch(setError(message));
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } catch {
            // keep UX predictable: clear local auth even if network logout fails
        }
        dispatch(setUnauthenticated());
    };

    const clearAuthError = (): void => {
        dispatch(clearError());
    };

    // Memoize actions to prevent unnecessary re-renders of consuming components
    const actionsValue = useMemo<IAuthContextActions>(
        () => ({ login, register, logout, clearAuthError }),
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

// --- Hooks ---

export const useAuthState = (): IAuthContextState => {
    const context = useContext(AuthStateContext);
    if (!context) {
        throw new Error("useAuthState must be used within AuthProvider.");
    }
    return context;
};

export const useAuthActions = (): IAuthContextActions => {
    const context = useContext(AuthActionsContext);
    if (!context) {
        throw new Error("useAuthActions must be used within AuthProvider.");
    }
    return context;
};

// --- Helpers ---

function resolveErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const abpMessage: string | undefined = error.response?.data?.error?.message;
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