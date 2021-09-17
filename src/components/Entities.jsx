import React, {useState} from 'react'
import Header from './UI-Components/Header'
import Sidebar from "./UI-Components/Sidebar";
import Footer from "./UI-Components/Footer";
import {
    Tab,
    TabBar,
    TextBox,
    Button,
    Dropdown,
    Pagination,
  } from "../core/components";
  import {
    Table,
    Row,
    ItemCell,
    HeaderCell,
    LinkCell,
  } from "../core/components";
const Entities = () => {
    const [tabIndex, setTabIndex] = React.useState(0);
    const [status, setStatus] = useState("All statuses")
    const [type, setType] = useState("All types")
    const handleTabIndexChange = (
        _event: React.ChangeEvent<{}>,
        newValue: number
      ) => {
        setTabIndex(newValue);
      };
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
                {/* Side Menu */}
                <div className="sidemenu">
                 <Sidebar/>
                </div>
                <div class="content-wrapper">
                    <div class="order-heading-block flex justify-between">
                        <h2 class="heading">Entities</h2>
                        <Button className="primary-btn"><i class="fas fa-plus-circle"></i>New Account</Button>
                    </div>
                    <div class="orders-block bg-white">
                       <TabBar
                        className="tabs-sctm"
                        onChange={handleTabIndexChange}
                        value={tabIndex}
                        >
                        <Tab>accounts</Tab>
                        <Tab>contacts</Tab>
                        </TabBar>
                        <div className="accounts">
                        <form action="" method="">
                            <div class="entities-filter sm:flex justify-between items-center">
                                <TextBox
                                    prependIcon="fas fa-search"
                                    className="order-search sm:w-3/6"
                                    placeholder="Search accounts"
                                    defaultValue=""
                                />
                                <Dropdown
                                    className="all-orders sm:w-3/12 sm:ml-4 m-t-20-mobile"
                                    value={type}
                                    onChange={setType}
                                    options={["All types", "Type1", "Type2"]}
                                />
                                <Dropdown
                                    className="all-orders sm:w-3/12 sm:ml-4 m-t-20-mobile"
                                    value={status}
                                    onChange={setStatus}
                                    options={["All statuses", "statuse1", "statuse2"]}
                                />
                            </div>
                        </form> 
                        <div className="order-table">
                  <Table cols="grid-cols-5">
                    <Row>
                      <HeaderCell className="col-span-2">Name</HeaderCell>
                      <HeaderCell>Type</HeaderCell>
                      <HeaderCell>Market</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                    </Row>
                    <Row>
                      <LinkCell className="col-span-2">New Belgium</LinkCell>
                      <ItemCell className="text-black"><span className="circle"></span>Advertiser</ItemCell>
                      <ItemCell className="text-black">NA-US</ItemCell>
                      <ItemCell className="text-gray-500"><span className="status"></span>Active </ItemCell>
                    </Row>
                    <Row>
                      <LinkCell className="col-span-2">Hill Farmstead</LinkCell>
                      <ItemCell className="text-black"><span className="circle"></span>Advertiser</ItemCell>
                      <ItemCell className="text-black">NA-US-NE</ItemCell>
                      <ItemCell className="text-gray-500"><span className="status paused"></span>On Hold </ItemCell>
                    </Row>
                    <Row>
                      <LinkCell className="col-span-2">Billups</LinkCell>
                      <ItemCell className="text-black"><span className="circle agency"></span>Agency</ItemCell>
                      <ItemCell className="text-black">NA-US</ItemCell>
                      <ItemCell className="text-gray-500"><span className="status complete"></span>Inactive </ItemCell>
                    </Row>
                    <Row>
                      <LinkCell className="col-span-2">Exterion</LinkCell>
                      <ItemCell className="text-black"><span className="circle seller"></span>Seller</ItemCell>
                      <ItemCell className="text-black">EMEA</ItemCell>
                      <ItemCell className="text-gray-500"><span className="status"></span>Active </ItemCell>
                    </Row>
                    <Row>
                      <LinkCell className="col-span-2">Riker Networks</LinkCell>
                      <ItemCell className="text-black"><span className="circle seller"></span>Seller</ItemCell>
                      <ItemCell className="text-black">Global</ItemCell>
                      <ItemCell className="text-gray-500"><span className="status"></span>Active </ItemCell>
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

export default Entities
