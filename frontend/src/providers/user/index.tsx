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
    getUserPending,
    getUserSuccess,
    getUserError,
    getUsersPending,
    getUsersSuccess,
    getUsersError,
    getUsersByRolePending,
    getUsersByRoleSuccess,
    getUsersByRoleError,
    createUserPending,
    createUserSuccess,
    createUserError,
    updateUserPending,
    updateUserSuccess,
    updateUserError,
    deleteUserPending,
    deleteUserSuccess,
    deleteUserError,
} from "./actions";
import {
    IUser,
    IUserContextActions,
    IUserContextState,
    INITIAL_STATE,
    UserRole,
} from "./context";
import { userReducer } from "./reducer";
import { apiClient } from "@/lib/api/client";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`;

// Contexts

const UserStateContext = createContext<IUserContextState | undefined>(undefined);
const UserActionsContext = createContext<IUserContextActions | undefined>(undefined);

// Provider

interface IUserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: IUserProviderProps) => {
    const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);

    const getUser = async (id: number): Promise<void> => {
        dispatch(getUserPending());
        try {
            const response = await apiClient.get<IUser>(`${BASE_URL}/${id}`);
            dispatch(getUserSuccess(response.data));
        } catch (error) {
            dispatch(getUserError(resolveErrorMessage(error)));
        }
    };

    const getUsers = async (): Promise<void> => {
        dispatch(getUsersPending());
        try {
            const response = await apiClient.get<IUser[]>(BASE_URL);
            dispatch(getUsersSuccess(response.data));
        } catch (error) {
            dispatch(getUsersError(resolveErrorMessage(error)));
        }
    };

    const getUsersByRole = async (role: UserRole): Promise<void> => {
        dispatch(getUsersByRolePending(role));
        try {
            const response = await apiClient.get<IUser[]>(BASE_URL, { params: { role } });
            dispatch(getUsersByRoleSuccess(response.data));
        } catch (error) {
            dispatch(getUsersByRoleError(resolveErrorMessage(error)));
        }
    };

    const createUser = async (user: Omit<IUser, "id">): Promise<void> => {
        dispatch(createUserPending());
        try {
            const response = await apiClient.post<IUser>(BASE_URL, user);
            dispatch(createUserSuccess(response.data));
        } catch (error) {
            dispatch(createUserError(resolveErrorMessage(error)));
        }
    };

    const updateUser = async (id: number, user: Partial<Omit<IUser, "id">>): Promise<void> => {
        dispatch(updateUserPending());
        try {
            const response = await apiClient.put<IUser>(`${BASE_URL}/${id}`, user);
            dispatch(updateUserSuccess(response.data));
        } catch (error) {
            dispatch(updateUserError(resolveErrorMessage(error)));
        }
    };

    const deleteUser = async (id: number): Promise<void> => {
        dispatch(deleteUserPending());
        try {
            await apiClient.delete(`${BASE_URL}/${id}`);
            dispatch(deleteUserSuccess(id));
        } catch (error) {
            dispatch(deleteUserError(resolveErrorMessage(error)));
        }
    };

    const actionsValue = useMemo<IUserContextActions>(
        () => ({ getUser, getUsers, getUsersByRole, createUser, updateUser, deleteUser }),
        []
    );

    return (
        <UserStateContext.Provider value={state}>
            <UserActionsContext.Provider value={actionsValue}>
                {children}
            </UserActionsContext.Provider>
        </UserStateContext.Provider>
    );
};

// Hooks

/** Returns the current user state. Must be used inside <UserProvider>. */
export const useUserState = (): IUserContextState => {
    const context = useContext(UserStateContext);

    if (!context) {
        throw new Error("useUserState must be used within UserProvider.");
    }

    return context;
};

/** Returns user action methods. Must be used inside <UserProvider>. */
export const useUserActions = (): IUserContextActions => {
    const context = useContext(UserActionsContext);

    if (!context) {
        throw new Error("useUserActions must be used within UserProvider.");
    }

    return context;
};

function resolveErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const abpMessage: string | undefined = error.response?.data?.error?.message;
        if (abpMessage) {
            return abpMessage;
        }

        if (error.response?.status === 403) {
            return "You do not have permission to perform this action.";
        }

        if (error.response?.status === 404) {
            return "User not found.";
        }

        return "An unexpected error occurred. Please try again.";
    }

    return "An unexpected error occurred. Please try again.";
}
