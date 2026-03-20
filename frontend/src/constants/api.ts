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

/** Creates a new platform user. */
export const USERS_CREATE_ENDPOINT = "/api/services/app/User/Create";

/** Updates a user from the User AppService. */
export const USERS_UPDATE_ENDPOINT = "/api/services/app/User/Update";

/** Activates a platform user. */
export const USERS_ACTIVATE_ENDPOINT = "/api/services/app/User/Activate";

/** Deactivates a platform user. */
export const USERS_DEACTIVATE_ENDPOINT = "/api/services/app/User/DeActivate";

/** Returns available platform roles. */
export const USERS_GET_ROLES_ENDPOINT = "/api/services/app/User/GetRoles";

/** Returns app, tenant, and authenticated user login information. */
export const SESSION_LOGIN_INFO_ENDPOINT = "/api/services/app/Session/GetCurrentLoginInformations";

/** Returns the authenticated user's preferred platform language. */
export const USER_PROFILE_GET_MY_PLATFORM_LANGUAGE_ENDPOINT = "/api/services/app/UserProfile/GetMyPlatformLanguage";

/** Returns active platform languages for language selectors. */
export const USER_PROFILE_GET_ACTIVE_LANGUAGES_ENDPOINT = "/api/services/app/UserProfile/GetActiveLanguages";

/** Returns all supported platform languages from the Languages table. */
export const USER_PROFILE_GET_SUPPORTED_LANGUAGES_ENDPOINT = "/api/services/app/LanguageLookup/GetSupportedLanguages";

/** Updates the authenticated user's preferred platform language. */
export const USER_PROFILE_UPDATE_PLATFORM_LANGUAGE_ENDPOINT = "/api/services/app/UserProfile/UpdatePlatformLanguage";


export const REGISTER_ENDPOINT = "/api/services/app/Account/Register";

/** Returns all AI prompt templates. */
export const AI_PROMPT_TEMPLATES_GET_ALL_ENDPOINT = "/api/services/app/aIPromptTemplate/getAll";

/** Returns a single AI prompt template by id. */
export const AI_PROMPT_TEMPLATES_GET_ENDPOINT = "/api/services/app/aIPromptTemplate/get";

/** Creates a new AI prompt template. */
export const AI_PROMPT_TEMPLATES_CREATE_ENDPOINT = "/api/services/app/aIPromptTemplate/create";

/** Updates an existing AI prompt template. */
export const AI_PROMPT_TEMPLATES_UPDATE_ENDPOINT = "/api/services/app/aIPromptTemplate/update";

/** Deletes an AI prompt template by id. */
export const AI_PROMPT_TEMPLATES_DELETE_ENDPOINT = "/api/services/app/aIPromptTemplate/delete";

/** Returns all subjects (admin view, includes inactive). */
export const ADMIN_SUBJECTS_GET_ALL_ENDPOINT = "/api/services/app/adminSubject/getAll";

/** Creates a new subject. */
export const ADMIN_SUBJECTS_CREATE_ENDPOINT = "/api/services/app/adminSubject/create";

/** Updates an existing subject. */
export const ADMIN_SUBJECTS_UPDATE_ENDPOINT = "/api/services/app/adminSubject/update";

/** Deletes a subject by id. */
export const ADMIN_SUBJECTS_DELETE_ENDPOINT = "/api/services/app/adminSubject/delete";

/** Returns all platform languages. */
export const LANGUAGES_GET_ALL_ENDPOINT = "/api/services/app/language/getAll";

/** Creates a new platform language. */
export const LANGUAGES_CREATE_ENDPOINT = "/api/services/app/language/create";

/** Updates an existing platform language. */
export const LANGUAGES_UPDATE_ENDPOINT = "/api/services/app/language/update";

/** Deletes a platform language by id. */
export const LANGUAGES_DELETE_ENDPOINT = "/api/services/app/language/delete";

/** Returns all active subjects. */
export const SUBJECT_GET_ALL_ENDPOINT = "/api/services/app/StudentSubject/GetAllSubjects";

/** Returns subjects the logged-in student is enrolled in. */
export const SUBJECT_GET_MY_ENDPOINT = "/api/services/app/StudentSubject/GetMySubjects";

/** Bulk-enrols the logged-in student in one or more subjects. */
export const SUBJECT_BULK_ENROLL_ENDPOINT = "/api/services/app/StudentSubject/BulkEnroll";

/** Returns progress for a student in a given subject. */
export const SUBJECT_GET_PROGRESS_ENDPOINT = "/api/services/app/StudentSubject/GetSubjectProgress";

/** Returns all active topics for a given subject. */
export const TOPIC_GET_BY_SUBJECT_ENDPOINT = "/api/services/app/StudentSubject/GetTopicsBySubject";

/** Returns all published lessons for a given topic. */
export const LESSON_GET_BY_TOPIC_ENDPOINT = "/api/services/app/StudentSubject/GetLessonsByTopic";

/** Returns a single lesson with all translations. */
export const LESSON_GET_ENDPOINT = "/api/services/app/StudentSubject/GetLesson";

/** Uploads text content as a lesson, triggering translation into all active languages. */
export const UPLOAD_TEXT_MATERIAL_ENDPOINT = "/api/services/app/LearningMaterial/UploadTextMaterial";
/** Returns subjects the authenticated student is enrolled in. */
export const STUDENT_SUBJECT_GET_MY_SUBJECTS_ENDPOINT = "/api/services/app/StudentSubject/GetMySubjects";

/** Returns all active subjects available for student enrollment. */
export const STUDENT_SUBJECT_GET_ALL_SUBJECTS_ENDPOINT = "/api/services/app/StudentSubject/GetAllSubjects";

/** Enrolls the authenticated student in one or more subjects. */
export const STUDENT_SUBJECT_BULK_ENROLL_ENDPOINT = "/api/services/app/StudentSubject/BulkEnroll";

/** Returns lesson detail and translations for a published lesson. */
export const STUDENT_SUBJECT_GET_LESSON_ENDPOINT = "/api/services/app/StudentSubject/GetLesson";

/** Returns the adaptive learning path for a student within a subject. */
export const STUDENT_LEARNING_PATH_GET_SUBJECT_PATH_ENDPOINT = "/api/services/app/StudentLearningPath/GetSubjectPath";

/** Marks a lesson complete for the authenticated student. */
export const STUDENT_LEARNING_PATH_COMPLETE_LESSON_ENDPOINT = "/api/services/app/StudentLearningPath/CompleteLesson";

/** Returns a student-safe runtime assessment without answer keys. */
export const STUDENT_ASSESSMENT_GET_ENDPOINT = "/api/services/app/StudentAssessment/GetAssessment";

/** Submits a diagnostic assessment attempt for the authenticated student. */
export const STUDENT_ASSESSMENT_SUBMIT_DIAGNOSTIC_ENDPOINT = "/api/services/app/StudentAssessment/SubmitDiagnostic";

/** Submits a lesson quiz attempt for the authenticated student. */
export const STUDENT_ASSESSMENT_SUBMIT_LESSON_QUIZ_ENDPOINT = "/api/services/app/StudentAssessment/SubmitLessonQuiz";

/** Returns all generated quiz assessments for a given lesson. */
export const ASSESSMENT_GENERATION_GET_LESSON_ASSESSMENTS_ENDPOINT = "/api/services/app/AssessmentGeneration/GetLessonAssessments";

/** Returns student dashboard and progress aggregates. */
export const STUDENT_DASHBOARD_GET_MY_DASHBOARD_ENDPOINT = "/api/services/app/student-dashboard/get-my-dashboard";
export const STUDENT_DASHBOARD_GET_PROGRESS_ENDPOINT = "/api/services/app/StudentDashboard/GetProgress";
