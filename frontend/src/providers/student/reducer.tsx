/**
 * StudentDashboard Reducer
 * Handles state transitions for dashboard data loading and error management.
 */

import {
    StudentDashboardActionType,
    StudentDashboardAction,
} from "./actions";
import {
    IStudentDashboardState,
    INITIAL_STATE,
} from "./context";

export const studentDashboardReducer = (
    state: IStudentDashboardState = INITIAL_STATE,
    action: StudentDashboardAction
): IStudentDashboardState => {
    switch (action.type) {
        case StudentDashboardActionType.SetLoading:
            return {
                ...state,
                isLoading: action.payload,
                error: action.payload ? null : state.error, // Clear error when loading
            };

        case StudentDashboardActionType.SetData:
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                error: null,
            };

        case StudentDashboardActionType.SetError:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };

        case StudentDashboardActionType.ClearError:
            return {
                ...state,
                error: null,
            };

        case StudentDashboardActionType.Reset:
            return INITIAL_STATE;

        default:
            return state;
    }
};
