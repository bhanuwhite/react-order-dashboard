import { observable } from 'mobx';

export type WhitelistingState = Map<string, boolean>;

export const createWhitelisting = () => observable.map<string, boolean>();