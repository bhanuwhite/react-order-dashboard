import { createNodes, NodesState } from './nodes';
import { createGroups, GroupsState } from './groups';
import { createUsers, UsersState } from './users';
import { createRoles, RolesState } from './roles';
import { createVmeshes, VmeshesState } from './vmeshes';
import { createAlerts, AlertsState } from './alerts';
import { createEnrollment, EnrollmentState } from './enrollment';
import { createAccount, DomainAccountState } from './account';
import { createWhitelisting, WhitelistingState } from './whitelisting';
import { createPartners, PartnersState } from './partners';
import { createOrders, OrdersState } from './vff/orders';
import { createInventory, InventoryState } from './vff/inventory';
import { createInvitations, InvitationsState } from './invitations';


export interface DomainStore {
    /**
     * VeeaHubs data coming from the MAS.
     */
    nodes: NodesState

    /**
     * Keycloak groups obtained from the Group service
     */
    groups: GroupsState

    /**
     * Keycloak roles obtained from the group service
     */
    roles: RolesState

    /**
     * Keycloak list of users (empty for non-admin users)
     */
    users: UsersState

    /**
     * VeeaHub Meshes data coming from the MAS
     */
    vmeshes: VmeshesState

    /**
     * Information about Partner(s) obtained from AC
     */
    partners: PartnersState

    /**
     * Not in use at the moment (if populated data would be coming from the MAS)
     */
    alerts: AlertsState

    /**
     * Enrollment related state. This is where the
     * information from the enrollment server goes.
     */
    enrollment: EnrollmentState

    /**
     * Orders (vff)
     */
    orders: OrdersState

    /**
     * Inventory (vff)
     */
    inventory: InventoryState

    /**
     * Pending invitations
     */
    invitations: InvitationsState

    /**
     * Account related state. Such as payment information.
     */
    account: DomainAccountState

    /**
     * This is a map of unit serial to a boolean.
     * If an entry is present the value says whether or not
     * the unit serial is whitelisted.
     */
    whitelisting: WhitelistingState
}


export function createDomain(): DomainStore {

    const nodes = createNodes();
    const groups = createGroups();
    const roles = createRoles();
    const users = createUsers();
    const vmeshes = createVmeshes();
    const alerts = createAlerts();
    const enrollment = createEnrollment();
    const account = createAccount();
    const whitelisting = createWhitelisting();
    const partners = createPartners();
    const orders = createOrders();
    const inventory = createInventory();
    const invitations = createInvitations();

    return {
        nodes,
        groups,
        roles,
        users,
        invitations,
        vmeshes,
        alerts,
        enrollment,
        account,
        whitelisting,
        partners,
        orders,
        inventory,
    };
}
