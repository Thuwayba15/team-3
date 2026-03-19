import { AuthAction, AuthActionType } from "./actions";
import { IAuthState } from "./context";

export const authReducer = (
    state: IAuthState,
    action: AuthAction
): IAuthState => {
    switch (action.type) {
        case AuthActionType.SetLoading:
            return {
                ...state,
                isLoading: action.payload,
            };

        case AuthActionType.SetAuthenticated:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                userId: action.payload.userId,
                role: action.payload.role,
                errorMessage: null,
            };

        case AuthActionType.SetUnauthenticated:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                userId: null,
                role: null,
                errorMessage: null,
            };

        case AuthActionType.SetError:
            return {
                ...state,
                isLoading: false,
                errorMessage: action.payload,
            };

        case AuthActionType.ClearError:
            return {
                ...state,
                errorMessage: null,
            };

        default:
            return state;
    }
};
