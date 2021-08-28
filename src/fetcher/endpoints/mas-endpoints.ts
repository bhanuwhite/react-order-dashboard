import { TypeOf } from 'typesafe-schema';
import { FetcherInstance } from '../instance';
import {
    nodesSchema,
    nodeDocNodeStatus,
    nodeDocNodeInfo,
    nodeDocNodeMetrics,
    nodeDocCellularDataCount,
    nodeLoggingConfig,
    vmeshesSchema,
    nodeDocNodeSdwan,
    alertsSchema,
    deviceLogsSchema,
} from '@/schemas';
import { updateMapWithClass, updateOneEntryWithClass } from './helpers';
import { NodeState, NodeProps } from '@/store/domain/nodes';
import { VmeshState } from '@/store/domain/vmeshes';
import { Store } from '@/store';
import { Value } from '@/store/domain/_helpers';
import { action } from 'mobx';
import moment from 'moment';




export function handleMASEndpoints(instance: FetcherInstance, store: Store) {

    // Nodes
    instance.get('/mas/v2/nodes', async (res, _, query) => {
        const result = nodesSchema.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        // Is this query limiting the number of unit serials
        if (query.has('unit_serials')) {

            if (result.value.length === 0) {
                return `VeeaHub not found. Querying the MAS for unit serial ${query.get('unit_serials')} returned 0 results.`;
            } else if (result.value.length > 1) {
                return `Got ${result.value.length} result from the MAS when querying unit serial ${query.get('unit_serials')}, but expected only one`;
            }

            // We assume that there's only one unit serial
            updateOneEntryWithClass(store.domain.nodes.map, NodeState, newNode(result.value[0]));
        } else {
            updateMapWithClass(store.domain.nodes, NodeState, result.value, newNode);
        }

    });

    instance.get('/mas/v2/nodes/:masId', async (res) => {
        const result = nodesSchema.validate([res.body]);
        if (result.type === 'error') {
            return result;
        }

        const node = result.value[0];

        updateOneEntryWithClass(store.domain.nodes.map, NodeState, newNode(node));
    });

    instance.get('/mas/v2/nodes/:masId/doc/node_status', async (res, { masId }) => {
        const result = nodeDocNodeStatus.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const node = store.domain.nodes.all.find(n => n.props.masId === masId);
        if (!node) {
            // There should have been a useNodeFetch used before to populate
            // the node.
            return `Oops! Couldn't find VeeaHub with MAS id: ${masId}. This is a bug.`;
        }

        action(() => {
            node.nodeStatus = result.value;
        })();
    });

    instance.get('/mas/v2/nodes/:masId/doc/node_metrics', async (res, { masId }) => {
        const result = nodeDocNodeMetrics.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const node = store.domain.nodes.all.find(n => n.props.masId === masId);
        if (!node) {
            // There should have been a useNodeFetch used before to populate
            // the node.
            return `Oops! Couldn't find VeeaHub with MAS id: ${masId}. This is a bug.`;
        }

        action(() => {
            node.nodeMetrics = result.value;
        })();
    });

    instance.get('/mas/v2/nodes/:masId/doc/cellular_data_count', async (res, { masId }) => {
        const result = nodeDocCellularDataCount.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const node = store.domain.nodes.all.find(n => n.props.masId === masId);
        if (!node) {
            // There should have been a useNodeFetch used before to populate
            // the node.
            return `Oops! Couldn't find VeeaHub with MAS id: ${masId}. This is a bug.`;
        }

        action(() => {
            node.nodeCellularDataCount = result.value;
        })();
    });

    instance.get('/mas/v2/nodes/:masId/doc/node_info', async (res, { masId }) => {
        const result = nodeDocNodeInfo.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const node = store.domain.nodes.all.find(n => n.props.masId === masId);
        if (!node) {
            // There should have been a useNodeFetch used before to populate
            // the node.
            return `Oops! Couldn't find VeeaHub with MAS id: ${masId}. This is a bug.`;
        }

        action(() => {
            node.nodeInfo = result.value;
        })();
    });

    instance.get('/mas/v2/nodes/:masId/doc/node_sdwan', async (res, { masId }) => {
        const result = nodeDocNodeSdwan.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const node = store.domain.nodes.all.find(n => n.props.masId === masId);
        if (!node) {
            // There should have been a useNodeFetch used before to populate
            // the node.
            return `Oops! Couldn't find VeeaHub with MAS id: ${masId}. This is a bug.`;
        }

        action(() => {
            node.nodeSdwan = {
                inUse: result.value.selected_backhaul === 'Cellular',
                locked: result.value.backhauls.Cellular?.locked,
                lastUsage: result.value.backhauls.Cellular?.last_selected,
            };
        })();
    });

    instance.get('/mas/v2/nodes/:masId/doc/event_logging_config', async (res, { masId }) => {
        const result = nodeLoggingConfig.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        const node = store.domain.nodes.all.find(n => n.props.masId === masId);
        if (!node) {
            // There should have been a useNodeFetch used before to populate
            // the node.
            return `Oops! Couldn't find VeeaHub with MAS id: ${masId}. This is a bug.`;
        }

        action(() => {
            node.nodeLoggingConfig = result.value;
        })();
    });

    // Vmeshes
    instance.get('/mas/v2/vmeshes', async (res) => {
        const result = vmeshesSchema.validate(res.body);
        if (result.type === 'error') {
            return result;
        }

        updateMapWithClass(store.domain.vmeshes, VmeshState, result.value, (vmesh) => {

            const meshId = vmesh.ID;
            const unitSerial = vmesh.Managers[0].UnitSerial;

            // Discard values that don't have a unitSerial (they'll just break the UI)
            if (unitSerial === '') {
                return null;
            }

            return {
                id: unitSerial,
                meshId,
                groupId: `${vmesh.GroupId}`,
                name: vmesh.Name,
                ssid: vmesh.SSID,
                swarmid: vmesh.SwarmID,
                managers: vmesh.Managers.map(m => m.UnitSerial),
                workers: vmesh.Workers.map(w => w.UnitSerial),
                services: vmesh.Services.map(s => `${s.ID}`),
                masHealthy: vmesh.Managers[0].NodeState.Healthy,
                masOperational: !!vmesh.Managers[0].NodeState.Operational,
                createdAt: vmesh.CreatedAt,
                updatedAt: vmesh.UpdatedAt,
                lastSeenPost: vmesh.LastSeenPost,
                lastSeenPoll: vmesh.LastSeenPoll,
                restrictedBackhaul: vmesh.RestrictedBackhaulOperational,
                uuid: typeof vmesh.UUID === 'undefined' ? null : `${vmesh.UUID}`,
            };
        });
    });


    instance.get('/mas/v2/alerts', async (res) => {

        const result = alertsSchema.validate(res.body);

        if (result.type === 'error') {
            return result;
        }

        action(() => {
            store.domain.alerts.all = [];
            for (const nAlert of result.value) {

                // We ignore VH Down alert because they are already
                // covered by the overall health board.
                // Also there's a substancial delay between the alert being
                // triggered, and then being removed.
                // This create some confusion for the end user because
                // VeeaHubs can be shown as healthy but marked as having
                // a vhdown alert (which should means that they are not
                // connected).
                // However if that was the case then they would be marked as
                // offline.
                if (nAlert.labels.alertname === 'vhdown') {
                    continue;
                }

                store.domain.alerts.all.push({
                    alertname: nAlert.labels.alertname,
                    unit_serial: nAlert.labels.unit_serial,
                    group: nAlert.labels.group,
                    startsAt: nAlert.startsAt!,
                });
            }
        })();
    });

    // Fetch info about logs of a node between two dates
    instance.get('/mas/v1/vhlog/:deviceId', async (res, { deviceId }) => {
        const result = deviceLogsSchema.validate(res.body);

        if (result.type === 'error') {
            return result;
        }

        action(() => {
            const node = store.domain.nodes.map.get(deviceId);
            if (!node) {
                throw new Error(`Oops couldn't find node ${deviceId}, this is a bug.`);
            }

            node.logsRanges = result.value.map(({ Size, Name, LastModified}) => ({
                lastModified: moment.utc(LastModified),
                name: Name,
                size: Size,
            })).sort((a, b) => compareDate(a.lastModified, b.lastModified));
        })();
    });
}



function newNode(node: TypeOf<typeof nodesSchema.schema>[0]): NodeProps & Value {
    return {
        id: node.UnitSerial,
        name: node.Name,
        cpuSerial: node.Serial,
        vmeshId: node.VMeshId,
        masId: `${node.ID}`,
        address: node.Address,
        hostname: node.HostName,
        isManager: node.Manager,
        isOperational: node.NodeState.Operational ?? false,
        isHealthy: node.NodeState.Healthy,
        rebootRequired: node.NodeState.RebootRequired ?? false,
        isConnected: node.Connected,
        dockerId: node.DockerId,
        tasks: node.Tasks?.map(t => ({
            id: `${t.ID}`,
            serviceName: t.ServiceName,
            dockerId: t.DockerId,
            message: t.Message,
            state: t.State,
            desiredState: t.DesiredState,
            updatedAt: t.UpdatedAt,
            lastSeen: t.Timestamp,
            isPlatformImage: t.IsPlatformImage,
        })) ?? [],
    };
}

function compareDate(a: moment.Moment, b: moment.Moment) {
    if (a.isAfter(b)) {
        return 1;
    }
    if (a.isBefore(b)) {
        return -1;
    }
    return 0;
}

// TODO: Port this from the poller to the fetcher:

// pollApi(store.domain.groups, apis.groupsApi, (group) => {
//     return {
//         id: `${group.ID}`,
//         description: group.Description,
//         contact: group.Contact,
//         name: group.Name,
//         users: typeof group.Users === 'undefined' ? [] : group.Users.map(user => '' + user.ID),
//         sites: group.Sites.map(site => '' + site.ID),
//         vmeshes: group.VMeshes.map(vmesh => '' + vmesh.ID),
//         nodespecs: typeof group.NodeSpecs === 'undefined' ? [] : group.NodeSpecs.map(ns => '' + ns.ID),
//         createdAt: group.CreatedAt,
//         updatedAt: group.UpdatedAt,
//     };
// });

// pollApi(store.domain.images, apis.imagesApi, (image) => {
//     const id = `${image.imageRef}`;
//     return {
//         id,
//         name: id,
//     };
// });

// pollApi(store.domain.nodespecs, apis.nodespecSummaryApi, (nodespec) => {
//     return {
//         id: `${nodespec.NodeSpecId}`,
//         unitSerial: nodespec.UnitSerial,
//         groupId: typeof nodespec.GroupId === 'undefined' ? null : `${nodespec.GroupId}`,
//         groupName: typeof nodespec.GroupName === 'undefined' ? null : nodespec.GroupName,
//         createdAt: nodespec.CreatedAt,
//         updatedAt: typeof nodespec.UpdatedAt === 'undefined' ? null : `${nodespec.UpdatedAt}`,
//         nodeCxnTransition: typeof nodespec.NodeCxnTransition === 'undefined' ? null : nodespec.NodeCxnTransition,
//         nodeConnected: typeof nodespec.NodeConnected === 'undefined' ? ConnectedState.Unknown
//             : nodespec.NodeConnected
//                 ? ConnectedState.Connected
//                 : ConnectedState.Disconnected,
//         nodeName: typeof nodespec.NodeName === 'undefined' ? null : nodespec.NodeName,
//         nodeId: typeof nodespec.NodeId === 'undefined' ? null : `${nodespec.NodeId}`,
//         vmeshName: typeof nodespec.VMeshName === 'undefined' ? null : nodespec.VMeshName,
//         vmeshId: typeof nodespec.VMeshId === 'undefined' ? null : `${nodespec.VMeshId}`,
//         meshUuid: typeof nodespec.MeshUuid === 'undefined' ? null : `${nodespec.MeshUuid}`,
//         enrollmentUpdatedAt: typeof nodespec.EnrollmentUpdatedAt === 'undefined' ? null
//             : `${nodespec.EnrollmentUpdatedAt}`,
//     };
// });

// pollApiClass(store.domain.nodesSummary, apis.nodesSummaryApi, NodeSummaryState, (nodeSummary) => {
//     return {
//         id: `${nodeSummary.NodeId}`,
//         name: `${nodeSummary.NodeName}`,
//         vmeshId: `${nodeSummary.VMeshId}`,
//         vmeshName: nodeSummary.VMeshName,
//         vmeshSSID: nodeSummary.VMeshSSID,
//         restrictedBackhaulOperational: nodeSummary.RestrictedBackhaulOperational,
//         hostName: nodeSummary.HostName,
//         address: nodeSummary.Address,
//         dockerId: nodeSummary.DockerId,
//         dockerState: nodeSummary.DockerState,
//         port: nodeSummary.Port,
//         manager: nodeSummary.Manager,
//         serial: nodeSummary.Serial,
//         unitSerial: nodeSummary.UnitSerial,
//         duplicateSerial: nodeSummary.DuplicateSerial,
//         lastSeenOnWebsocket: nodeSummary.LastSeenOnWebsocket,
//         lastSeenInPost: nodeSummary.LastSeenInPost,
//         lastSeenInPoll: nodeSummary.LastSeenInPoll,
//         cxnTransitionTimestamp: nodeSummary.CxnTransitionTimestamp,
//         connected: nodeSummary.Connected,
//         healthy: nodeSummary.Healthy,
//         operational: !!nodeSummary.Operational,
//         error: nodeSummary.Error,
//         logging_enabled: nodeSummary.Logging.Enabled,
//     };
// });

// pollApi(store.domain.plans, apis.plansApi, (plan) => {
//     return {
//         id: `${plan.ID}`,
//         name: plan.Name,
//         level: plan.Level,
//         siteId: `${plan.SiteId}`,
//         imageId: plan.PlanImageId,
//         imageURL: plan.PlanImageURL,
//         nodes: plan.Nodes.map(n => ({
//             x: n.Coordinates.x,
//             y: n.Coordinates.y,
//             id: `${n.NodeId}`,
//             name: n.NodeName,
//             neighbours: n.Neighbours.map(nb => ({
//                 id: `${nb.ID}`,
//                 interfaces: nb.Interfaces.map(i => ({
//                     cost: i.Cost,
//                     nextHop: i.NextHop,
//                     type: i.InterfaceType,
//                 })),
//             })),
//         })),
//     };
// });

// pollApiClass(store.domain.sites, apis.sitesApi, SiteState, (site) => {
//     return {
//         id: `${site.ID}`,
//         name: site.Name,
//         groupId: `${site.GroupId}`,
//         createdAt: site.CreatedAt,
//         updatedAt: site.UpdatedAt,
//         plans: site.Plans.map(p => `${p.ID}`),
//         location: site.Location,
//     };
// });

// pollApi(store.domain.users, apis.usersApi, (user) => {
//     const roles = user.Roles || [];
//     return {
//         id: `${user.ID}`,
//         name: user.Username,
//         description: user.Description,
//         email: user.Email,
//         createdAt: user.CreatedAt,
//         lastLogin: user.LastLogin || '',
//         groups: (user.Groups && user.Groups.map(g => `${g.ID}`)) || [],
//         roles: roles.map(r => `${r.ID}`),
//         canEdit: roles.some(r => r.Name !== 'VeeaHub') || roles.length === 0,
//         locked: user.Locked,
//     };
// });

// pollApi(store.domain.roles, apis.rolesApi, (role) => {
//     return {
//         id: `${role.ID}`,
//         name: role.Name,
//         description: role.Description,
//         permissions: role.Permissions && role.Permissions.map(p => p.Name) || [],
//         users: role.Users && role.Users.map(u => `${u.ID}`) || [],
//     };
// });

// pollApi(store.domain.apps, apis.appsApi, (app) => {
//     return {
//         id: `${app.ID}`,
//         name: app.Name,
//         imagename: app.ImageName,
//         imagetag: app.ImageTag,
//         commands: app.Commands.map(c => c.Cmd),
//         args: app.Arguments.map(a => a.Arg),
//         ports: app.Ports,
//         volumes: app.Volumes,
//         envs: app.Envs,
//         devices: app.Devices,
//         privileged: app.Privileged,
//         networkmode: app.NetworkMode,
//         description: app.Description,
//         author: app.Author,
//         iconid: typeof app.IconId === 'undefined' ? null : app.IconId,
//         iconurl: typeof app.IconURL === 'undefined' ? null : app.IconURL,
//         isplatformimage: app.IsPlatformImage,
//         updatedAt: app.UpdatedAt,
//     };
// });

// pollApi(store.domain.alerts, apis.alertsApi, (alert) => {

//     return {
//         alertLabels: alert.Labels,
//         alertAnnotations: alert.Annotations,
//         startsAt: alert.StartsAt,
//         endsAt: alert.EndsAt,
//         generatorURL: alert.GeneratorURL,
//     };
// });

// pollApiForProps(store.domain.nodes.map, 'nodeConfig', nodeDocNodeConfig.validate,
//     ({ id }) => `/mas/v2/nodes/${id}/doc/node_config`,
//     (nodeConfig, node) => {
//         node.nodeConfig = {
//             node_type: nodeConfig.node_type,
//             vmesh_ssid: nodeConfig.vmesh_ssid,
//         };
//     });