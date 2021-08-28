import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Section } from '../../core';
import { mergeFetchers } from '@/fetcher';
import { useIsWhitelistedFetcher, useNodeInfoFetcher } from '@/hooks/fetchers';
import { NodeState } from '@/store/domain/nodes';


// tslint:disable-next-line: variable-name
export const AdditionalInformation: FC<Props> = observer(({ node, deviceId }) => {

    /* const { error } = */
    mergeFetchers(
        useNodeInfoFetcher(node?.props.masId),
        useIsWhitelistedFetcher(deviceId),
    );

    return <Section title="Additional Information" className="mb-6 text-sm"
        infoLink={{ kind: 'tooltip', text: 'TODO' }}
    >
        <Row name="Hardware">
            {node?.nodeInfo ?
                `VeeaHub ${node?.nodeInfo?.unit_hardware_version} Rev ${node?.nodeInfo?.unit_hardware_revision}` :
                'Unknown'
            }
        </Row>
        <Row name="Software Version">
            {node?.nodeInfo?.sw_version ?? 'Unknown'}
        </Row>
        <Row name="OS Version">
            {node?.nodeInfo?.os_version ?? 'Unknown'}
        </Row>
        <Row name="Serial Number">
            {deviceId}
        </Row>
        <Row name="CPU Serial">
            {node?.props.cpuSerial ?? 'Unknown'}
        </Row>
        <Row name="Docker Serial">
            {node?.props.dockerId ?? 'Unknown'}
        </Row>
        <Row name="Connectivity Options">
            Ethernet{node?.is4GCapable && ', Cellular'}
        </Row>
        <Row name="MAS ID">
            {node?.props.masId}
        </Row>
        <Row name="IP Address">
            {node?.props.address || 'Not Available'}
        </Row>
        <Row name="MAC Address" last>
            {node?.nodeInfo?.node_mac.toUpperCase() ?? 'Unknown'}
        </Row>
    </Section>;
});

interface Props {
    deviceId: string
    node?: NodeState
}

// tslint:disable-next-line: variable-name
const Row: FC<{ name: React.ReactNode, last?: boolean }> = ({ name, last, children }) => (
    <div className={`flex justify-between ${last ? '' : 'pb-3 mb-3 border-b dark:border-gray-700 border-gray-300'}`}>
        <div className="dark:text-gray-400 text-gray-500">{name}</div>
        <div className="font-bold dark:text-white text-black">{children}</div>
    </div>
);