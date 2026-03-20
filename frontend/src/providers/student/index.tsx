"use client";

/**
 * StudentDashboard Provider
 * Wraps components with context for accessing student dashboard data and actions.
 * Follows 4-file provider pattern (context, actions, reducer, index).
 */

import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
} from "react";
import {
    IStudentDashboardState,
    IStudentDashboardContextActions,
    INITIAL_STATE,
} from "./context";
import {
    setLoading,
    setData,
    setError,
    clearError,
    reset,
} from "./actions";
import { studentDashboardReducer } from "./reducer";
import { studentDashboardService } from "@/services/student/studentDashboardService";

// --- Contexts ---

const StudentDashboardStateContext = createContext<IStudentDashboardState | undefined>(
    undefined
);
const StudentDashboardActionsContext = createContext<IStudentDashboardContextActions | undefined>(
    undefined
);

// --- Provider ---

interface IStudentDashboardProviderProps {
    children: ReactNode;
}

export const StudentDashboardProvider = ({
    children,
}: IStudentDashboardProviderProps) => {
    const [state, dispatch] = useReducer(studentDashboardReducer, INITIAL_STATE);
    const fetchDashboard = async (): Promise<void> => {
        dispatch(setLoading(true));
        try {
            const data = await studentDashboardService.getMyDashboard();
            dispatch(setData(data));
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to load dashboard";
            dispatch(setError(message));
        }
    };

    /**
     * On mount, automatically fetch the student dashboard data.
     */
    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleClearError = (): void => {
        dispatch(clearError());
    };

    const handleReset = (): void => {
        dispatch(reset());
    };

    const actions: IStudentDashboardContextActions = {
        fetchDashboard,
        clearError: handleClearError,
        reset: handleReset,
    };

    return (
        <StudentDashboardStateContext.Provider value={state}>
            <StudentDashboardActionsContext.Provider value={actions}>
                {children}
            </StudentDashboardActionsContext.Provider>
        </StudentDashboardStateContext.Provider>
    );
};

// --- Hooks ---

/**
 * Use the StudentDashboard state (read-only).
 * Returns isLoading, data, and error.
 */
export const useStudentDashboardState = (): IStudentDashboardState => {
    const context = useContext(StudentDashboardStateContext);
    if (!context) {
        throw new Error(
            "useStudentDashboardState must be used within StudentDashboardProvider"
        );
    }
    return context;
};

/**
 * Use the StudentDashboard actions.
 * Returns fetchDashboard, clearError, and reset functions.
 */
export const useStudentDashboardActions = (): IStudentDashboardContextActions => {
    const context = useContext(StudentDashboardActionsContext);
    if (!context) {
        throw new Error(
            "useStudentDashboardActions must be used within StudentDashboardProvider"
        );
    }
    return context;
};

/**
 * Combined hook for using both state and actions.
 * Convenience hook for components that need both.
 */
export const useStudentDashboard = (): {
    state: IStudentDashboardState;
    actions: IStudentDashboardContextActions;
} => {
    const state = useStudentDashboardState();
    const actions = useStudentDashboardActions();
    return { state, actions };
};
