import { SFC } from 'react';


// tslint:disable-next-line: variable-name
export const Container: SFC<Props> = ({id, solid, className, children, dataQaComponent}) => {
    const backgroundModifier = solid ? ' container white-background' : '';
    className = className ?? '';
    return <div id={id} className={`wrapper${backgroundModifier} ${className}`} data-qa-component={dataQaComponent}>
        {children}
    </div>;
};
interface Props {
    id?: string
    solid?: boolean
    className?: string
    dataQaComponent?: string
}