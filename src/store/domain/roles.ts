import { observable, ObservableMap } from 'mobx';

export interface RoleState {
    id: string
    name: string
}

export interface RolesState {
    map: ObservableMap<string, RoleState>,
    all: RoleState[]
}

export const createRoles = () => observable({
    map: observable.map<string, RoleState>(),
    get all(): RoleState[] {
        const res = [...this.map.values()];

        return res;
    },
});
