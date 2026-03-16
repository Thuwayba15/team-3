export type UserRole = "Teacher" | "Student" | "Parent" | "Admin";

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    role: UserRole;
}

export interface IUserState {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    errorMessage: string | null;
    user?: IUser;
    users?: IUser[];
}

export type IUserContextState = IUserState;

export interface IUserContextActions {
    getUser: (id: number) => Promise<void>;
    getUsers: () => Promise<void>;
    getUsersByRole: (role: UserRole) => Promise<void>;
    createUser: (user: Omit<IUser, "id">) => Promise<void>;
    updateUser: (id: number, user: Partial<Omit<IUser, "id">>) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
}

export const INITIAL_STATE: IUserState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: null,
};
