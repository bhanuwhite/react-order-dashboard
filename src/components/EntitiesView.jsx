import React, {useState} from 'react'
import Header from './UI-Components/Header'
import Sidebar from "./UI-Components/Sidebar";
import Footer from "./UI-Components/Footer";
import Plus from "../assets/imgs/plus.png";
import {
    Button,
    Section,
    TextBox,
  } from "../core/components";
  import {
    Dropdown,
  } from "../core/components";
const OrderView = () => {
    const [parent, setParent] = useState("None selected")
    const [market, setMarket] = useState("Lips")
    const [account, setAccount] = useState("Lips")
    const [owner, setOwner] = useState("None selected")
    const [state, setState] = useState("None selected")
    const [country, setCountry] = useState("United States")
    return (
        <>
        {/* header */}
        <Header/>
        {/* Search filter for mobile */}
        <TextBox
            prependIcon="fas fa-search"
            className="global-search mobile-filter"
            placeholder="Search orders, products and more"
            defaultValue=""
            />
             {/*Orders Main Conetnt */}
        <div class="main-layout">
            <div class="main-conetnt">
                {/* Side Bar */}
                <div className="sidemenu">
                <Sidebar/>
                </div>
                <div class="content-wrapper">
                <div class="order-heading-block">
                    <h2 class="heading"><span>Orders</span><i class="fas fa-caret-right"></i>STS51-1701A</h2>
                    <Button className="primary-btn order-view"><i class="fas fa-pause-circle"></i>Pause</Button>
                </div>
                {/* Entity information */}
                <Section className="w-full entry-block" title="entity information">
                    <div class="row">
                        <div class="col-lg-8">
                            <TextBox
                                className="entry-filed"
                                label="Name"
                                defaultValue="New Belgium Brewery"
                                invalid
                            />
                        </div>
                        <div class="col-lg-4">
                            <Dropdown
                            className="w-full entry-dropdown"
                            label="Parent"
                            value={parent}
                            onChange={setParent}
                            options={["All orders", "Order1", "Order2"]}
                            invalid
                            />
                        </div>
                    </div>
            
                  <div className="three-fields">
                    <div class="row">
                            <div class="col-lg-4">
                                <Dropdown
                                className="w-full entry-dropdown"
                                label="Market"
                                value={market}
                                onChange={setMarket}
                                options={["Lips", "Market1", "Market2"]}
                                invalid
                                />
                            </div>
                            <div class="col-lg-4">
                                <Dropdown
                                className="w-full entry-dropdown"
                                label="Account Type"
                                value={account}
                                onChange={setAccount}
                                options={["Lips1", "Account1", "Account2"]}
                                invalid
                                />
                            </div>
                            <div class="col-lg-4">
                                <Dropdown
                                className="w-full entry-dropdown"
                                label="Owner"
                                value={owner}
                                onChange={setOwner}
                                options={["Owner1", "Owner2", "Owner3"]}
                                invalid
                                />
                            </div>
                        </div>
                 
                  </div>
                </Section>
                {/* Main Address */}
                <Section className="w-full entry-block" title="Main Address">
                    <div class="row">
                        <div class="col-lg-4">
                            <TextBox
                                className="entry-filed"
                                label="Address Line 1"
                                defaultValue="123 Fake Street"
                                invalid
                            />
                        </div>
                        <div class="col-lg-4">
                            <TextBox
                                className="entry-filed"
                                label="City"
                                defaultValue=""
                                invalid
                            />
                        </div>
                        <div class="col-lg-4">
                            <Dropdown
                            className="w-full entry-dropdown"
                            label="State / Province"
                            value={state}
                            onChange={setState}
                            options={["State1", "State2", "State3"]}
                            invalid
                            />
                        </div>
                    </div>
            
                  <div className="three-fields">
                    <div class="row">
                        <div class="col-lg-4">
                            <TextBox
                                className="entry-filed"
                                label="Address Line 2"
                                defaultValue=""
                                invalid
                            />
                        </div>
                        <div class="col-lg-4">
                            <TextBox
                                className="entry-filed"
                                label="ZIP Code"
                                defaultValue=""
                                invalid
                            />
                        </div>
                        <div class="col-lg-4">
                            <Dropdown
                            className="w-full entry-dropdown"
                            label="Country"
                            value={country}
                            onChange={setCountry}
                            options={["United States", "United Kingdom", "India"]}
                            invalid
                            />
                        </div>
                        </div>
                 
                  </div>
                </Section>
                </div>
            </div>
         </div>
        </>
    )
}

export default OrderView
