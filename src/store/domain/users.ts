import { computed, observable } from 'mobx';
import { Page } from '@/store/pages';
import { HasFetcherProps, Value } from './_helpers';


export interface UserProps {
    /** . */
    username: string
    /** . */
    firstName: string
    /** . */
    lastName: string
    /** . */
    enabled?: boolean
    /** . */
    email: string
    /** . */
    emailVerified?: boolean
    /** . */
    phoneNumber?: string
    /** . */
    allowReceiveSms?: boolean
    /** . */
    countryCode?: string
    /** . */
    company?: string
    /** . */
    role?: UserRole
    /** stats about this user */
    counts?: {
        groups: number,
    }
    /** Veea user id, might not be present */
    veeaUserId?: string
}

interface UserRole {
    id: string
    name: string
}

export class UserState implements HasFetcherProps<UserProps> {

    readonly id: string;

    @observable
    props: UserProps;

    /**
     * Returns "{firstName} {lastName}" if {firstName} exists
     * else returns {username}
     */
    @computed
    get name(): string {
        if (this.props.firstName !== '') {
            if (this.props.lastName !== '') {
                return `${this.props.firstName} ${this.props.lastName}`;
            }
            return this.props.firstName;
        }
        return this.props.username;
    }

    constructor(
        { id, ...props }: Value & UserProps,
    ) {
        this.id = id;
        this.props = props;
    }
}

export class UsersState {

    /**
     * Contains cached values for all users fetched.
     */
    readonly map = observable.map<string, UserState>();

    /**
     * Map from a veea user id to a user id.
     */
    readonly mapByVeeaId = observable.map<string, UserState>();

    /**
     * Returns the users associated with provided page.
     * @param page page object
     */
    getUsersForPage(page: Page<UserState> | undefined): UserState[] {
        return page?.values(this.map) || [];
    }

    setUser(id: string, props: UserProps): UserState {
        let user = this.map.get(id);
        if (user) {
            // tslint:disable-next-line: forin
            for (const prop in props) {
                // FIXME when https://bitbucket.org/veea/ecv2/pull-requests/288
                //       is merged
                (user.props as any)[prop] = props[prop as keyof UserProps];
            }

            if (user.props.veeaUserId) {
                this.mapByVeeaId.set(user.props.veeaUserId, user);
            }

            return user;
        }
        user = new UserState({ id, ...props });
        this.map.set(id, user);
        if (user.props.veeaUserId) {
            this.mapByVeeaId.set(user.props.veeaUserId, user);
        }
        return user;
    }
}

export const createUsers = () => new UsersState();
