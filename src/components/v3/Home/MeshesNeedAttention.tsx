import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { Section } from '../core';


// tslint:disable-next-line: variable-name
export const MeshesNeedAttention: FC<Props> = observer(({}) => {

    return <Section title="Meshes That Need Attention" className="mx-4 md:mx-0 mb-6"
        infoLink={{ kind: 'tooltip', text: 'TODO' }}
    >
        <div className="py-16 px-4 bg-gray-100 text-gray-500 text-sm text-center rounded-md">
            You do not have any meshes that require attention.
        </div>
    </Section>;
});

interface Props {}
