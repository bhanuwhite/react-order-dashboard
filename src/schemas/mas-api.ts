import { newValidator, Enum, Nullable, Obj, Optional, IGNORE } from 'typesafe-schema';
import { Arr, NUMBER, BOOL, STRING } from 'typesafe-schema';


// Schema for /nodes?depth=3
export const nodesSchema = newValidator(Arr(Obj({
    ID: NUMBER,
    VMeshId: NUMBER,
    Address: STRING,
    Name: STRING,
    Port: NUMBER,
    HostName: STRING,
    UnitSerial: STRING,
    Serial: STRING,
    DockerId: STRING,
    Connected: BOOL,
    Manager: BOOL,
    NodeState: Obj({
        Healthy: BOOL,
        Operational: Nullable(BOOL),
        RebootRequired: Optional(BOOL),
    }),
    Tasks: Nullable(Arr(Obj({
        ID: NUMBER,
        ServiceName: STRING,
        ServiceId: NUMBER,
        NodeId: NUMBER,
        DockerId: STRING,
        UpdatedAt: STRING,
        Timestamp: STRING,
        DesiredState: STRING,
        State: STRING,
        Message: STRING,
        NodeName: STRING,
        NodeConnected: BOOL,
        IsPlatformImage: BOOL,
    }))),
})));

// Schema for /alerts (no depth param)
export const alertsSchema = newValidator(Arr(Obj({
    labels: Obj({
        alertname: STRING,
        group: STRING,
        unit_serial: STRING,
    }),
    // optional since not yet available in MAS backend
    startsAt: Optional(STRING),
})));

// Schema for MAS standard JSON response in PATCH / DELETE / POST
export const masStdResponseSchema = newValidator(Obj({
    message: STRING,
    success: BOOL,
    data: Optional(Nullable(IGNORE)),
}));

// Schema for /users/self?depth=2
export const userSelfSchema = newValidator(Obj({
    ID: NUMBER,
    Username: STRING,
    Description: STRING,
    Email: STRING,
    Locked: BOOL,
    RequirePasswordReset: BOOL,
    LastLogin: Nullable(STRING),
    Roles: Arr(Obj({
        ID: NUMBER,
        Name: STRING,
        Description: STRING,
    })),
    GraylogSearchTmpl: STRING,
}));

// Schema for /vmeshes?depth=2
export const vmeshesSchema = newValidator(Arr(Obj({
    ID: NUMBER,
    Name: STRING,
    SwarmID: STRING,
    SSID: STRING,
    CreatedAt: STRING,
    UpdatedAt: STRING,
    LastSeenPost: STRING,
    LastSeenPoll: STRING,
    GroupId: NUMBER,
    RestrictedBackhaulOperational: BOOL,
    Managers: Arr(Obj({
        UnitSerial: STRING,
        NodeState: Obj({
            Healthy: BOOL,
            Operational: Nullable(BOOL),
        }),
    })),
    Services: Arr(Obj({
        ID: NUMBER,
    })),
    Workers: Arr(Obj({
        UnitSerial: STRING,
    })),
    UUID: Optional(STRING),
})));

// Schema for /nodes/${id}/doc/node_metrics
export const nodeDocNodeMetrics = newValidator(Obj({
    iccid: STRING,
    network_operator: STRING,
    network_mode: STRING,
    signal_level: NUMBER,
    connection_status: STRING,
}));

// Schema for /nodes/${id}/doc/cellular_data_count
export const nodeDocCellularDataCount = newValidator(Obj({
    bytes_recv: NUMBER,
    bytes_sent: NUMBER,
    bytes_recv_current_day: NUMBER,
    bytes_sent_current_day: NUMBER,
    bytes_recv_previous_day: NUMBER,
    bytes_sent_previous_day: NUMBER,
    bytes_recv_current_month: NUMBER,
    bytes_sent_current_month: NUMBER,
    bytes_recv_previous_month: NUMBER,
    bytes_sent_previous_month: NUMBER,
}));

// Schema for /nodes/${id}/doc/node_sdwan
export const nodeDocNodeSdwan = newValidator(Obj({
    selected_backhaul: STRING,
    backhauls: Obj({
        Cellular: Optional(Obj({
            locked: Optional(BOOL),
            last_selected: Optional(NUMBER),
        })),
    }),
}));

// Schema for /nodes/${id}/doc/node_status
export const nodeDocNodeStatus = newValidator(Obj({
    beacon_operational: BOOL,
    backhaul_operational: BOOL,
    network_time_operational: BOOL,
    internet_access_operational: BOOL,
    gateway_cellular_operational: BOOL,
    gateway_ethernet_operational: BOOL,
    gateway_wifi_operational: BOOL,
    vmesh_operational: BOOL,
    // TODO: this field has been deprecated
    retail_analytics_operational: Optional(BOOL),
    // TODO: this field has been deprecated
    media_analytics_operational: Optional(BOOL),
    // TODO: if this is true then we should show action needed: reboot device
    reboot_required: BOOL,
    node_operational: BOOL,
    border_gateway_url: STRING,
}));

// Schema for /nodes/${id}/doc/event_logging_config
export const nodeLoggingConfig = newValidator(Obj({
    level: STRING,
    available_levels: Arr(STRING),
    available_categories: Arr(STRING),
    blacklisted_subsystems: Arr(Obj({
        category: STRING,
        subcategory: STRING,
    })),
    available_subcategories: Arr(STRING),
}));

// Schema for /nodes/${id}/doc/node_info
export const nodeDocNodeInfo = newValidator(Obj({
    product_model: STRING,
    unit_hardware_revision: STRING,
    unit_hardware_version: STRING,
    sw_version: STRING,
    os_version: STRING,
    node_mac: STRING,
}));

// Schema for /nodes/${id}/doc/node_config
export const nodeDocNodeConfig = newValidator(Obj({
    node_type: Enum('MEN', 'MN'),
    vmesh_ssid: STRING,
}));

// Schema for GET /mas/v2/streams in the MAS
export const getStreamsSchema = newValidator(Arr(Obj({
    unit_serial: STRING,
    stream: STRING,
})));

// Schema for POST /mas/views/search in the MAS
export const createSearchSchema = newValidator(Obj({
    id: STRING,
}));

// Schema for POST /mas/views/search/{id}/execute in the MAS
export const executeSearchSchema = newValidator(Obj({
    results: Obj({}),
}));

// Schema for GET /mas/v1/vhlog/{id}
export const deviceLogsSchema = newValidator(Arr(Obj({
    Size: NUMBER,
    Name: STRING,
    LastModified: STRING,
})));