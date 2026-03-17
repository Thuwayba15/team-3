import { UserAction, UserActionType } from "./actions";
import { IUserState } from "./context";

export const userReducer = (state: IUserState, action: UserAction): IUserState => {
    switch (action.type) {
        // Single user
        case UserActionType.GetUserPending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case UserActionType.GetUserSuccess:
            return { ...state, isLoading: false, isSuccess: true, isError: false, user: action.payload };

        case UserActionType.GetUserError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        // All users
        case UserActionType.GetUsersPending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case UserActionType.GetUsersSuccess:
            return { ...state, isLoading: false, isSuccess: true, isError: false, users: action.payload };

        case UserActionType.GetUsersError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        // Users by role
        case UserActionType.GetUsersByRolePending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case UserActionType.GetUsersByRoleSuccess:
            return { ...state, isLoading: false, isSuccess: true, isError: false, users: action.payload };

        case UserActionType.GetUsersByRoleError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        // Create user
        case UserActionType.CreateUserPending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case UserActionType.CreateUserSuccess:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                user: action.payload,
                users: state.users ? [...state.users, action.payload] : [action.payload],
            };

        case UserActionType.CreateUserError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        // Update user
        case UserActionType.UpdateUserPending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case UserActionType.UpdateUserSuccess:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                user: action.payload,
                users: state.users?.map((u) => (u.id === action.payload.id ? action.payload : u)),
            };

        case UserActionType.UpdateUserError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        // Delete user
        case UserActionType.DeleteUserPending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case UserActionType.DeleteUserSuccess:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                user: undefined,
                users: state.users?.filter((u) => u.id !== action.payload),
            };

        case UserActionType.DeleteUserError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        default:
            return state;
    }
};
