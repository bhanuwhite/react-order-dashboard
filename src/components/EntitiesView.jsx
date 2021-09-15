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
            <div class="main-conetnt flex">
                {/* Side Bar */}
                <div className="sidemenu">
                <Sidebar/>
                </div>
                <div class="content-wrapper">
                    <div class="order-heading-block">
                        <h2 class="heading"><span>Orders</span><i class="fas fa-caret-right"></i>New Belgium Brewery</h2>
                    </div>
                    {/* Entity information */}
                    <Section className="w-full entry-block mt-5" title="entity information">
                        <div class="sm:flex justify-between items-center">
                            <div class="sm:w-2/3 sm:mr-5">
                                <TextBox
                                    className="entry-filed"
                                    label="Name"
                                    defaultValue="New Belgium Brewery"
                                />
                            </div>
                            <div class="sm:w-1/3 m-t-20-mobile">
                                <Dropdown
                                className="w-full entry-dropdown"
                                label="Parent"
                                value={parent}
                                onChange={setParent}
                                options={["All orders", "Order1", "Order2"]}
                                />
                            </div>
                        </div>
                
                    <div className="mt-5">
                        <div class="sm:flex justify-between items-center">
                            <div class="sm:w-1/3 sm:mr-5">
                                <Dropdown
                                className="w-full entry-dropdown"
                                label="Market"
                                value={market}
                                onChange={setMarket}
                                options={["Lips", "Market1", "Market2"]}
                                />
                            </div>
                            <div class="sm:w-1/3 sm:mr-5 m-t-20-mobile">
                                <Dropdown
                                className="w-full entry-dropdown"
                                label="Account Type"
                                value={account}
                                onChange={setAccount}
                                options={["Lips1", "Account1", "Account2"]}
                                />
                            </div>
                            <div class="sm:w-1/3 m-t-20-mobile">
                                <Dropdown
                                className="w-full entry-dropdown"
                                label="Owner"
                                value={owner}
                                onChange={setOwner}
                                options={["Owner1", "Owner2", "Owner3"]}
                                />
                            </div>
                        </div>
                     </div>
                    </Section>
                    {/* Main Address */}
                    <Section className="w-full entry-block mt-5" title="Main Address">
                        <div class="sm:flex justify-between items-center">
                            <div class="sm:w-1/3 sm:mr-5">
                                <TextBox
                                    className="entry-filed"
                                    label="Address Line 1"
                                    defaultValue="123 Fake Street"
                                />
                            </div>
                            <div class="sm:w-1/3 sm:mr-5 m-t-20-mobile">
                                <TextBox
                                    className="entry-filed"
                                    label="City"
                                    defaultValue=""
                                />
                            </div>
                            <div class="sm:w-1/3 m-t-20-mobile">
                                <Dropdown
                                className="w-full entry-dropdown"
                                label="State / Province"
                                value={state}
                                onChange={setState}
                                options={["State1", "State2", "State3"]}
                                />
                            </div>
                        </div>
                
                    <div className="mt-5">
                        <div class="sm:flex justify-between items-center">
                            <div class="sm:w-1/3 sm:mr-5">
                                <TextBox
                                    className="entry-filed"
                                    label="Address Line 2"
                                    defaultValue=""
                                />
                            </div>
                            <div class="sm:w-1/3 sm:mr-5 m-t-20-mobile">
                                <TextBox
                                    className="entry-filed"
                                    label="ZIP Code"
                                    defaultValue=""
                                />
                            </div>
                            <div class="sm:w-1/3 m-t-20-mobile">
                                <Dropdown
                                className="w-full entry-dropdown"
                                label="Country"
                                value={country}
                                onChange={setCountry}
                                options={["United States", "United Kingdom", "India"]}
                                />
                            </div>
                         </div>
                    </div>
                    </Section>
                    {/* Contacts */}
                    <div class="custom-section mt-5">
                    <div class="custom-section-header flex justify-between items-center">
                        <h4>Contacts</h4>
                        <a href="">+ ADD NEW ITEM</a>
                    </div>
                    <div class="custom-section-body">
                        <div class="orders-filter sm:flex justify-between items-center">
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
                            />
                        </div>
                        <div className="order-table">
                            <Table cols="grid-cols-4 table-responsive">
                                <Row>
                                <HeaderCell>Name</HeaderCell>
                                <HeaderCell>Title</HeaderCell>
                                <HeaderCell>E-mail</HeaderCell>
                                <HeaderCell>Status</HeaderCell>
                                </Row>
                                <Row>
                                <LinkCell className="blue-text">Steve Fechheimer</LinkCell>
                                <ItemCell>Chief Executive Officer</ItemCell>
                                <ItemCell>steve@newbelgium.com</ItemCell>
                                <ItemCell className="light-gray-text"><span className="status"></span>Active</ItemCell>
                                </Row>
                                <Row>
                                <LinkCell className="blue-text">Randy Rainbow</LinkCell>
                                <ItemCell>Chief Marketing Officer</ItemCell>
                                <ItemCell>randy@newbelgium.com</ItemCell>
                                <ItemCell className="light-gray-text"><span className="status paused"></span>On Hold</ItemCell>
                                </Row>
                                <Row>
                                <LinkCell className="blue-text">Daddy Warbucks</LinkCell>
                                <ItemCell>Chief Financial Officer</ItemCell>
                                <ItemCell>daddy@newbelgium.com</ItemCell>
                                <ItemCell className="light-gray-text"><span className="status complete"></span>Inactive</ItemCell>
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
                  <Section className="w-full entry-block mt-5" title="entity family"></Section>
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
