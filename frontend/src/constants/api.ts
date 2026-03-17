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
export const LOGOUT_ENDPOINT = "//ToapikenAuth/Logout";

/** Returns the authenticated user's id; used to rehydrate state on page load. */
export const ME_ENDPOINT = "/api/TokenAuth/Me";

/** Returns a paginated list of all platform users. */
export const USERS_GET_ALL_ENDPOINT = "/api/services/app/User/GetAll";


export const REGISTER_ENDPOINT = "/api/services/app/Account/Register";
