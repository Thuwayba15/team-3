export interface IAuthState {
    isLoading: boolean;
    isAuthenticated: boolean;
    accessToken: string | null;
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
    accessToken: null,
    userId: null,
    errorMessage: null,
};
