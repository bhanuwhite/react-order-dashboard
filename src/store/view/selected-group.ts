import { getSelectedGroupIdFromPathname } from '@/utils/selected-group';
import { observable, action } from 'mobx';


export class SelectedGroupState {

    @observable
    private _groupId: string = getSelectedGroupIdFromPathname(window.location.hash.slice(1)) ?? '';

    /** Currently selected group id (global) */
    get groupId(): string {
        return this._groupId;
    }

    set groupId(newValue: string) {
        if (newValue !== this._groupId) {
            this._groupId = newValue;
            this.hasDevices = null;
        }
    }

    @observable
    /**
     * Whether or not this group has devices.
     * If null then we don't know yet whether it
     * has devices or not.
     */
    hasDevices: boolean | null = null;
}

export const createSelectedGroupState = action(() => new SelectedGroupState());