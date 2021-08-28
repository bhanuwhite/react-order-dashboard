/**
 * vTPN Orders information
 */
import { observable } from 'mobx';


export interface DeviceInventoryState {
    /** SKU of the promotional product */
    id: string
    /** quantity remaining */
    qty: number
    /** error fetching quantity remaining */
    error: string | null
}

export class InventoryState {
    readonly map = observable.map<string, DeviceInventoryState>();
}

export const createInventory = () => new InventoryState();