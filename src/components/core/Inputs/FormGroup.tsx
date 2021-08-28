import * as React from 'react';
import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const FormGroup: FC<Props> = ({ children, label, description, className }) => {
    const classes = ['form-group'];
    if (className) {
        classes.push(className);
    }
    return <div className={classes.join(' ')}>
        <h3 className="form-group--label">{label}</h3>
        {children}
        <div className="form-group--description">{description}</div>
    </div>;
};

interface Props {
    label?: React.ReactNode
    description?: React.ReactNode
    className?: string
}