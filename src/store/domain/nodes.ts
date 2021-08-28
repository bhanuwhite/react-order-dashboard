// tslint:disable: max-classes-per-file
import { observable, computed, ObservableMap } from 'mobx';
import * as moment from 'moment';
import { HasFetcherProps, Value } from './_helpers';


export interface NodeStatus {
    beacon_operational: boolean
    backhaul_operational: boolean
    network_time_operational: boolean
    internet_access_operational: boolean
    gateway_cellular_operational: boolean
    gateway_ethernet_operational: boolean
    gateway_wifi_operational: boolean
    vmesh_operational: boolean
    retail_analytics_operational?: boolean
    media_analytics_operational?: boolean
    reboot_required: boolean
    node_operational: boolean
    border_gateway_url: string
}

export interface BlacklistedSubsystem {
    category: string
    subcategory: string
}

export interface NodeLoggingConfig {
    level: string
    available_levels: string[]
    available_categories: string[]
    blacklisted_subsystems: BlacklistedSubsystem[]
    available_subcategories: string[]
}

export interface NodeMetrics {
    iccid: string
    network_operator: string
    network_mode: string
    signal_level: number
    connection_status: string
}

export interface NodeSDWAN {
    inUse: boolean | undefined
    locked: boolean | undefined
    lastUsage: number | undefined
}

export interface NodeCellularDataCount {
    bytes_recv: number
    bytes_sent: number
    bytes_recv_current_day: number
    bytes_sent_current_day: number
    bytes_recv_previous_day: number
    bytes_sent_previous_day: number
    bytes_recv_current_month: number
    bytes_sent_current_month: number
    bytes_recv_previous_month: number
    bytes_sent_previous_month: number
}

export interface NodeInfo {
    product_model: string;
    unit_hardware_revision: string;
    unit_hardware_version: string;

    sw_version: string;
    os_version: string;

    node_mac: string;
}

export interface NodeConfig {
    node_type: 'MEN' | 'MN'
    vmesh_ssid: string
}

export interface NodeProps {
    name: string
    vmeshId: number
    masId: string
    cpuSerial: string
    address: string
    hostname: string
    isManager: boolean
    isConnected: boolean
    isHealthy: boolean
    isOperational: boolean
    rebootRequired: boolean
    dockerId: string
    tasks: Task[]
}

export interface NodeLogsRange {
    /** last modified date of the file */
    lastModified: moment.Moment
    /** Name of the file to view */
    name: string
    /** Size in bytes of the file */
    size: number
}

export class NodeState implements HasFetcherProps<NodeProps> {
    /** Unit serial of the node. */
    readonly id: string;

    @observable
    props: NodeProps;

    @observable
    nodeStatus: NodeStatus | null = null;

    @observable
    nodeLoggingConfig: NodeLoggingConfig | null = null;

    @observable
    nodeInfo: NodeInfo | null = null;

    @observable
    nodeConfig: NodeConfig | null = null;

    @observable
    nodeMetrics: NodeMetrics | null = null;

    @observable
    nodeCellularDataCount: NodeCellularDataCount | null = null;

    @observable
    nodeSdwan: NodeSDWAN | null = null;

    @observable
    logsRanges: NodeLogsRange[] = [];

    @computed
    get is4GCapable(): boolean {
        const lteBackhaul = this.id.substr(6, 1);
        return lteBackhaul !== '0';
    }

    get isConnected(): boolean {
        return this.props.isConnected;
    }

    constructor(
        { id, ...props }: Value & NodeProps,
    ) {
        this.id = id;
        this.props = props;
    }
}

export interface Task {
    id: string
    serviceName: string
    dockerId: string
    message: string
    state: string
    desiredState: string
    updatedAt: string
    lastSeen: string
    isPlatformImage: boolean
}

export interface NodesState {
    map: ObservableMap<string, NodeState>
    all: NodeState[]
}

export const createNodes = () => observable<NodesState>({
    map: observable.map<string, NodeState>({}, { deep: false }),
    get all(): NodeState[] {
        return [...this.map.values()];
    },
});