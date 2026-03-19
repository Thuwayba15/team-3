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
