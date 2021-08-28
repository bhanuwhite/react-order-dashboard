
declare var ecUser: {
    isLoggedIn: boolean
    firstName?: string,
    lastName?: string,
    email?: string,
    authUserId?: number,
    keycloakUUID?: string,
    onboardingNeeded?: boolean
    onboardingReason?: string
    adminRights?: boolean
    roleBasedFeatures?: string[]
    roles?: string[]
    groups?: string[]
    featurePreview?: ('alertSummary' | 'listFilters')[]
    debugOptions?: ('disablePkgSerialChecking' | 'allowPkgSubscIfUpdatesAvailable' | 'allowJSONSchemaFormPreview' | 'showTrialVtpnSubscriptions')[]
} | undefined;

declare var PRIVAFY_BASE_URL: string | undefined;
declare var STRIPE_PUB_API_KEY: string;
declare var NODE_MANAGER_URL: string | undefined;
declare var REFRESH_SESSION_INTERVAL: number | undefined;
declare var VFF_VTPN_SKU: string | undefined;       // Those field are undefined is the server is not reachable
declare var VFF_VTPN_4G_SKU: string | undefined;    // Those field are undefined is the server is not reachable
declare var VTPN_SIGNUP_URL: string | undefined;
declare var GROUPS_LIMIT: number | undefined;