import React, {useState} from 'react'
import moment from "moment";
import Header from './UI-Components/Header'
import Sidebar from "./UI-Components/Sidebar";
import Footer from "./UI-Components/Footer";
import AddInventoryModal from "./UI-Components/AddInventoryModal";
import {
    Button,
    Section,
    Pagination,
    TextBox,
    Toggle,
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
  import { Modal } from "../core/components";

const ViewOrderLine = () => {
    const [status, setStatus] = useState("All statuses")
    const [category, setCategory] = useState("Lips")
    const [media, setMedia] = useState("Full Portrait")
    const [audience, setAudience] = useState("General Public")
    const [campaign, setCampaign] = useState("Lips of Faith")
    const [currency, setCurrency] = useState("USD")
    const [time, setTime] = useState("Hours")
    const [date, setDate] = useState(moment());
    const [endate, setEndate] = useState(moment());
    const [toggle1, setToggle1] = React.useState(false);
    const [modal1Open, setModal1Open] = useState(false);
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
                    <h2 class="heading">
                        <span>Orders</span><i class="fas fa-caret-right"></i><span>STS51-1701A</span>
                        <i class="fas fa-caret-right"></i>Order Item #1
                    </h2>
                </div>
                {/* ADD information */}
                <Section className="w-full add-info-block m-t-20" title="ad info">
                    <div class="row">
                        <div class="col-lg-8">
                            <div className="add-info-form">
                            <TextBox
                                className="entry-filed"
                                label="Name"
                                defaultValue="Myorderitem1"
                                invalid
                            />
                            <Dropdown
                            className="w-full entry-dropdown m-t-20"
                            label="Category"
                            value={category}
                            onChange={setCategory}
                            options={["Lips", "Category1", "Category2"]}
                            invalid
                            />
                            <div className="row">
                                <div class="col-lg-6">
                                <DatePicker
                                    className="w-full entry-dropdown m-t-20"
                                    label="Start Date"
                                    value={date}
                                    onChange={setDate}
                                    invalid
                                    />
                                </div>
                                <div class="col-lg-6">
                                <DatePicker
                                    className="w-full entry-dropdown m-t-20"
                                    label="End Date"
                                    value={endate}
                                    onChange={setEndate}
                                    invalid
                                    />
                                </div>
                            </div>
                                <Dropdown
                                className="w-full entry-dropdown m-t-20"
                                label="Media Type"
                                value={media}
                                onChange={setMedia}
                                options={["Full Portrait", "Landscape"]}
                                invalid
                                />
                                 <Dropdown
                                className="w-full entry-dropdown m-t-20"
                                label="Target Audience"
                                value={audience}
                                onChange={setAudience}
                                options={["General Public", "Private"]}
                                invalid
                                />
                                 <Dropdown
                                className="w-full entry-dropdown m-t-20"
                                label="Campaign"
                                value={campaign}
                                onChange={setCampaign}
                                options={["Lips of Faith", "Lips"]}
                                invalid
                                />
                            </div>
                        </div>
                        <div class="col-lg-4">
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
                {/* pricing & scheduling */}
                <div class="custom-section mt-4">
                    <div class="custom-section-header">
                        <h4>pricing & scheduling</h4>
                    </div>
                    <div class="custom-section-body">
                        <div class="row"> 
                            <div class="col-lg-3">
                            <div class="list-price">
                                <p class="listprice-label">Approval</p>
                                <p class="listprice-value">150,000<span>USD</span></p>
                            </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="price-input">
                                    <TextBox
                                        className="entry-filed"
                                        label="Line Price"
                                        defaultValue="150,000"
                                    />
                                    <Dropdown
                                        className="entry-dropdown"
                                        value={currency}
                                        onChange={setCurrency}
                                        options={["USD", "EUR", "GBP"]}
                                        invalid
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="custom-section-body plays">
                        <div class="plays-block">
                            <TextBox
                                    className="entry-filed w-25"
                                    defaultValue="150,000"
                                />
                                <span class="ml-3">every</span>
                                <TextBox
                                    className="entry-filed w-25 ml-3"
                                    defaultValue="150,000"
                                />
                                <Dropdown
                                    className="entry-dropdown w-25 ml-3"
                                    value={time} onChange={setTime} options={["Hours", "Minuties", "Secounds"]} />
                                <div class="toggle-btn">
                                <Toggle className="ml-3" value={toggle1} onChange={setToggle1} /><span class="ml-3">Guaranteed plays</span>
                                </div>
                        </div>
                    </div>
               </div>
                {/* creatives */}
                <div class="custom-section mt-4">
                    <div class="custom-section-header">
                        <h4>creatives</h4>
                        <a href="">+ ADD NEW ITEM</a>
                    </div>
                    <div class="custom-section-body">
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
                        <div className="products-table">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th class="sort">Item</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th></th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="blue-text">Creative #1</td>
                                    <td class="w-50">Primary creative</td>
                                    <td>HTML-based</td>
                                    <td class="blue-text">Visit</td>
                                    <td className="table-satus-text"><span className="status"></span>Approved</td>
                                </tr>
                                
                            </tbody>
                            </table>
                        </div> 
                        <div className="table-pagination bt-none">
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
                {/* inventory */}
                <div class="custom-section mt-4 inventory">
                    <div class="custom-section-header">
                        <h4>inventory</h4>
                        <a onClick={() => setModal1Open(true)}>+ ADD NEW ITEM</a>
                    </div>
                    <div class="custom-section-body">
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
                        <div className="order-table product-popup-table">
                        <Table cols="grid-cols-5">
                            <Row>
                            <HeaderCell>Item</HeaderCell>
                            <HeaderCell>Group</HeaderCell>
                            <HeaderCell>Target(s)</HeaderCell>
                            <HeaderCell>Market</HeaderCell>
                            <HeaderCell>Status</HeaderCell>
                            </Row>
                            <Row>
                            <LinkCell>Inventory #1</LinkCell>
                            <ItemCell>Cumberland Farms</ItemCell>
                            <ItemCell>All stores – Entrance Displays (HTML)</ItemCell>
                            <ItemCell>Boston, MA</ItemCell>
                            <ItemCell><span className="status"></span>Reserved</ItemCell>
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
                    <Modal
                      open={modal1Open}
                      onClose={() => setModal1Open(false)}
                      header={<h1 className="prducts-dialoge-header">Edit "Seoul/Lotte - 250 Plays/Screen"</h1>}
                      className="prducts-dialoge"
                  >
                    <AddInventoryModal/>
                    </Modal>
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

export default ViewOrderLine
