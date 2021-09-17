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
    const [modalnewpen, setModalnewpen] = useState(false);
    const [market, setMarket] = useState("All Markets");
    const [retailers, setRetailers] = useState("All Retailers");
    const [audiences, setAudiences] = useState("All Audiences");
    const [formats, setFormats] = useState("All Formats");
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
        {/*Orders Main Conetnt */}
        <div class="bg-clear-white">
            <div class="main-conetnt flex">
                {/* Side Bar */}
                <div className="sidemenu">
                <Sidebar/>
                </div>
                <div class="content-wrapper">
                <div class="order-heading-block sm:flex justify-between items-center">
                    <h2 class="heading">
                        <span>Orders</span><i class="fas fa-caret-right"></i><span>STS51-1701A</span>
                        <i class="fas fa-caret-right"></i>Order Item #1
                    </h2>
                </div>
                {/* ADD information */}
                <Section className="w-full add-info-block mt-5" title="ad info">
                    <div class="sm:flex justify-between">
                        <div class="w-full sm:w-3/4 p-5">
                            <TextBox
                                className="entry-filed"
                                label="Name"
                                defaultValue="Myorderitem1"
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
                                <Dropdown
                                className="w-full entry-dropdown mt-5"
                                label="Media Type"
                                value={media}
                                onChange={setMedia}
                                options={["Full Portrait", "Landscape"]}
                                />
                                 <Dropdown
                                className="w-full entry-dropdown mt-5"
                                label="Target Audience"
                                value={audience}
                                onChange={setAudience}
                                options={["General Public", "Private"]}
                                />
                                <div className="flex-none sm:flex justify-between items-center">
                                    <Dropdown
                                    className="sm:w-3/4 entry-dropdown mt-5"
                                    label="Campaign"
                                    value={campaign}
                                    onChange={setCampaign}
                                    options={["Lips of Faith", "Lips"]}
                                    />
                                    <span className="edit-campign">Edit campaign</span>
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
                {/* pricing & scheduling */}
                <div class="custom-section mt-5">
                    <div class="custom-section-header">
                        <h4 className="text-neutral-dark uppercase mb-0">pricing & scheduling</h4>
                    </div>
                    <div class="custom-section-body">
                        <div class="sm:flex"> 
                            <div class="sm:w-1/3">
                                <p class="listprice-label">Approval</p>
                                <p class="listprice-value">150,000<span>USD</span></p>
                            </div>
                            <div class="sm:w-1/3 m-t-20-mobile ">
                                <div class="price-input">
                                    <TextBox
                                        className="entry-filed "
                                        label="Line Price"
                                        defaultValue="150,000"
                                    />
                                    <Dropdown
                                        className="entry-dropdown"
                                        value={currency}
                                        onChange={setCurrency}
                                        options={["USD", "EUR", "GBP"]}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="custom-section-body plays">
                        <div class="plays-block sm:flex items-center justify-between">
                            <TextBox
                                    className="entry-filed sm:w-1/6 sm:mr-4"
                                    defaultValue="150,000"
                                />
                                <span class="sm:mr-4 m-t-20-mobile inline-block">every</span>
                                <TextBox
                                    className="entry-filed sm:w-1/6 sm:mr-4 m-t-20-mobile"
                                    defaultValue="150,000"
                                />
                                <Dropdown
                                    className="entry-dropdown sm:w-1/6 sm:mr-4 m-t-20-mobile"
                                    value={time} onChange={setTime} options={["Hours", "Minuties", "Secounds"]} />
                                <div class="toggle-btn m-t-20-mobile">
                                <Toggle className="ml-3" value={toggle1} onChange={setToggle1} /><span class="ml-3">Guaranteed plays</span>
                                </div>
                        </div>
                    </div>
               </div>
                {/* creatives */}
                <div class="custom-section mt-5">
                    <div class="custom-section-header flex justify-between items-center">
                        <h4 className="text-neutral-dark uppercase mb-0">creatives</h4>
                        <a href="">+ ADD NEW ITEM</a>
                    </div>
                    <div class="custom-section-body">
                    <div class="orders-filter sm:flex justify-between items-center">
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
                        <div className="order-table">
                            <Table cols="grid-cols-7">
                                <Row>
                                <HeaderCell>Item</HeaderCell>
                                <HeaderCell className="col-span-3">Description</HeaderCell>
                                <HeaderCell>Type</HeaderCell>
                                <HeaderCell></HeaderCell>
                                <HeaderCell>Status</HeaderCell>
                                </Row>
                                <Row>
                                <LinkCell className="blue-text">Creative #1</LinkCell>
                                <ItemCell  className="col-span-3">Primary creative</ItemCell>
                                <ItemCell>HTML-based</ItemCell>
                                <ItemCell className="blue-text">Visit</ItemCell>
                                <ItemCell className="light-gray-text"><span className="status"></span>Approved</ItemCell>
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
                {/* inventory */}
                <div class="custom-section mt-5 inventory">
                    <div class="custom-section-header flex justify-between items-center">
                        <h4 className="text-neutral-dark uppercase mb-0">inventory</h4>
                        <a onClick={() => setModalnewpen(true)}>+ ADD NEW ITEM</a>
                    </div>
                    <div class="custom-section-body">
                        <div class="orders-filter sm:flex justify-between items-center">
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
                        <div className="order-table">
                        <Table cols="grid-cols-6">
                            <Row>
                            <HeaderCell>Item</HeaderCell>
                            <HeaderCell>Group</HeaderCell>
                            <HeaderCell className="col-span-2">Target(s)</HeaderCell>
                            <HeaderCell>Market</HeaderCell>
                            <HeaderCell>Status</HeaderCell>
                            </Row>
                            <Row>
                            <LinkCell className="blue-text">Inventory #1</LinkCell>
                            <ItemCell>Cumberland Farms</ItemCell>
                            <ItemCell className="col-span-2">All stores – Entrance Displays (HTML)</ItemCell>
                            <ItemCell>Boston, MA</ItemCell>
                            <ItemCell className="light-gray-text"><span className="status"></span>Reserved</ItemCell>
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
                      open={modalnewpen}
                      onClose={() => setModalnewpen(false)}
                      header={<h1 className="prducts-dialoge-header">Add New Inventory</h1>}
                      className="prducts-dialoge"
                      sidebar={true}
                      sidebarHtml={
                      <div>
                            <Dropdown
                            className="w-full entry-dropdown"
                            label="Markets"
                            value={market}
                            onChange={setMarket}
                            options={["option1", "option2"]}
                            />
                            <Dropdown
                            className="w-full entry-dropdown mt-5"
                            label="Retailers"
                            value={retailers}
                            onChange={setRetailers}
                            options={["option1", "option2"]}
                            />
                            <Dropdown
                            className="w-full entry-dropdown mt-5"
                            label="Audiences"
                            value={audiences}
                            onChange={setAudiences}
                            options={["General Public", "Private"]}
                            />
                            <Dropdown
                            className="w-full entry-dropdown mt-5"
                            label="Formats"
                            value={formats}
                            onChange={setFormats}
                            options={["option1", "option2"]}
                            />
                            <a href="" className="clear-filters">clear filters</a>
                      </div>}
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
