import { Button, Separator } from '@/components/core';
import React, { FC } from 'react';
import * as style from './DeviceWhitelisting.module.scss';
import { DeviceFoundModal } from './DeviceFoundModal';
import { AddMultipleUnitSerialModal } from './AddMultipleUnitSerialModal';
import { UnitSerialInput } from './UnitSerialInput';
import UnitSerialModalAction from './UnitSerialActionModal';
import { addToWhitelistUnits, removeFromWhitelistUnits } from '@/actions';
import { allMultipleUnitSerialValid } from './helper';


// tslint:disable-next-line: variable-name
export const DeviceWhitelisting: FC<{}> = () => {
    return <>
        <Separator sticky />
        <div className={style.deviceWhitelisting}>
            <SearchDeviceInput />
            <RemoveUnitSerialInput />
            <AddSingleUnitSerialInput />
            <AddMultipleUnitSerialInput />
        </div>
    </>;
};

// tslint:disable-next-line: variable-name
const SearchDeviceInput: FC<{}> = () => {
    const [unitSerialValue, setUnitSerialValue] = React.useState<string>('');
    const [openModal, setOpenModal] = React.useState<boolean>(false);

    return <>
        <UnitSerialInput
            inputLabel="Search for a whitelisted VeeaHub:"
            unitSerialValue={unitSerialValue}
            buttonText="Search"
            onInputChange={setUnitSerialValue}
            onButtonClick={() => setOpenModal(true)}
            buttonIcon="fas fa-search"
            classGrayBar={style.searchGrayBar}
        />
        <DeviceFoundModal
            unitSerial={unitSerialValue}
            open={openModal}
            onClose={() => setOpenModal(false)}
        />
    </>;
};

// tslint:disable-next-line: variable-name
const RemoveUnitSerialInput: FC<{}> = () => {
    const [unitSerialValue, setUnitSerialValue] = React.useState<string>('');
    const [openModal, setOpenModal] = React.useState<boolean>(false);

    return <>
        <UnitSerialInput
            inputLabel="Remove a VeeaHub from whitelist:"
            unitSerialValue={unitSerialValue}
            buttonText="Remove VeeaHub"
            onInputChange={setUnitSerialValue}
            onButtonClick={() => setOpenModal(true)}
            buttonIcon="fas fa-minus-square"
            classGrayBar={style.removeGrayBar}
        />
        <UnitSerialModalAction
            setOpen={setOpenModal}
            open={openModal}
            unitSerialValue={unitSerialValue}
            verifyWhitelistStatus={(isWhitelisted: boolean) => isWhitelisted}
            whitelistAction={removeFromWhitelistUnits}
            confirmMsg="Are you sure you want to remove this VeeaHub?"
            warningMsg="VeeaHub not found in whitelist so cannot be removed"
            successMsg="Successfully removed from whitelist"
        />
    </>;
};

// tslint:disable-next-line: variable-name
const AddSingleUnitSerialInput: FC<{}> = () => {
    const [unitSerialValue, setUnitSerialValue] = React.useState<string>('');
    const [openModal, setOpenModal] = React.useState<boolean>(false);

    return <>
        <UnitSerialInput
            inputLabel="Add single VeeaHub to whitelist:"
            unitSerialValue={unitSerialValue}
            buttonText="Add VeeaHub"
            onInputChange={setUnitSerialValue}
            onButtonClick={() => setOpenModal(true)}
            buttonIcon="fas fa-plus-square"
            classGrayBar={style.addGrayBar}
        />
        <UnitSerialModalAction
            open={openModal}
            setOpen={setOpenModal}
            unitSerialValue={unitSerialValue}
            verifyWhitelistStatus={(isWhitelisted: boolean) => !isWhitelisted}
            whitelistAction={addToWhitelistUnits}
            confirmMsg="Are you sure you want to add this VeeaHub?"
            warningMsg="VeeaHub is already in whitelist"
            successMsg="Successfully added to whitelist"
        />
    </>;
};

// tslint:disable-next-line: variable-name
const AddMultipleUnitSerialInput: FC<{}> = () => {
    const [unitSerialValues, setUnitSerialValues] = React.useState<string>('');
    const [error, setError] = React.useState<boolean>(false);
    const [openModal, setOpenModal] = React.useState<boolean>(false);

    const onAddClick = () => {
        if (unitSerialValues) {
            const validValues = allMultipleUnitSerialValid(unitSerialValues);
            if (validValues) {
                setError(false);
                setOpenModal(true);
            } else {
                setError(true);
            }
        } else {
            setError(true);
        }
    };

    const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUnitSerialValues(e.target.value);
        setError(false);
    };

    const onFileUploadClick =
        ({ target, target: { files = new FileList() } }: React.ChangeEvent<HTMLInputElement>) => {
            handleFileUpload(files && files.length ? files[0] : null);
            target.value = '';
        };

    const handleFileUpload = (file: any) => {
        const fileReader: FileReader = new FileReader();
        fileReader.onloadend = () => {
            const content = fileReader.result;
            setUnitSerialValues(content?.toString() ?? '');
            setOpenModal(true);
        };
        fileReader.readAsText(file);
    };

    return <>
        <div className={style.unitSerialInput}>
            <p className={`${style.label}`}>Add multiple VeeaHubs to whitelist:</p>
            <div className={style.inputs}>
                <div>
                    <textarea className={style.textarea} value={unitSerialValues} onChange={onTextAreaChange}
                        placeholder="Full unit serial, ex: E09BCBA0C0B000000688"
                        >{unitSerialValues}
                    </textarea>
                    {error && <div className={style.unitSerialError}>Please enter valid Unit Serial(s)</div>}
                </div>
                <div>
                    <Button large primary className={style.wlButton} onClick={onAddClick}>
                        <i className={`fas fa-plus-square`} /> Add VeeaHubs
                    </Button>
                    <div className={style.orDiv}>
                        - or -
                    </div>
                    <Button large primary className={style.wlButton}>
                        <label htmlFor="csvBtnUpload"><i className={`fas fa-plus-square`} /> Upload CSV</label>
                    </Button>
                    <input className={style.hiddenInput} id="csvBtnUpload" type="file" accept=".csv"
                        onChange={onFileUploadClick} />
                </div>
                <div className={style.note}>
                    <div>Note: CSV file should contain only unit serials -</div>
                    <div>one per line in the first column</div>
                </div>
            </div>
        </div>
        <AddMultipleUnitSerialModal
            open={openModal}
            onClose={
                () => {
                    setOpenModal(false);
                    setUnitSerialValues('');
                }
            }
            unitSerialValues={unitSerialValues}
            clearList={() => setUnitSerialValues('')}
        />
    </>;
};
