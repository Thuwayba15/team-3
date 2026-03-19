/** The ABP multi-tenancy HTTP header key used by the backend to resolve tenant by id. */
export const TENANT_HEADER = "Abp-TenantId";

/**
 * The default tenant identifier sent with every request while full multi-tenancy
 * selection is not yet implemented. Replace with dynamic resolution if necessary.
 */
export const DEFAULT_TENANT_ID = "1";

/** ABP token-auth endpoint path. */
export const TOKEN_AUTH_ENDPOINT = "/api/TokenAuth/Authenticate";

/** Clears the HttpOnly auth cookie on the backend. */
export const LOGOUT_ENDPOINT = "/api/TokenAuth/Logout";

/** Returns the authenticated user's id; used to rehydrate state on page load. */
export const ME_ENDPOINT = "/api/TokenAuth/Me";

/** Returns a paginated list of all platform users. */
export const USERS_GET_ALL_ENDPOINT = "/api/services/app/User/GetAll";

/** Returns a single user by id from the User AppService. */
export const USERS_GET_ENDPOINT = "/api/services/app/User/Get";

/** Updates a user from the User AppService. */
export const USERS_UPDATE_ENDPOINT = "/api/services/app/User/Update";

/** Returns app, tenant, and authenticated user login information. */
export const SESSION_LOGIN_INFO_ENDPOINT = "/api/services/app/Session/GetCurrentLoginInformations";

/** Returns the authenticated user's preferred platform language. */
export const USER_PROFILE_GET_MY_PLATFORM_LANGUAGE_ENDPOINT = "/api/services/app/UserProfile/GetMyPlatformLanguage";

/** Returns active platform languages for language selectors. */
export const USER_PROFILE_GET_ACTIVE_LANGUAGES_ENDPOINT = "/api/services/app/UserProfile/GetActiveLanguages";

/** Updates the authenticated user's preferred platform language. */
export const USER_PROFILE_UPDATE_PLATFORM_LANGUAGE_ENDPOINT = "/api/services/app/UserProfile/UpdatePlatformLanguage";

export const REGISTER_ENDPOINT = "/api/services/app/UserProfile/Register";

export const USERS_CREATE_ENDPOINT = "/api/services/app/User/Create";
export const USERS_ACTIVATE_ENDPOINT = "/api/services/app/User/Activate";
export const USERS_DEACTIVATE_ENDPOINT = "/api/services/app/User/DeActivate";

export const ADMIN_DASHBOARD_SUMMARY_ENDPOINT = "/api/services/app/AdminDashboard/GetSummary";
export const PROMPT_CONFIGURATION_GET_ENDPOINT = "/api/services/app/PromptConfiguration/Get";
export const PROMPT_CONFIGURATION_UPDATE_ENDPOINT = "/api/services/app/PromptConfiguration/Update";
export const CURRICULUM_GET_ENDPOINT = "/api/services/app/CurriculumAdmin/GetLifeSciencesCurriculum";
export const CURRICULUM_CREATE_TOPIC_ENDPOINT = "/api/services/app/CurriculumAdmin/CreateTopic";
export const CURRICULUM_UPDATE_TOPIC_ENDPOINT = "/api/services/app/CurriculumAdmin/UpdateTopic";
export const CURRICULUM_CREATE_LESSON_ENDPOINT = "/api/services/app/CurriculumAdmin/CreateLesson";
export const CURRICULUM_GET_LESSON_ENDPOINT = "/api/services/app/CurriculumAdmin/GetLesson";
export const CURRICULUM_UPDATE_LESSON_ENDPOINT = "/api/services/app/CurriculumAdmin/UpdateLesson";
export const CURRICULUM_UPSERT_TRANSLATION_ENDPOINT = "/api/services/app/CurriculumAdmin/UpsertLessonTranslation";

export const STUDENT_DASHBOARD_ENDPOINT = "/api/services/app/StudentLearning/GetDashboard";
export const STUDENT_TUTOR_CONFIGURATION_ENDPOINT = "/api/services/app/StudentLearning/GetTutorConfiguration";
export const STUDENT_LEARNING_PATH_ENDPOINT = "/api/services/app/StudentLearning/GetLearningPath";
export const STUDENT_PROGRESS_OVERVIEW_ENDPOINT = "/api/services/app/StudentLearning/GetProgressOverview";
export const STUDENT_DIAGNOSTIC_START_ENDPOINT = "/api/services/app/StudentLearning/StartDiagnostic";
export const STUDENT_DIAGNOSTIC_SUBMIT_ENDPOINT = "/api/services/app/StudentLearning/SubmitDiagnostic";
export const STUDENT_LESSON_ENDPOINT = "/api/services/app/StudentLearning/GetLesson";
