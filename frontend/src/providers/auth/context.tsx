import type { AppRole } from "@/types/navigation";

export interface IAuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    userId: number | null;
    role: AppRole | null;
    errorMessage: string | null;
}

export interface ILoginValues {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient: boolean;
}

export interface IRegisterValues {
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    roleNames: string[];
    role: string;
    password: string;
}

export type IAuthContextState = IAuthState;

export interface IAuthContextActions {
    login(values: ILoginValues): Promise<void>;
    register(values: IRegisterValues): Promise<void>; // Add this
    logout(): Promise<void>;
    clearAuthError(): void;
}

export const INITIAL_STATE: IAuthState = {
    isLoading: true, // Lets Start in loading state until we check the auth status on mount
    isAuthenticated: false,
    userId: null,
    role: null,
    errorMessage: null,
};
