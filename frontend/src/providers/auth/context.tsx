export interface IAuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    userId: number | null;
    errorMessage: string | null;
}

export interface ILoginValues {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient: boolean;
}

export type IAuthContextState = IAuthState;

export interface IAuthContextActions {
    login(values: ILoginValues): Promise<void>;
    logout(): void;
    clearAuthError(): void;
}

export const INITIAL_STATE: IAuthState = {
    isLoading: false,
    isAuthenticated: false,
    userId: null,
    errorMessage: null,
};
