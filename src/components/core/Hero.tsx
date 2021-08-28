import { SFC } from 'react';


// tslint:disable-next-line: variable-name
export const Hero: SFC<Props> = ({ primary, children }) => {
    const colorModifier = primary ? ' hero-primary' : '';

    return <div className={`hero${colorModifier}`}>
        <div className="hero-body">
            <div className="has-text-centered" style={{ fontSize: '4rem' }}>
                {children}
            </div>
        </div>
    </div>;
};
interface Props {
    primary?: boolean
}