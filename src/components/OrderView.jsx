import React, {useState} from 'react'
import moment from "moment";
import Header from './UI-Components/Header'
import Sidebar from "./UI-Components/Sidebar";
import Footer from "./UI-Components/Footer";
import {
    Button,
    Section,
    Pagination,
    TextBox,
  } from "../core/components";
  import {
    Table,
    Row,
    ItemCell,
    HeaderCell,
    LinkCell,
  } from "../core/components";
  import {
    Dropdown,
    DatePicker,
  } from "../core/components";
const OrderView = () => {
    const [status, setStatus] = useState("All statuses")
    const [category, setCategory] = useState("Lips")
    const [advertiser, setAdvertiser] = useState("Advertiser Inc.")
    const [contact, setContact] = useState("Mr. Contact")
    const [agency, setAgency] = useState("Agency Inc.")
    const [agencycontact, setAgencyContact] = useState("Mr. Contact")
    const [sales, setSales] = useState("Mrs. Contact")
    const [bill, setBill] = useState("Bill Paying Inc.")
    const [date, setDate] = useState(moment());
    const [endate, setEndate] = useState(moment());
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
                <div class="order-heading-block flex justify-between items-center">
                    <h2 class="heading"><span>Orders</span><i class="fas fa-caret-right"></i>STS51-1701A</h2>
                    <Button className="order-view"><i class="fas fa-pause-circle"></i>Pause</Button>
                </div>
                {/* Entity information */}
                <Section className="w-full add-info-block mt-5" title="ad info">
                    <div class="flex-none sm:flex">
                        <div class="w-full sm:w-3/4 p-5">
                            <TextBox
                                className="entry-filed"
                                label="Name"
                                defaultValue="Lips of Faith - Spring 2020"
                            />
                            <Dropdown
                            className="w-full entry-dropdown mt-5"
                            label="Category"
                            value={category}
                            onChange={setCategory}
                            options={["Lips", "Category1", "Category2"]}
                            />
                            <div className="flex-none sm:flex justify-between items-center">
                                <div class="date-picker">
                                <DatePicker
                                    className="w-full entry-dropdown mt-5"
                                    label="Start Date"
                                    value={date}
                                    onChange={setDate}
                                    />
                                </div>
                                <div class="date-picker">
                                <DatePicker
                                    className="w-full entry-dropdown mt-5"
                                    label="End Date"
                                    value={endate}
                                    onChange={setEndate}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="w-full sm:w-1/4">
                           <div className="order-details">
                              <div className="order-block">
                               <p className="order-label">Order Number</p>
                               <p className="order-data">STS51-1701A</p>
                               </div>
                               <div className="order-block m-t-14">
                                <p className="order-label">Created</p>
                                <p className="order-data">02/23/2020 by <span>Atesh Hicks</span></p>
                               </div>
                               <div className="order-block m-t-14">
                                <p className="order-label">Revision</p>
                                <p className="order-data">2nd Revision</p>
                               </div>
                               <div className="order-block m-t-14">
                                <p className="order-label">Approval</p>
                                <p className="order-data"><i class="fas fa-check-circle"></i> Approved 03/05/2020</p>
                               </div>
                            </div> 
                        </div>
                    </div>
                </Section>
                {/* Main Address */}
                <Section className="w-full entry-block mt-5" title="advertiser">
                    <div class="flex-none sm:flex items-center">  
                        <div class="w-full sm:w-1/4 mr-5">
                            <Dropdown
                            className="w-full entry-dropdown"
                            label="Advertiser"
                            value={advertiser}
                            onChange={setAdvertiser}
                            options={["Advertiser Inc3.", "Advertiser Inc1.", "Advertiser Inc2."]}
                            />
                        </div>
                        <div class="w-full sm:w-1/4">
                        <Dropdown
                            className="w-full entry-dropdown m-t-20-mobile"
                            label="Advertiser Contact"
                            value={contact}
                            onChange={setContact}
                            options={["Mr. Contact", "Mr. Contact1", "Mr. Contact2"]}
                            />
                        </div>
                    </div>
                </Section>
                {/* Agency */}
                <Section className="w-full entry-block mt-5" title="agency">
                    <div class="flex-none sm:flex items-center"> 
                        <div class="w-full sm:w-1/4 mr-5">
                            <Dropdown
                            className="w-full entry-dropdown"
                            label="Agency"
                            value={agency}
                            onChange={setAgency}
                            options={["Agency Inc.", "Agency Inc.1", "Agency Inc.2"]}
                            />
                        </div>
                        <div class="w-full sm:w-1/4">
                        <Dropdown
                            className="w-full entry-dropdown m-t-20-mobile"
                            label="Agency Contact"
                            value={agencycontact}
                            onChange={setAgencyContact}
                            options={["Mr. Contact", "Mr. Contact1", "Mr. Contact2"]}
                            />
                        </div>
                    </div>
                </Section>
                {/* billing */}
                <Section className="w-full entry-block mt-5" title="billing">
                    <div class="flex-none sm:flex items-center">    
                        <div class="w-full sm:w-1/4 mr-5">
                            <Dropdown
                            className="w-full entry-dropdown"
                            label="Sales Contact"
                            value={sales}
                            onChange={setSales}
                            options={["Mrs. Contact", "Mrs. Contact1", "Mrs. Contact2"]}
                            />
                        </div>
                        <div class="w-full sm:w-1/4">
                        <Dropdown
                            className="w-full entry-dropdown m-t-20-mobile"
                            label="Bill To"
                            value={bill}
                            onChange={setBill}
                            options={["Bill Paying Inc.", "Bill Paying Inc.1", "Bill Paying Inc."]}
                            />
                        </div>
                    </div>
                </Section>
                {/* order items */}
                <div class="custom-section mt-5">
                    <div class="custom-section-header flex justify-between items-center">
                        <h4>order items</h4>
                        <a href="">+ ADD NEW ITEM</a>
                    </div>
                    <div class="custom-section-body">
                    <div class="orders-filter flex-none sm:flex justify-between items-center">
                            <TextBox
                                prependIcon="fas fa-search"
                                className="order-search"
                                placeholder="Search items"
                                defaultValue=""
                            />
                            <Dropdown
                                className="all-orders"
                                value={status}
                                onChange={setStatus}
                                options={["All statuses", "status1", "status2"]}
                            />
                        </div>
                        <div className="order-table order-view-table">
                        <Table cols="grid-cols-7 table-responsive">
                            <Row>
                            <HeaderCell>Order</HeaderCell>
                            <HeaderCell>Product</HeaderCell>
                            <HeaderCell>Campaign</HeaderCell>
                            <HeaderCell>Dates</HeaderCell>
                            <HeaderCell>Qt.</HeaderCell>
                            <HeaderCell>Qt.</HeaderCell>
                            <HeaderCell>Price</HeaderCell>
                            </Row>
                            <Row>
                            <LinkCell>Order #2</LinkCell>
                            <ItemCell className="text-blue-400">Placements</ItemCell>
                            <ItemCell className="text-blue-400">Lips of Faith</ItemCell>
                            <ItemCell>05/06/2021 - 07/07/2021</ItemCell>
                            <ItemCell>170</ItemCell>
                            <ItemCell>$1700.00</ItemCell>
                            <ItemCell className="light-gray-text"><span className="status"></span>Running</ItemCell>
                            </Row>
                            <Row>
                            <LinkCell>Order #3</LinkCell>
                            <ItemCell className="text-blue-400">Placements</ItemCell>
                            <ItemCell className="text-blue-400">Lips of Faith</ItemCell>
                            <ItemCell>05/06/2021 - 07/07/2021</ItemCell>
                            <ItemCell>60</ItemCell>
                            <ItemCell>$420.00</ItemCell>
                            <ItemCell className="light-gray-text"><span className="status"></span>Running</ItemCell>
                            </Row>
                            <Row>
                            <LinkCell>Order #1</LinkCell>
                            <ItemCell className="text-blue-400">Placements</ItemCell>
                            <ItemCell className="text-blue-400">Lips of Faith</ItemCell>
                            <ItemCell className="text-black">05/06/2021 - 07/07/2021</ItemCell>
                            <ItemCell>150</ItemCell>
                            <ItemCell>$1500.00</ItemCell>
                            <ItemCell className="light-gray-text"><span className="status"></span>Running</ItemCell>
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

export default OrderView
