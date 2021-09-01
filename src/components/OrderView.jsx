import React, {useState} from 'react'
import moment from "moment";
import Header from './UI-Components/Header'
import Sidebar from "./UI-Components/Sidebar";
import Footer from "./UI-Components/Footer";
import Plus from "../assets/imgs/plus.png";
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
                <Section className="w-full add-info-block" title="ad info">
                    <div class="row">
                        <div class="col-lg-8">
                            <div className="add-info-form">
                            <TextBox
                                className="entry-filed"
                                label="Name"
                                defaultValue="Lips of Faith - Spring 2020"
                                invalid
                            />
                            <Dropdown
                            className="w-full entry-dropdown margin-tp"
                            label="Category"
                            value={category}
                            onChange={setCategory}
                            options={["Lips", "Category1", "Category2"]}
                            invalid
                            />
                            <div className="row">
                                <div class="col-lg-6">
                                <DatePicker
                                    className="w-full entry-dropdown margin-tp"
                                    label="Start Date"
                                    value={date}
                                    onChange={setDate}
                                    invalid
                                    />
                                </div>
                                <div class="col-lg-6">
                                <DatePicker
                                    className="w-full entry-dropdown margin-tp"
                                    label="End Date"
                                    value={endate}
                                    onChange={setEndate}
                                    invalid
                                    />
                                </div>
                            </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                           <div className="order-details">
                              <div className="order-block">
                               <p className="order-label">Order Number</p>
                               <p className="order-data">STS51-1701A</p>
                               </div>
                               <div className="order-block mt-14">
                                <p className="order-label">Created</p>
                                <p className="order-data">02/23/2020 by <span>Atesh Hicks</span></p>
                               </div>
                               <div className="order-block mt-14">
                                <p className="order-label">Revision</p>
                                <p className="order-data">2nd Revision</p>
                               </div>
                               <div className="order-block mt-14">
                                <p className="order-label">Approval</p>
                                <p className="order-data"><i class="fas fa-check-circle"></i> Approved 03/05/2020</p>
                               </div>
                            </div> 
                        </div>
                    </div>
                </Section>
                {/* Main Address */}
                <Section className="w-full entry-block" title="advertiser">
                    <div class="row">
                        
                        <div class="col-lg-3">
                            <Dropdown
                            className="w-full entry-dropdown"
                            label="Advertiser"
                            value={advertiser}
                            onChange={setAdvertiser}
                            options={["Advertiser Inc3.", "Advertiser Inc1.", "Advertiser Inc2."]}
                            invalid
                            />
                        </div>
                        <div class="col-lg-3">
                        <Dropdown
                            className="w-full entry-dropdown"
                            label="Advertiser Contact"
                            value={contact}
                            onChange={setContact}
                            options={["Mr. Contact", "Mr. Contact1", "Mr. Contact2"]}
                            invalid
                            />
                        </div>
                    </div>
                </Section>
                {/* Agency */}
                <Section className="w-full entry-block" title="agency">
                    <div class="row">
                        
                        <div class="col-lg-3">
                            <Dropdown
                            className="w-full entry-dropdown"
                            label="Agency"
                            value={agency}
                            onChange={setAgency}
                            options={["Agency Inc.", "Agency Inc.1", "Agency Inc.2"]}
                            invalid
                            />
                        </div>
                        <div class="col-lg-3">
                        <Dropdown
                            className="w-full entry-dropdown"
                            label="Agency Contact"
                            value={agencycontact}
                            onChange={setAgencyContact}
                            options={["Mr. Contact", "Mr. Contact1", "Mr. Contact2"]}
                            invalid
                            />
                        </div>
                    </div>
                </Section>
                {/* billing */}
                <Section className="w-full entry-block" title="billing">
                    <div class="row">
                        
                        <div class="col-lg-3">
                            <Dropdown
                            className="w-full entry-dropdown"
                            label="Sales Contact"
                            value={sales}
                            onChange={setSales}
                            options={["Mrs. Contact", "Mrs. Contact1", "Mrs. Contact2"]}
                            invalid
                            />
                        </div>
                        <div class="col-lg-3">
                        <Dropdown
                            className="w-full entry-dropdown"
                            label="Bill To"
                            value={bill}
                            onChange={setBill}
                            options={["Bill Paying Inc.", "Bill Paying Inc.1", "Bill Paying Inc."]}
                            invalid
                            />
                        </div>
                    </div>
                </Section>
                {/* order items */}
                <Section className="w-full entry-block" title="order items">
                <div class="orders-filter">
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
                        invalid
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
                      <ItemCell>Placements</ItemCell>
                      <ItemCell>Lips of Faith</ItemCell>
                      <ItemCell>05/06/2021 - 07/07/2021</ItemCell>
                      <ItemCell>170</ItemCell>
                      <ItemCell>$1700.00</ItemCell>
                      <ItemCell><span className="status"></span>Running</ItemCell>
                    </Row>
                    <Row>
                      <LinkCell>Order #3</LinkCell>
                      <ItemCell>Placements</ItemCell>
                      <ItemCell>Lips of Faith</ItemCell>
                      <ItemCell>05/06/2021 - 07/07/2021</ItemCell>
                      <ItemCell>60</ItemCell>
                      <ItemCell>$420.00</ItemCell>
                      <ItemCell><span className="status"></span>Running</ItemCell>
                    </Row>
                    <Row>
                      <LinkCell>Order #1</LinkCell>
                      <ItemCell>Placements</ItemCell>
                      <ItemCell>Lips of Faith</ItemCell>
                      <ItemCell className="text-black">05/06/2021 - 07/07/2021</ItemCell>
                      <ItemCell>150</ItemCell>
                      <ItemCell>$1500.00</ItemCell>
                      <ItemCell><span className="status"></span>Running</ItemCell>
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

export default OrderView
