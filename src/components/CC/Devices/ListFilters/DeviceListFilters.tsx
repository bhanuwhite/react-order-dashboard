import { FC } from 'react';
import { EnumFilter, EnumFilterEntry } from './EnumFilter';
import * as styles from './MeshListFilters.module.scss';
import { HEALTH_FILTER } from './consts';


// tslint:disable-next-line: variable-name
export const DeviceListFilters: FC<Props> = ({}) => (
    <div className="mb-10">
        <div className={`bkg-white inline-block p-10 pr-5 font-size-14 ${styles.sectionTitle}`}>Filters</div>
        <EnumFilter className="inline-block pr-15" multiple title="Status" id={HEALTH_FILTER}>
            <EnumFilterEntry value="healthy">
                <span className="inline-block circle-10 bkg-healthy mr-5" /> Healthy
            </EnumFilterEntry>
            <EnumFilterEntry value="offline">
                <span className="inline-block circle-10 bkg-offline mr-5" /> Offline
            </EnumFilterEntry>
            <EnumFilterEntry value="need-reboot">
                <span className="inline-block circle-10 bkg-busy mr-5" /> Needs to be rebooted
            </EnumFilterEntry>
            <EnumFilterEntry value="installing">
                <span className="inline-block circle-10 bkg-busy mr-5" /> Installing
            </EnumFilterEntry>
            <EnumFilterEntry value="errors">
                <span className="inline-block circle-10 bkg-errors mr-5" /> Errors
            </EnumFilterEntry>
        </EnumFilter>
    </div>
);

interface Props {}
