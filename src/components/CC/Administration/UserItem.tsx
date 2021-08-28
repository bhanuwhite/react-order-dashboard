import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { useKeycloakAdminGetUserFetcher } from '@/hooks/fetchers';
import { Button } from '@/components/core';
import { UserState } from '@/store/domain/users';

interface UserItemProps {
    /** Veea user id of the user */
    userId: string | undefined
    /** Called when the user should be removed */
    onRemoveUser: (user: UserState) => void
    /** True if the remove button should be disabled */
    removeUserDisabled?: boolean
    /** Set this to true if you don't want this component to fetch the user for you */
    skipFetch?: boolean
}

// tslint:disable-next-line: variable-name
export const UserItem: FC<UserItemProps> = observer(({ userId, onRemoveUser, skipFetch, removeUserDisabled }) => {

    const store = useStore();
    const { loading } = useKeycloakAdminGetUserFetcher(userId, { isInvalid: skipFetch });
    const user = store.domain.users.mapByVeeaId.get(userId ?? '');

    if (!user && loading) {
        return <li className="pb-10 pt-10 border-b border-solid last:border-none border-lighter-grey">
            <div className="flex font-size-16 items-center">
                <div className="font-bold">Loading...</div>
                <div className="lg:mt-5" style={{ height: '38px' }}></div>
            </div>
        </li>;
    }

    const name = user?.name ?? 'User not found';
    const hasError = !user;

    return <li className="pb-10 pt-10 border-b border-solid last:border-none border-lighter-grey">
        <div className="flex font-size-16 items-center justify-between">
            <div>
                <div>
                    <span className="font-bold">{name}</span>
                </div>
                <div className="lg:mt-5 font-thin font-size-12 font-size-14-desktop-only text-d-grey">
                    {hasError && <span className="italic text-primary">
                        This user probably doesn't belong to the current realm
                    </span>}
                    {user?.props.email}
                </div>
            </div>
            <div>
                {/* <span className={`font-size-12 mr-10 ${styles.email}`}></span> */}
                <Button inversed disabled={removeUserDisabled} className="mt-0 mb-0" primary small
                    onClick={() => user && onRemoveUser(user)}
                >
                    Remove
                </Button>
            </div>
        </div>
    </li>;
});
