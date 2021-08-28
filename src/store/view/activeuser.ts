/// <reference type="./backend.d.ts">

import {
    PARTNER_ADMINISTRATION_FEATURE_NAME,
    DEVICE_LOGS_FEATURE_NAME,
} from '@/consts/features';
import { observable } from 'mobx';

export interface MasUser {
    GraylogSearchTmpl: string
}

export interface ActiveUserState {
    /**
     * First name of the logged in user
     */
    firstName: string
    /**
     * Last name of the logged in user
     */
    lastName: string
    /**
     * A combination of firstName and lastName
     */
    name: string
    /**
     * Email of the logged in user
     */
    email: string
    /**
     * Groups the user belongs to (as present in the user token so with the path instead of just the group id)
     */
    groupsInToken: string[]
    /**
     * Groups the user belongs to
     */
    groups: string[]
    /**
     * Checks the top level group count to determine if a sole top level group should be omitted.
     *
     * Examples:
     *
     * Groups on token: [ 'root' ];
     * Omitted groups: [ 'root' ];
     *
     * Groups on token: [ 'root/A' ];
     * Omitted groups: [ 'root', 'A' ];
     *
     * Groups on token: [ 'root/A/B' ];
     * Omitted groups: [ 'root', 'A', 'B' ];
     *
     * Groups on token: [ 'root/A', 'root/H' ];
     * Omitted groups: [ 'root' ];
     *
     * Groups on token: [ 'root/A/B', 'root/A/C' ];
     * Omitted groups: [ 'root', 'A' ];
     *
     * Groups on token: [ 'root/A/B', 'root/H/J' ];
     * Omitted groups: [ 'root' ];
     *
     * Groups on token: [ 'root/A', 'root/H/J' ];
     * Omitted groups: [ 'root' ];
     */
    omittedGroupIds: string[]
    /**
     * Default group id
     */
    defaultGroup: string
    /**
     * Auth user id of the logged in user the MAS
     */
    authUserId: string
    /**
     * Keycloak id of the logged in user
     */
    keycloakUUID: string | undefined
    /**
     * Partner ID of the logged in user
     */
    partnerId?: string
    /**
     * MAS user id of the logged in user
     */
    masUserId?: string
    /**
     * True if the user logged in once.
     */
    isLoggedIn: boolean
    /**
     * True if the server is online and responding.
     * If this flag is false, all the other properties
     * on this object should be ignored.
     */
    isServerOnline: boolean
    /**
     * True if the user needs to do the onboarding steps.
     */
    onboardingNeeded: boolean
    /**
     * List of specific Control Center features that are dependent on the user having a specific role.
     * DO NOT USE DIRECTLY
     *
     * FIXME: this should not be an array of string. It should be a map with known value. We know all of them
     *        at compile time...
     */
    roleBasedFeatures: string[]
    /**
     * List of roles present in the token
     */
    roles: string[]
    /**
     * Whether the user can see devices logs
     */
    hasDeviceLogsFeature: boolean
    /**
     * Whether the user can see the whitelist feature:
     * Check if a device is whitelisted and/or change
     * its whitelisting status.
     */
    hasWhitelistFeature: boolean
    /**
     * Returns true if the partner admin feature should be on
     */
    hasPartnerAdminFeature: boolean
    /**
     * Returns true if it as any admin feature on
     */
    hasAnyAdminFeature: boolean
    /**
     * Returns true if the user has the veea support role
     */
    hasVeeaSupportPermissions: boolean
    /**
     * True if the user needs to refresh the page.
     * Reason could be:
     *  - The session expired (because the backend restarted)
     *  - The version of the backend and frontend no longer matches.
     */
    inviteToRefreshPage: boolean
    /**
     * The error code associated with the invite to refresh the page
     * @see `@/consts/errorCodes.ts`
     */
    inviteToRefreshPageReason: number,
    /**
     * True if the email account for the user is '@veea.com'
     * Grants certain admin rights to the user if so, for example to perform an unenrollment
     */
    adminRights: boolean,
    /**
     * Information gathered from requesting /users/self to the MAS, required to get additional
     * information not available from keycloak or backend
     */
    masUser: MasUser
}

export interface Role {
    name: string
    permissions: string[]
    description: string
}

export const createActiveuser = () => observable<ActiveUserState>({
    firstName: window.ecUser?.firstName ?? '',
    lastName: window.ecUser?.lastName ?? '',
    get name(): string {
        if (this.firstName && this.lastName) {
            return `${this.firstName} ${this.lastName}`;
        }
        if (this.firstName) {
            return this.firstName;
        }
        if (this.lastName) {
            return this.lastName;
        }
        return this.email;
    },
    email: window.ecUser?.email ?? '',
    groupsInToken: window.ecUser?.groups ?? [],
    get groups(): string[] {
        return this.groupsInToken.map(group => group.slice(group.lastIndexOf('/') + 1));
    },
    get omittedGroupIds(): string[] {
        // FIXME: this code was moved from the old
        //        GroupMemberships code, I think
        //        we might want to return a set.
        const tokenGroups = this.groupsInToken;
        const result:string[] = [];
        if (tokenGroups.length === 1) {
            for (const groupId of tokenGroups[0].split('/')) {
                result.push(groupId);
            }
            return result;
        }
        const explodedIdPathsByIndex: string[][] = [];
        for (const idPath of tokenGroups) {
            const explodedIdPath = idPath.split('/');
            for (let i = 0; i < explodedIdPath.length; i++) {
                if (explodedIdPathsByIndex.length <= i) {
                    explodedIdPathsByIndex[i] = [];
                }
                explodedIdPathsByIndex[i].push(explodedIdPath[i]);
            }
        }
        for (const explodedIdPaths of explodedIdPathsByIndex) {
            const idPathSegmentSet = new Set(explodedIdPaths);
            if (explodedIdPathsByIndex.length === 1 || (explodedIdPaths.length > 1 && idPathSegmentSet.size === 1)) {
                const groupId = idPathSegmentSet.values().next().value as string;
                result.push(groupId);
            }
        }
        return result;
    },
    get defaultGroup(): string {
        return this.groups[0] ?? 'unknown';
    },
    adminRights: window.ecUser?.adminRights ?? false,
    authUserId: `${window.ecUser?.authUserId ?? ''}`,
    keycloakUUID: window.ecUser?.keycloakUUID,
    onboardingNeeded: window.ecUser?.onboardingNeeded ?? false,
    roleBasedFeatures: window.ecUser?.roleBasedFeatures ?? [],
    roles: window.ecUser?.roles ?? [],
    get hasDeviceLogsFeature(): boolean {
        return this.roleBasedFeatures.includes(DEVICE_LOGS_FEATURE_NAME);
    },
    get hasPartnerAdminFeature(): boolean {
        return this.roleBasedFeatures.includes(PARTNER_ADMINISTRATION_FEATURE_NAME);
    },
    get hasAnyAdminFeature() {
        return this.hasPartnerAdminFeature;
    },
    get hasVeeaSupportPermissions() {
        return this.roles.includes('veea_support');
    },
    get hasWhitelistFeature() {
        return this.adminRights;
    },
    // Simplify check in code
    isLoggedIn: window.ecUser?.isLoggedIn || false,
    isServerOnline: !!window.ecUser,
    inviteToRefreshPage: false,
    inviteToRefreshPageReason: 0,
    masUser: {
        GraylogSearchTmpl: '',
    },
});