import { SubjectAction, SubjectActionType } from "./actions";
import { ISubjectState } from "./context";

export const subjectReducer = (state: ISubjectState, action: SubjectAction): ISubjectState => {
    switch (action.type) {
        // All subjects
        case SubjectActionType.GetSubjectsPending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case SubjectActionType.GetSubjectsSuccess:
            return { ...state, isLoading: false, isSuccess: true, isError: false, subjects: action.payload };

        case SubjectActionType.GetSubjectsError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        // My subjects (enrolled)
        case SubjectActionType.GetMySubjectsPending:
            return { ...state, isLoading: true, isSuccess: false, isError: false, errorMessage: null };

        case SubjectActionType.GetMySubjectsSuccess:
            return { ...state, isLoading: false, isSuccess: true, isError: false, mySubjects: action.payload };

        case SubjectActionType.GetMySubjectsError:
            return { ...state, isLoading: false, isSuccess: false, isError: true, errorMessage: action.payload };

        // Topics by subject
        case SubjectActionType.GetTopicsBySubjectPending:
            return { ...state, isTopicsLoading: true, isError: false, errorMessage: null, topics: undefined };

        case SubjectActionType.GetTopicsBySubjectSuccess:
            return { ...state, isTopicsLoading: false, topics: action.payload };

        case SubjectActionType.GetTopicsBySubjectError:
            return { ...state, isTopicsLoading: false, isError: true, errorMessage: action.payload };

        // Lessons by topic
        case SubjectActionType.GetLessonsByTopicPending:
            return { ...state, isTopicsLoading: true, isError: false, errorMessage: null, lessons: undefined };

        case SubjectActionType.GetLessonsByTopicSuccess:
            return { ...state, isTopicsLoading: false, lessons: action.payload };

        case SubjectActionType.GetLessonsByTopicError:
            return { ...state, isTopicsLoading: false, isError: true, errorMessage: action.payload };

        // Create lesson
        case SubjectActionType.CreateLessonPending:
            return { ...state, isCreatingLesson: true, isError: false, errorMessage: null, createdLesson: undefined };

        case SubjectActionType.CreateLessonSuccess:
            return { ...state, isCreatingLesson: false, isSuccess: true, createdLesson: action.payload };

        case SubjectActionType.CreateLessonError:
            return { ...state, isCreatingLesson: false, isError: true, errorMessage: action.payload };

        default:
            return state;
    }
};
