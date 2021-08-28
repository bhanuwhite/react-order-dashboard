import { ResponsivePie } from '@nivo/pie';
import { Chip } from '@nivo/tooltip';
import { FC } from 'react';
import * as styles from './index.module.scss';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and no chart will be rendered.
// tslint:disable-next-line: variable-name
export const PieChart: FC<Props> = ( {data} ) => {

    return <ResponsivePie
        data={data}
        isInteractive={true}
        // TODO: onClick() strategy?  How about render the "VeeaHubs and Meshes" page with the search
        // bar modified to search for the nodes matching the selected alert?

        tooltip={({ id, value, color }) => {
            if (id !== 'All good') {
                return <div className={styles.tooltip}>
                    <Chip key={id} color={color} />
                    &nbsp;&nbsp;{value} VeeaHub{value !== 1 ? 's' : ''} :<br></br>{id}
                </div>;
            }
            return <div className={styles.tooltip}>All good</div>;
        }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        // colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: 'color' }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#133333"
        radialLabel={d => `${d.label}`}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                translateY: 56,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#299',
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#541',
                        },
                    },
                ],
            },
        ]}
    />;
};

interface Props {
    data: any[]
}
