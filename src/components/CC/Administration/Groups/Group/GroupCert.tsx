import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { useOwnerConfiguration } from '@/hooks/fetchers';
import { Spinner } from '@/components/core';
import { ErrorBox } from '@/components/core/Errors';
import { useStore } from '@/hooks/useStore';
import { downloadUTF8Text } from '@/utils/download';


// tslint:disable-next-line: variable-name
export const GroupCert: FC<Props> = observer(({ groupId }) => {

    const store = useStore();
    const { loading, error } = useOwnerConfiguration(groupId, { isInvalid: !groupId });
    const cert = store.domain.groups.map.get(groupId)?.cert;

    if (loading && !cert) {
        return <Spinner />;
    } else if (error) {
        return <ErrorBox>{error.message}</ErrorBox>;
    }

    return <div>
        <Section title="Certificate" fileName={`cert-${groupId}.pem`}>
            {cert?.certificate ?? 'Unknown'}
        </Section>
        <Section className="mt-25" title="Private Key" fileName={`key-${groupId}.pem`}>
            {cert?.privateKey ?? 'Unknown'}
        </Section>
    </div>;
});

interface Props {
    groupId: string
}


// tslint:disable-next-line: variable-name
const Section: FC<SectionProps> = ({ children, fileName, className, title, contentClassName }) => {

    function download() {
        downloadUTF8Text(children, fileName);
    }

    className = className ?? '';
    contentClassName = contentClassName ?? '';

    return <>
        <div className={`uppercase font-bold mb-20 font-size-12 mb-20 ${className}`} style={
            { letterSpacing: '2px', lineHeight: '15px', color: '#5a5a5a' }
        }>{title}</div>
        <div className={`relative p-15 bkg-grey-240 font-size-13 whitespace-pre w-max font-mono ${contentClassName}`}>
            <div title="Download as file" className="absolute top-10 right-10 cursor-pointer"
                onClick={download}
            >
                <i className="fas fa-download opacity-60 hover:opacity-100"/>
            </div>
            <div className="p-0">
                {children}
            </div>
        </div>
    </>;
};

interface SectionProps {
    title: string
    children: string
    fileName: string
    className?: string
    contentClassName?: string
}