import React, {useState} from 'react'
import Header from './UI-Components/Header'
import Sidebar from "./UI-Components/Sidebar";
import Footer from "./UI-Components/Footer";
import {
    Button,
    Section,
    TextBox,
    Dropdown,
    Checkbox,
  } from "../core/components";

const Settings = () => {
    const [language, setLanguage] = useState("English")
    const [timezone, setTimezone] = useState("Automatic")
    const [toggle1, setToggle1] = React.useState(true);
    const [toggle2, setToggle2] = React.useState(false);
    const [toggle3, setToggle3] = React.useState(true);
    const [toggle4, setToggle4] = React.useState(true);
    const [toggle5, setToggle5] = React.useState(false);
    const [toggle6, setToggle6] = React.useState(false);
    const [toggle7, setToggle7] = React.useState(false);
    const [toggle8, setToggle8] = React.useState(false);
    const [toggle9, setToggle9] = React.useState(true);
    const [toggle10, setToggle10] = React.useState(false);
    return (
        <>
        {/* header */}
        <Header/>
        {/* Search filter for mobile */}
        <TextBox
            prependIcon="fas fa-search"
            className="mobile-filter sm:hidden"
            placeholder="Search orders, products and more"
            defaultValue=""
         />
         <div class="bg-clear-white">
            <div class="main-conetnt flex">
                {/* Sidemenu  */}
                <div className="sidemenu">
                  <Sidebar/>
                </div>
                <div class="content-wrapper">
                    <div class="order-heading-block flex justify-between items-center">
                        <h2 class="heading">Settings</h2>
                    </div>
                    <Section className="w-full entry-block mt-5" title="general">
                        <TextBox
                            className="entry-filed"
                            label="Name"
                            defaultValue="Atesh Hicks"
                        />
                        <TextBox
                            className="entry-filed mt-5"
                            label="Primary E-mail"
                            defaultValue="atesh@veea.com"
                        />
                        <Dropdown
                            className="entry-dropdown mt-5"
                            label="Language"
                            value={language}
                            onChange={setLanguage}
                            options={["English", "Hindi"]}
                        />
                        <Dropdown
                            className="entry-dropdown mt-5"
                            label="Timezone"
                            value={timezone}
                            onChange={setTimezone}
                            options={["Automatic", "Manual"]}
                        />
                    </Section>
                    <Section className="w-full entry-block mt-5" title="notifications">
                        <div className="setting-notification notification-type">
                            <div className="notification-label">

                            </div>
                            <div className="notification-check">
                               <i class="fas fa-mobile-alt"></i>
                               <i class="fas fa-envelope"></i>
                            </div>
                        </div>
                        <div className="setting-notification">
                            <div className="notification-label">
                              <p>A new order has been placed</p>
                            </div>
                            <div className="notification-check">
                               <Checkbox
                                value={toggle1}
                                onChange={setToggle1}
                                />
                               <Checkbox
                                value={toggle2}
                                onChange={setToggle2}
                                />
                            </div>
                        </div>
                        <div className="setting-notification">
                            <div className="notification-label">
                              <p>An order has been approved</p>
                            </div>
                            <div className="notification-check">
                               <Checkbox
                                value={toggle3}
                                onChange={setToggle3}
                                />
                               <Checkbox
                                value={toggle4}
                                onChange={setToggle4}
                                />
                            </div>
                        </div>
                        <div className="setting-notification">
                            <div className="notification-label">
                              <p>A campaign has started</p>
                            </div>
                            <div className="notification-check">
                               <Checkbox
                                value={toggle5}
                                onChange={setToggle5}
                                />
                               <Checkbox
                                value={toggle6}
                                onChange={setToggle6}
                                />
                            </div>
                        </div>
                        <div className="setting-notification">
                            <div className="notification-label">
                              <p>A campaign has finished</p>
                            </div>
                            <div className="notification-check">
                               <Checkbox
                                value={toggle7}
                                onChange={setToggle7}
                                />
                               <Checkbox
                                value={toggle8}
                                onChange={setToggle8}
                                />
                            </div>
                        </div>
                        <div className="setting-notification">
                            <div className="notification-label">
                              <p>An order has been completed</p>
                            </div>
                            <div className="notification-check">
                               <Checkbox
                                value={toggle9}
                                onChange={setToggle9}
                                />
                               <Checkbox
                                value={toggle10}
                                onChange={setToggle10}
                                />
                            </div>
                        </div>
                    </Section>
                    <div className="update-btn">
                      <Button className="primary-btn">Save changes</Button>
                    </div>
                    {/* Footer */}
                    <div className="inside-footer">
                      <Footer />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Settings
