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

/** Updates the authenticated user's preferred platform language. */
export const USER_PROFILE_UPDATE_PLATFORM_LANGUAGE_ENDPOINT = "/api/services/app/UserProfile/UpdatePlatformLanguage";


export const REGISTER_ENDPOINT = "/api/services/app/Account/Register";
