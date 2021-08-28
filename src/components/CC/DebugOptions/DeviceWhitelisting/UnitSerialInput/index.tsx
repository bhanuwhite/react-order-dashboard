import React, { FC } from 'react';
import { TextField } from '@/components/core/Inputs';
import { Button } from '@/components/core';
import * as style from '../DeviceWhitelisting.module.scss';
import { isUnitSerialFormatValid } from '../helper';
interface InputProps {
    unitSerialValue: string
    inputLabel: string
    buttonText: string
    buttonIcon: string
    onButtonClick: () => void
    onInputChange: (value: string) => void
    classGrayBar: string
}

// tslint:disable-next-line: variable-name
export const UnitSerialInput: FC<InputProps> = ({
    inputLabel,
    unitSerialValue,
    buttonText,
    buttonIcon,
    onButtonClick,
    onInputChange,
    classGrayBar,
}) => {
    const [error, setError] = React.useState<boolean>(false);

    const onUnitSerialChange = (value: string) => {
        onInputChange(value);
        setError(false);
    };

    const onSearchClick = () => {
        if (unitSerialValue) {
            const validValue = isUnitSerialFormatValid(unitSerialValue);
            if (validValue) {
                setError(false);
                onButtonClick();
            } else {
                setError(true);
            }
        } else {
            setError(true);
        }
    };

    return <div className={style.unitSerialInput}>
        <b className={`${style.icon} ${classGrayBar}`}>&nbsp;</b>
        <p className={`${style.label}`}>{inputLabel}</p>
        <div className={style.inputs}>
            <div className={`input ${style.input}`}>
                <TextField required className={style.field} value={unitSerialValue} onChange={onUnitSerialChange}
                    label={<><span className={style.fieldEmph}>Full unit serial, ex: E09BCBA0C0B000000688</span></>}
                />
                <div className={style.unitSerialError}>{error ? 'Please enter a valid Unit Serial' : ''}</div>
            </div>
            <div>
                <Button large primary className={style.wlButton} onClick={onSearchClick}>
                    <i className={buttonIcon} /> {buttonText}
                </Button>
            </div>
        </div>
    </div>;
};

