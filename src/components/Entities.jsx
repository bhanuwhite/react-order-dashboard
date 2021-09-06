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
            className="global-search mobile-filter"
            placeholder="Search orders, products and more"
            defaultValue=""
        /> 
        <div class="main-layout">
            <div class="main-conetnt">
                {/* Side Menu */}
                <div className="sidemenu">
                 <Sidebar/>
                </div>
                <div class="content-wrapper">
                    <div class="order-heading-block">
                        <h2 class="heading">Entities</h2>
                        <Button className="primary-btn"><i class="fas fa-plus-circle"></i>New Account</Button>
                    </div>
                    <div class="orders-block">
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
                            <div class="orders-filter">
                                <TextBox
                                    prependIcon="fas fa-search"
                                    className="order-search w-50"
                                    placeholder="Search accounts"
                                    defaultValue=""
                                />
                                <Dropdown
                                    className="all-orders"
                                    value={type}
                                    onChange={setType}
                                    options={["All types", "Type1", "Type2"]}
                                    invalid
                                />
                                <Dropdown
                                    className="all-orders"
                                    value={status}
                                    onChange={setStatus}
                                    options={["All statuses", "statuse1", "statuse2"]}
                                    invalid
                                />
                            </div>
                        </form> 
                        <div className="products-table">
                           <table class="table">
                                <thead>
                                    <tr>
                                        <th class="sort">Name</th>
                                        <th>Type</th>
                                        <th>Market</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="w-50 blue-text">New Belgium</td>
                                        <td><span class="circle"></span>Advertiser</td>
                                        <td>NA-US</td>
                                        <td className="table-satus-text"><span className="status"></span>Active</td>
                                    </tr>
                                    <tr>
                                        <td class="w-50 blue-text">Hill Farmstead</td>
                                        <td><span class="circle"></span>Advertiser</td>
                                        <td>NA-US-NE</td>
                                        <td className="table-satus-text"><span className="status paused"></span>On Hold</td>
                                    </tr>
                                    <tr>
                                        <td class="w-50 blue-text">Billups</td>
                                        <td><span class="circle agency"></span>Agency</td>
                                        <td>NA-US</td>
                                        <td className="table-satus-text"><span className="status complete"></span>Inactive</td>
                                    </tr>
                                    <tr>
                                        <td class="w-50 blue-text">Exterion</td>
                                        <td><span class="circle seller"></span>Seller</td>
                                        <td>EMEA</td>
                                        <td className="table-satus-text"><span className="status"></span>Active</td>
                                    </tr>
                                    <tr>
                                        <td class="w-50 blue-text">Riker Networks</td>
                                        <td><span class="circle seller"></span>Seller</td>
                                        <td>Global</td>
                                        <td className="table-satus-text"><span className="status"></span>Active</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="product-table-pagination">
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
