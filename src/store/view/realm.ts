import { observable } from 'mobx';

export interface RealmDetailsState {
    /*
     * Minimum password length required for the new user sign up form
     */
    minPasswordLength: number
}

export const createRealmDetails = () => observable<RealmDetailsState>({
    minPasswordLength: 0,
});