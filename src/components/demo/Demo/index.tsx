import './demo.scss';
import * as React from 'react';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Container, CollapsiblePanel, ActionModal, Toggle, SearchBar } from '@/components/core';
import { RadioGroup, Radio } from '@/components/core';
import { Checkbox } from '@/components/core';
import { Separator } from '@/components/core';
import { Nothing } from '@/components/core';
import { Button } from '@/components/core';
import { Footer } from '@/components/core';
import { PageIntro } from '@/components/core';
import { Hero } from '@/components/core';
import { TextField } from '@/components/core/Inputs';
import { Autocomplete } from '@/components/core/Inputs';
import { iconList } from './icon-names';
import { TabBar, Tab, TabPanel } from '@/components/core';
import { Spinner } from '@/components/core';
import { Progress } from '@/components/core';
import { Modal } from '@/components/core/Modal';
import { delay } from 'rxjs/operators';
import { SchemaForm } from '@/components/core/SchemaForm';
import { isValidJsonSchemaString } from '@/utils/json';


// tslint:disable-next-line: variable-name
export const Demo: FC<Props> = ({}) => {

    const [username, setUsername] = React.useState('');
    const [tabIndex, setTabIndex] = React.useState(0);
    const id = React.useRef(0);

    const handleTabIndexChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    const [radioValue, setRadioValue] = React.useState('female');

    const handleRadioChange = (_event: React.ChangeEvent<HTMLInputElement>, newValue: string) => {
        setRadioValue(newValue);
    };

    const [modalOpen, setModalOpen] = React.useState(false);
    const [childModalOpen, setChildModalOpen] = React.useState(false);
    const [secondChildModalOpen, setSecondChildModalOpen] = React.useState(false);
    const [checked, setChecked] = React.useState(false);
    const [autoCompleteLoading, setAutoCompleteLoading] = React.useState(false);
    const [actionModalOpen, setActionModalOpen] = React.useState(false);

    return <>
    <Hero primary>
        {/* <EnterpriseCenterLogo /> */}
        <b>React UI</b><span style={{ fontWeight: 300 }}> Components</span>
    </Hero>
    <Container>
        <Separator sticky>Buttons</Separator>
        <div>
            <MarginLeft>Small</MarginLeft>
            <Button small>Default</Button>
            <Button small primary>Primary</Button>
            <Button small info>Info</Button>
            <Button small success>Success</Button>
            <Button small error>Error</Button>
        </div>
        <div>
            <MarginLeft>Normal</MarginLeft>
            <Button>Default</Button>
            <Button primary>Primary</Button>
            <Button info>Info</Button>
            <Button success>Success</Button>
            <Button error>Error</Button>
        </div>
        <div>
            <MarginLeft>Normal (disabled)</MarginLeft>
            <Button disabled>Default</Button>
            <Button primary disabled>Primary</Button>
            <Button info disabled>Info</Button>
            <Button success disabled>Success</Button>
            <Button error disabled>Error</Button>
        </div>
        <div>
            <MarginLeft>Large</MarginLeft>
            <Button large>Default</Button>
            <Button large primary>Primary</Button>
            <Button large info>Info</Button>
            <Button large success>Success</Button>
            <Button large error>Error</Button>
        </div>
        <Separator sticky>Inputs</Separator>
        <div className="inputs">
            <TextField value={username} onChange={setUsername} label="Username" />
            <TextField value={username} onChange={setUsername} label="Username" prependIcon="icon-11_My_Profile" />
            <TextField defaultValue="" label="Password" type="password" appendIcon="icon-128_Eye" />
        </div>
        <SearchBar searchQuery={username}
            setSearchQuery={setUsername}
            placeholder="Search for something"
            doSearch={() => {}}
        />
        <Separator sticky>Autocomplete</Separator>
        <div className="inputs">
            <Autocomplete prependIcon="fas fa-search"
                freeSolo
                label="Search devices"
                options={autocompleteOptions}
                getOptionLabel={o => o.name} />
            <Autocomplete
                freeSolo
                label="Multiselect"
                multiple
                options={autocompleteOptions}
                getOptionLabel={o => o.name} />
        </div>
        <div className="inputs">
            <Autocomplete appendIcon="fas fa-users"
                freeSolo
                label="Async search"
                loading={autoCompleteLoading}
                onInputChange={() => {
                    setAutoCompleteLoading(true);
                    clearTimeout(id.current);
                    setTimeout(() => setAutoCompleteLoading(false), 2000);
                }}
                options={autocompleteOptions}
                getOptionLabel={o => o.name}
            />
            <Autocomplete
                freeSolo
                label="Custom rendering"
                renderOption={option => (
                    <>
                        <i style={{fontSize: '20px', marginRight: '5px' }}
                           className={option.type === 'mesh' ? 'icon-70_Mesh' : 'icon-78_VeeaHub'} />
                        {option.name}
                    </>
                )}
                options={autocompleteOptions}
                getOptionLabel={o => o.name}
            />
        </div>
        <Separator sticky>Checkbox</Separator>
        <Checkbox checked={checked} onClick={setChecked}>
            {checked ? `I'm checked` : `I'm not checked`}
        </Checkbox>
        <Checkbox checked={checked} disabled>I'm disabled</Checkbox>
        <Checkbox checked={checked} onClick={setChecked} withBackground>
            I'm {checked ? 'checked' : 'not checked'} with background modifier
        </Checkbox>
        <Separator sticky>Toggles</Separator>
        <Toggle value={checked} onChange={setChecked}>I'm a toggle</Toggle>
        <Toggle value={checked} onChange={setChecked} disabled>I'm disabled toggle</Toggle>
        <Separator sticky>Radio</Separator>
        <RadioGroup name="gender" value={radioValue} onChange={handleRadioChange}>
            <Radio value="female">Female</Radio>
            <Radio value="male">Male</Radio>
            <Radio value="other">Other</Radio>
            <Radio value="disabled" disabled>Disabled option</Radio>
        </RadioGroup>
        <Separator sticky>Nothing</Separator>
        <Nothing>No devices found.</Nothing>
        <Separator sticky>Collapsible Panel</Separator>
        <CollapsiblePanel title="Additional information" defaultValue>
            Ipsum aliquam dolorem optio minima necessitatibus nulla earum.
            Impedit consequatur sed sit voluptatem. Et aut nobis veritatis est vel
            blanditiis amet dolor. Laudantium rerum aliquam excepturi. Saepe ea nihil
            iure corrupti reprehenderit sapiente nam ex. Fuga odit itaque est
            rerum saepe nulla et.
        </CollapsiblePanel>
        <Separator sticky>Spinner</Separator>
        <Spinner/>
        <Spinner text="Loading"/>
        <Separator sticky>Progress &amp; Sliders</Separator>
        <Progress value={10}/>
        <Progress value={40}/>
        <Progress value={80}/>
        <Progress value={100}/>
        <Separator sticky>Modals</Separator>
        <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        <Modal extended centered open={modalOpen} onClose={() => setModalOpen(false)}>
            <h1>Update Software</h1>
            <h2>Are you sure you want to update the system software to the latest version?</h2>
            <hr />
            <h2 style={{ fontSize: '16px', color: '#000' }}>
                This process might take up to 20 minutes. Your VeeaHubs will restart during the update
            </h2>
            <Button onClick={() => setModalOpen(false)} primary large
                style={{ paddingLeft: '60px', paddingRight: '60px', marginTop: '20px' }}
            >
                Cancel
            </Button>
            <Button onClick={() => setChildModalOpen(true)} success large clickLimited
                style={{ marginLeft: '15px', paddingLeft: '60px', paddingRight: '60px', marginTop: '20px' }}
            >
                Update Software
                <Modal title="Are you sure ?" centered open={childModalOpen} onClose={() => setChildModalOpen(false)}>
                    <Button primary onClick={() => setSecondChildModalOpen(true)}>Yes</Button>
                    <Button success onClick={() => setChildModalOpen(false)}>No</Button>
                </Modal>
            </Button>
        </Modal>
        <Modal title="Are you really sure ?" centered open={secondChildModalOpen}
            style={{ maxWidth: 240 }} noClose
            onClose={() => setSecondChildModalOpen(false)}>
            <Button success style={{ marginTop: '20px' }} onClick={() => {
                setSecondChildModalOpen(false);
                setChildModalOpen(false);
                setModalOpen(false);
            }}>Yes</Button>
        </Modal>
        <Separator sticky>Action Dialog</Separator>
        <Button onClick={() => setActionModalOpen(true)}>Do Action</Button>
        <ActionModal extended centered open={actionModalOpen}
            onClose={() => setActionModalOpen(false)}
            style={{ maxWidth: '700px' }}
            actions={[
                {
                    text: 'Update Software',
                    type: 'primary' as const,
                    run: () => of(
                        Math.random() > 0.5 ? { type: 'primary' as const } :
                        { type: 'error' as const, reason: 'You got Tail!'},
                    ).pipe(delay(2000))
                     .pipe(map(res => {
                        if (res.type === 'primary') {
                            return { success: true,
                                     summary: 'Summary text',
                                     description: 'Description text' };
                        } else {
                            return { success: false,
                                     summary: 'Oops',
                                     description: `There was an error ${res.reason}` };
                        }
                    })).toPromise(),
                },
            ]}
        >
            <h1>Update Software</h1>
            <h2>Are you sure you want to update the system software to the latest version?</h2>
            <hr />
            <h2 style={{ fontSize: '16px', color: '#000' }}>
                This process might take up to 20 minutes. Your VeeaHubs will restart during the update
            </h2>
        </ActionModal>
        <Separator sticky>Tabs</Separator>
    </Container>
    <TabBar className="mt-15" onChange={handleTabIndexChange} value={tabIndex}>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
    </TabBar>
    <Container solid>
        <TabPanel value={tabIndex} index={0}>First tab</TabPanel>
        <TabPanel value={tabIndex} index={1}>Second tab</TabPanel>
        <TabPanel value={tabIndex} index={2}>Third tab</TabPanel>
    </Container>
    <Container>
        <Separator>Page Intro</Separator>
    </Container>
    <PageIntro title="Bug reported" icon="icon-102_Bug">
        <NavLink to="/"><i className="fas fa-chevron-left"></i>Go back</NavLink>
    </PageIntro>
    <Container>
        <Separator sticky>JSON Schema form</Separator>
        <DemoJSONSchemaForm />
    </Container>
    <Container>
        <Separator sticky>Veea Icons</Separator>
        {iconList.map(icon =>
            <div className="preview" key={icon}>
                <span className="inner"><i className={icon}/></span>
                <span className="label" title={icon}>{icon}</span>
            </div>,
        )}
    </Container>
    <Container>
        <Footer />
    </Container>
</>;
};

// tslint:disable-next-line: variable-name
const DemoJSONSchemaForm: FC<Props> = () => {
    const [schemaInput, setSchemaInput] = React.useState<string>('');
    const placeholder = 'Type a valid JSON schema in this text box to render the SchemaForm component on the right.';

    // tslint:disable-next-line: variable-name
    const SchemaFormComponent = isValidJsonSchemaString(schemaInput) &&
        <SchemaForm schema={JSON.parse(schemaInput)} onSubmit={() => {}}>
            <Button className="demo-form-submit">Submit</Button>
        </SchemaForm>;

    const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setSchemaInput(e.target.value);

    return <div className="schema-form-demo">
        <textarea value={schemaInput} placeholder={placeholder} onChange={onTextAreaChange}></textarea>
        {SchemaFormComponent}
    </div>;
};

interface Props {}

// tslint:disable-next-line: variable-name
const MarginLeft: FC<{}> = ({ children }) => (
    <span style={{ marginRight: '1rem'}}>{children}</span>
);

const autocompleteOptions: { name: string, type: string }[] = [
    { name: 'VH-1020', type: 'device' },
    { name: 'VH-1021', type: 'device' },
    { name: 'VH-1022', type: 'device' },
    { name: 'VH-1023', type: 'device' },
    { name: 'VH-1024', type: 'device' },
    { name: 'VH-1025', type: 'device' },
    { name: 'VMESH-12', type: 'mesh' },
    { name: 'VMESH-13', type: 'mesh' },
    { name: 'VMESH-14', type: 'mesh' },
];