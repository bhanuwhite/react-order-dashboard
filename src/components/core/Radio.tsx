import * as React from 'react';
import { FC } from 'react';
import { newIdGenerator } from '@/utils/uniqueId';


// tslint:disable-next-line: variable-name
export const Radio: FC<Props> = ({ name, value, selectedValue, onChange, disabled, children }) => {

    const [id] = React.useState(newId);
    const disabledModifier = disabled ? ' disabled' : '';
    const checkedModifier = selectedValue === value ? ' checked' : '';

    return <div className={`radiobox${disabledModifier}${checkedModifier}`}>
        <input type="radio"
            value={value}
            id={id}
            name={name}
            disabled={disabled}
            checked={selectedValue === value}
            onChange={(ev) => {
                onChange!(ev, value);
            }}/>
        <label htmlFor={id}>{children}</label>
    </div>;
};
interface Props {
    // Disable this radio
    disabled?: boolean
    // Set the value associated with this radio
    value: string
    // (internal do not use, will be ignored if specified)
    name?: string
    // (internal do not use, will be ignored if specified)
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void
    // (internal do not use, will be ignored if specified)
    selectedValue?: string
}


// tslint:disable-next-line: variable-name
export const RadioGroup: FC<GroupProps> = ({ value, onChange, name, children }) => {
    const childrenTransformed = React.Children.map(children, child => {
        if (!React.isValidElement(child)) {
            return null;
        }

        return React.cloneElement(child, {
            onChange,
            name,
            selectedValue: value,
        });
    });
    return <div className="radiobox-group" role="radiogroup">
        {childrenTransformed}
    </div>;
};
interface GroupProps {
    // The radio group's name
    name: string
    // current value
    value: string
    // Callback called whenever the onChange event is fired
    onChange: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void
}


// Created separate function to avoid creating new closures
// on every render.
const newId = newIdGenerator('radio');