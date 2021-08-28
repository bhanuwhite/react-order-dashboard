import * as React from 'react';
import { FC } from 'react';
import { PageIntro, Tab, TabBar, TabPanel } from '@/components/core';
import { Container } from '@/components/core';
import { Toggles } from './Toggles';
import { DeviceWhitelisting } from './DeviceWhitelisting/DeviceWhitelisting';
import * as styles from './DebugOptions.module.scss';


// tslint:disable-next-line: variable-name
export const DebugOptions: FC<Props> = () => {
    const [tabIndex, setTabIndex] = React.useState(0);

    const onTabIndexChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    return <>
        <PageIntro title="Debug Options" icon="icon-107_Light_Off" />
        <TabBar className="mt-15" onChange={onTabIndexChange} value={tabIndex}>
            <Tab>Toggles</Tab>
            <Tab>Device Whitelisting</Tab>
        </TabBar>
        <Container solid className={styles.tabContainer}>
            <TabPanel value={tabIndex} index={0}>
                <Toggles />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <DeviceWhitelisting />
            </TabPanel>
        </Container>
    </>;
};

interface Props {}