import React, {useState} from 'react'
import Header from './UI-Components/Header'
import Sidebar from "./UI-Components/Sidebar";
import Footer from "./UI-Components/Footer";
import {
    Button,
    Section,
    TextBox,
    Pagination,
  } from "../core/components";
  import {
    Dropdown,
  } from "../core/components";
  import {
    Table,
    Row,
    ItemCell,
    HeaderCell,
    LinkCell,
  } from "../core/components";
const OrderView = () => {
    const [status, setStatus] = useState("All statuses")
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
        <div class="main-layout">
            <div class="main-conetnt">
                {/* Side Bar */}
                <div className="sidemenu">
                <Sidebar/>
                </div>
                <div class="content-wrapper">
                    <div class="order-heading-block">
                        <h2 class="heading"><span>Orders</span><i class="fas fa-caret-right"></i>New Belgium Brewery</h2>
                    </div>
                    {/* Entity information */}
                    <Section className="w-full entry-block m-t-20" title="entity information">
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
                
                    <div className="three-fields m-t-20">
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
                    <Section className="w-full entry-block m-t-20" title="Main Address">
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
                
                    <div className="three-fields m-t-20">
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
                    {/* Contacts */}
                    <div class="custom-section mt-4">
                    <div class="custom-section-header">
                        <h4>Contacts</h4>
                        <a href="">+ ADD NEW ITEM</a>
                    </div>
                    <div class="custom-section-body">
                        <div class="orders-filter">
                            <TextBox
                                prependIcon="fas fa-search"
                                className="order-search"
                                placeholder="Search contacts by name, phone, or title"
                                defaultValue=""
                            />
                            <Dropdown
                                className="all-orders"
                                value={status}
                                onChange={setStatus}
                                options={["All statuses", "status1", "status2"]}
                                invalid
                            />
                        </div>
                        <div className="order-table product-popup-table">
                        <Table cols="grid-cols-5 table-responsive">
                            <Row>
                            <HeaderCell>Name</HeaderCell>
                            <HeaderCell>Title</HeaderCell>
                            <HeaderCell>E-mail</HeaderCell>
                            <HeaderCell></HeaderCell>
                            <HeaderCell>Status</HeaderCell>
                            </Row>
                            <Row>
                            <LinkCell>Steve Fechheimer</LinkCell>
                            <ItemCell>Chief Executive Officer</ItemCell>
                            <ItemCell>steve@newbelgium.com</ItemCell>
                            <ItemCell></ItemCell>
                            <ItemCell><span className="status"></span>Active</ItemCell>
                            </Row>
                            <Row>
                            <LinkCell>Randy Rainbow</LinkCell>
                            <ItemCell>Chief Marketing Officer</ItemCell>
                            <ItemCell>randy@newbelgium.com</ItemCell>
                            <ItemCell></ItemCell>
                            <ItemCell><span className="status paused"></span>On Hold</ItemCell>
                            </Row>
                            <Row>
                            <LinkCell>Daddy Warbucks</LinkCell>
                            <ItemCell>Chief Financial Officer</ItemCell>
                            <ItemCell>daddy@newbelgium.com</ItemCell>
                            <ItemCell></ItemCell>
                            <ItemCell><span className="status complete"></span>Inactive</ItemCell>
                            </Row>

                        </Table> 
                        </div> 
                        <div className="table-pagination">
                            <Pagination
                                hasNext={false}
                                hasPrev={false}
                                nextPage={() => {}}
                                prevPage={() => {}}
                            >
                            Page 1/1
                        </Pagination>
                        </div> 
                    </div>
                
                  </div>
                  <Section className="w-full entry-block m-t-20" title="entity family"></Section>
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

export default OrderView
