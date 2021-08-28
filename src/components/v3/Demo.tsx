import * as React from 'react';
import { FC } from 'react';
import moment from 'moment';
import { Button, Toggle, Tab, TabBar, RoutedTabBar, LinkTab, Pagination, TextBox, Section, Checkbox, Radio, Toast } from './core';
import { Dropdown, Switcher, SwitchButton, DatePicker } from './core';
import { Table, Row, ItemCell, HeaderCell, LinkCell } from './core';
import { InfoBox, Modal, DateRange } from './core';


// tslint:disable-next-line: variable-name
export const Demo: FC<Props> = ({}) => {

    const [ toggle1, setToggle1 ] = React.useState(false);
    const [ toggle2, setToggle2 ] = React.useState(true);
    const [ date, setDate ] = React.useState(moment());
    const [ dateRange, setDateRange ] = React.useState(() => [moment(), moment().add(4, 'day')] as const);
    const [ modal1Open, setModal1Open ] = React.useState(false);
    const [ modal2Open, setModal2Open ] = React.useState(false);
    const [ showToast, setShowToast ] = React.useState(false);
    const [ toastPos, setToastPos ] = React.useState<'top-middle' | 'top-right' | 'top-left' | 'bottom-left' | 'bottom-middle' | 'bottom-right'>('bottom-middle');
    const [ tabIndex, setTabIndex ] = React.useState(0);
    const [ switchOption, setSwitchOption ] = React.useState(0);
    const [ radioState, setRadioState ] = React.useState<'foo' | 'bar' | 'baz'>('bar');
    const [ status, setStatus ] = React.useState<'All' | 'Healthy' | 'Offline'>('All');
    const handleTabIndexChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    return <div className="max-w-screen-lg m-auto">
        <div className="mt-5 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">COLORS</div>
            <div className="flex">
                <div className="w-24 h-24 bg-primary relative">
                    <div className="absolute text-white bottom-1 left-2">#396EFF</div>
                </div>
                <div className="ml-2 w-24 h-24 bg-bad relative">
                    <div className="absolute text-white bottom-1 left-2">#EB2020</div>
                </div>
                <div className="ml-2 w-24 h-24 bg-good relative">
                    <div className="absolute text-white bottom-1 left-2">#53C716</div>
                </div>
                <div className="ml-2 w-24 h-24 bg-neutral relative">
                    <div className="absolute text-white bottom-1 left-2">#909090</div>
                </div>
                <div className="ml-2 w-24 h-24 bg-warn relative">
                    <div className="absolute text-white bottom-1 left-2">#F8BE20</div>
                </div>
                <div className="ml-2 w-24 h-24 bg-primary-light relative">
                    <div className="absolute text-white bottom-1 left-2">#577DFF</div>
                </div>
                <div className="ml-2 w-24 h-24 bg-veea relative">
                    <div className="absolute text-white bottom-1 left-2">#B9090F</div>
                </div>
                <div className="ml-2 w-24 h-24 bg-clear-white relative border border-black border-solid">
                    <div className="absolute text-gray-600 bottom-1 left-2">#FAFAFA</div>
                </div>
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">BUTTON</div>
            <Button className="">Default Button</Button>
            <Button className="ml-3" red>Destructive Action</Button>
            <Button className="ml-3" disabled>Disabled Button</Button>
            <Button className="ml-3" secondary>Secondary Button</Button>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">TOGGLE</div>
            <Toggle className="" value={toggle1} onChange={setToggle1} />
            <Toggle className="ml-5" value={toggle2} onChange={setToggle2} />
            <Toggle className="ml-5" disabled value={toggle2} onChange={setToggle2} />
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">TABS</div>
            <TabBar className="mt-15" onChange={handleTabIndexChange} value={tabIndex}>
                <Tab>Tab 1</Tab>
                <Tab>Tab 2</Tab>
                <Tab>Tab 3</Tab>
            </TabBar>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">LINK TABS</div>
            <RoutedTabBar className="mt-15">
                <LinkTab to="/" exact>Applications</LinkTab>
                <LinkTab to="/foobar">Testing Teams</LinkTab>
                <LinkTab to="/baz" exact>Baz</LinkTab>
            </RoutedTabBar>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">PAGINATION</div>
            <div className="flex-grow">
                <Pagination hasNext={false} hasPrev={false} nextPage={() => {}} prevPage={() => {}}>
                    Page 1/1
                </Pagination>
                <Pagination className="mt-5" hasNext={true} hasPrev={false} nextPage={() => {}} prevPage={() => {}}>
                    Page 1/3
                </Pagination>
                <Pagination className="mt-5" hasNext={true} hasPrev={true} nextPage={() => {}} prevPage={() => {}}>
                    Page 2/3
                </Pagination>
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">TEXTBOX</div>
            <div className="flex-grow flex flex-wrap -m-5">
                <TextBox className="w-60 m-5" placeholder="Placeholder" label="E-mail Address"
                    defaultValue="" disabled />
                <TextBox className="w-60 m-5" label="E-mail Address" defaultValue="Some text" disabled />
                <TextBox className="w-60 m-5" label="E-mail Address" defaultValue="atesh@veea.com" invalid />
                <TextBox prependIcon="fas fa-envelope-open" className="w-60 m-5"
                    placeholder="required" label="E-mail Address"
                    defaultValue=""
                />
                <TextBox appendIcon="fas fa-at" className="w-60 m-5"
                    placeholder="required" label="E-mail Address"
                    defaultValue="atesh@veea.com"
                />
                <TextBox prependIcon="fas fa-search" className="w-60 m-5"
                    placeholder="required" label="E-mail Address"
                    defaultValue=""
                />
                <TextBox prependIcon="text-lg icon-48_Search" className="w-60 m-5"
                    placeholder="required" label="E-mail Address"
                    defaultValue=""
                />
                <TextBox appendIcon="text-lg icon-36_Send" className="w-60 m-5"
                    placeholder="required" label="E-mail Address"
                    defaultValue="atesh@veea.com"
                />
                <TextBox appendIcon="far fa-paper-plane" className="w-60 m-5"
                    placeholder="required" label="E-mail Address"
                    defaultValue="atesh@veea.com"
                />
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">DROPDOWN</div>
            <div className="flex-grow flex flex-col">
                <div className="flex flex-grow">
                    <Dropdown className="w-60 mr-10" value={status} onChange={setStatus} options={['All', 'Healthy', 'Offline']} invalid />
                    <Dropdown className="w-60 mr-10" value={status} onChange={setStatus} options={['All', 'Healthy', 'Offline']} disabled />
                </div>
                <div className="flex flex-grow mt-10">
                    <Dropdown className="w-60 mr-10" label="Status"
                        value={status} onChange={setStatus} options={['All', 'Healthy', 'Offline']} />
                    <Dropdown className="w-60 mr-10" label="Status"
                        value={status} onChange={setStatus} options={['All', 'Healthy', 'Offline']} disabled />
                </div>
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">DATE PICKER</div>
            <div className="flex-grow flex flex-col">
                <div className="flex flex-grow">
                    <DatePicker className="w-60 mr-10" value={date} onChange={setDate} invalid />
                    <DatePicker className="w-60 mr-10" value={date} onChange={setDate} disabled />
                </div>
                <div className="flex flex-grow mt-10">
                    <DatePicker label="Start" className="w-60 mr-10" value={date} onChange={setDate} dateOnly />
                    <DatePicker label="Time" className="w-60 mr-10" value={date} onChange={setDate} timeOnly />
                </div>
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">DATE RANGE</div>
            <div className="flex-grow flex flex-col">
                <DateRange
                    labelStart="Start Date" labelEnd="End Date"
                    className="flex-grow max-w-lg" value={dateRange} onChange={setDateRange} />
                <DateRange
                    className="flex-grow max-w-xl mt-10" value={dateRange} onChange={setDateRange} />
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">SEGMENTED</div>
            <div className="flex-grow flex">
                <Switcher btnClassName="w-32" className="mr-10" value={switchOption} onChange={setSwitchOption}>
                    <SwitchButton>Devices</SwitchButton>
                    <SwitchButton>Meshes</SwitchButton>
                    <SwitchButton>Cats</SwitchButton>
                </Switcher>
                <Switcher btnClassName="w-32" value={switchOption} onChange={setSwitchOption}>
                    <SwitchButton>Devices</SwitchButton>
                    <SwitchButton>Meshes</SwitchButton>
                    <SwitchButton disabled>Cats</SwitchButton>
                </Switcher>
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">TABLE</div>
            <div className="flex-grow flex flex-col items-start">
                <Table cols="grid-cols-5">
                    <Row>
                        <HeaderCell>Name</HeaderCell>
                        <HeaderCell>Role</HeaderCell>
                        <HeaderCell>Mesh</HeaderCell>
                        <HeaderCell>Model</HeaderCell>
                        <HeaderCell>Status</HeaderCell>
                    </Row>
                    <Row>
                        <LinkCell to="/mesh">MyMesh1</LinkCell>
                        <ItemCell>Gateway Node</ItemCell>
                        <ItemCell>VMESH-1234</ItemCell>
                        <ItemCell>VeeaHub VHC05</ItemCell>
                        <ItemCell>Healthy</ItemCell>
                    </Row>
                    <Row>
                        <LinkCell to="/mesh">MyMesh1 with very long name</LinkCell>
                        <ItemCell>Gateway Node</ItemCell>
                        <ItemCell>4</ItemCell>
                        <ItemCell>12</ItemCell>
                        <ItemCell>Offline</ItemCell>
                    </Row>
                </Table>
                <Table className="mt-10" cols="grid-cols-5">
                    <Row>
                        <HeaderCell>Name</HeaderCell>
                        <HeaderCell>Role</HeaderCell>
                        <HeaderCell>Mesh</HeaderCell>
                        <HeaderCell>Model</HeaderCell>
                        <HeaderCell>Status</HeaderCell>
                    </Row>
                    <Row>
                        <LinkCell to="/mesh">MyMesh1</LinkCell>
                        <ItemCell>Gateway Node</ItemCell>
                        <ItemCell>VMESH-1234</ItemCell>
                        <ItemCell>VeeaHub VHC05</ItemCell>
                        <ItemCell>Healthy</ItemCell>
                    </Row>
                    <Row>
                        <LinkCell to="/mesh">MyMesh1</LinkCell>
                        <ItemCell>Gateway Node</ItemCell>
                        <ItemCell>4</ItemCell>
                        <ItemCell>12</ItemCell>
                        <ItemCell>Offline</ItemCell>
                    </Row>
                </Table>
                {/* <Table>
                    <Row>
                        <HeaderCell>Name</HeaderCell>
                        <HeaderCell>Role</HeaderCell>
                        <HeaderCell>Mesh</HeaderCell>
                        <HeaderCell>Model</HeaderCell>
                        <HeaderCell>Status</HeaderCell>
                    </Row>
                    <LoadingCell />
                </Table> */}
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">SECTION</div>
            <div className="flex-grow flex flex-col items-start">
                <Section className="w-full" title="My Cats"
                    infoLink={{ kind: 'ext-link', link: 'https://veea.com', title: 'help' }}
                >
                    <div className="p-5 bg-gray-100 text-gray-500 text-sm text-center">
                        You don't have any cats, yet.
                    </div>
                </Section>
                <Section className="w-full mt-10" title="My Cats"
                    infoLink={{ kind: 'int-link', link: '/cc', title: 'help' }}
                >
                    <div className="p-5 bg-gray-100 text-gray-500 text-sm text-center">
                        You don't have any cats, yet.
                    </div>
                </Section>
                <Section className="w-full mt-10" title="My Cats"
                    infoLink={{
                        kind: 'tooltip',
                        text: <>
                            Feed your cat and press <span className="pre font-mono ">P</span>
                        </>,
                    }}
                >
                    <div className="p-5 bg-gray-100 text-gray-500 text-sm text-center">
                        You don't have any cats, yet.
                    </div>
                </Section>
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">CHECKBOXES</div>
            <div className="flex-grow flex flex-col items-start">
                <label>
                    <Checkbox className="mr-2" value={toggle1} onChange={setToggle1} />
                    I agree to the Veea Terms of Service
                </label>
                <div className="mt-5">
                    <Checkbox className="mr-2" value={toggle1} onChange={setToggle1} disabled />
                    Subscribe me for promotions from Veea Inc.
                </div>
                <div className="mt-5">
                    <Checkbox indeterminate className="mr-2" value={toggle2} onChange={setToggle2} />
                    Select all
                </div>
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">RADIOS</div>
            <div className="flex-grow flex flex-col items-start">
                {/* The group class can be used so that the hover effect is shown when hovering the text as well */}
                <label className="group">
                    <Radio name="test" className="mr-2"
                        current={radioState} value="foo" onChange={setRadioState}
                    />
                    Enable debugging features
                </label>
                <label className="mt-5">
                    <Radio name="test" className="mr-2"
                        current={radioState} value="baz" onChange={setRadioState}
                    />
                    Don't enable anything, I'm good.
                </label>
                <label className="mt-5">
                    <Radio name="test" className="mr-2"
                        current={radioState} value="bar" onChange={setRadioState} disabled
                    />
                    Enable super admin mode
                </label>
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">INFOBOX</div>
            <div className="flex-grow flex flex-wrap items-start -m-3">
                <InfoBox className="m-3" kind="error">Invalid e-mail or password</InfoBox>
                <InfoBox className="m-3" kind="warn" onClose={() => {}}>
                    Changing this setting might break things
                </InfoBox>
                <InfoBox className="m-3" kind="success">Cat added to database successfully</InfoBox>
                <InfoBox className="m-3">I am just a tip, do whatever you want</InfoBox>
                <InfoBox className="m-3" onClose={() => {}}>
                    Lorem ipsum dolor si amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore{' '}
                    et dolor magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                </InfoBox>
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">TOASTS</div>
            <div className="flex-grow flex flex-wrap items-start">
                <Button onClick={() => setShowToast(true)}>Show toast</Button>
                <Dropdown className="w-60 ml-3" value={toastPos} onChange={setToastPos}
                    options={['top-left', 'top-middle', 'top-right', 'bottom-left', 'bottom-middle', 'bottom-right']} />
                <Toast position={toastPos} open={showToast} onClose={() => setShowToast(false)} className="m-3" kind="error">
                    Invalid e-mail or password
                </Toast>
            </div>
        </div>
        <div className="mt-10 flex">
            <div className="w-28 self-center text-center mr-5 flex-shrink-0">MODALS</div>
            <div className="flex-grow flex flex-wrap items-start">
                <Button className="mr-3" onClick={() => setModal1Open(true)}>Open Modal</Button>
                <Button onClick={() => setModal2Open(true)}>Open Alert</Button>
                <Modal open={modal1Open} onClose={() => setModal1Open(false)}
                    header={
                        <h1 className="text-lg font-bold">Add New Cat</h1>
                    }
                    className="p-8"
                >
                    <TextBox label="E-mail Address" defaultValue="" />
                    <TextBox className="mt-4" label="Breed" defaultValue="" />
                    <TextBox className="mt-4" label="Favorite Toy" defaultValue="" />
                    <div className="mt-4 flex">
                        <Button className="flex-1 mr-2">Add Cat</Button>
                        <Button secondary className="flex-1 ml-2">Add multiple cats</Button>
                    </div>
                </Modal>
                <Modal open={modal2Open} onClose={() => setModal2Open(false)} small noClose
                    header={null}
                    className="p-8 flex flex-col items-center"
                >
                    <div><i className="fas fa-check-circle text-good text-5xl" /></div>
                    <div className="mt-4 mb-4 text-center">
                        <h1 className="text-lg font-bold">Add New Cat</h1>
                        Successfully added cat to the list.
                    </div>
                    <Button onClick={() => setModal2Open(false)} className="w-full">Done</Button>
                </Modal>
            </div>
        </div>
        <div className="h-screen"></div>
    </div>;
};

interface Props {}