import React, {useState} from 'react'
import Header from './UI-Components/Header'
import Sidebar from "./UI-Components/Sidebar";
import Footer from "./UI-Components/Footer";
import {
  Button,
  Pagination,
  TextBox,
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

const Orders = () => {
  const [status, setStatus] = useState("All orders")
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
         <div class="main-conetnt flex">
            {/* Side Bar */}
            <div className="sidemenu">
            <Sidebar/>
            </div>
            <div class="content-wrapper">
                <div class="order-heading-block flex justify-between">
                    <h2 class="heading">Orders</h2>
                    <Button className="primary-btn"><i class="fas fa-plus-circle"></i>New Order</Button>
                </div>
                <div class="orders-block bg-white">
                  <form action="" method="">
                  <div class="orders-filter flex-none md:flex justify-between">
                      <TextBox
                        prependIcon="fas fa-search"
                        className="order-search"
                        placeholder="Search my orders"
                        defaultValue=""
                      />
                      <Dropdown
                        className="all-orders"
                        value={status}
                        onChange={setStatus}
                        options={["All orders", "Order1", "Order2"]}
                      />
                  </div>
                  </form> 
                  <div className="order-table orders-table-wrapper">
                  <Table cols="grid-cols-6">
                    <Row>
                      <HeaderCell>Order</HeaderCell>
                      <HeaderCell>Advertiser</HeaderCell>
                      <HeaderCell>Agency</HeaderCell>
                      <HeaderCell>Campaign</HeaderCell>
                      <HeaderCell>Delivery</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                    </Row>
                    <Row>
                      <LinkCell className="blue-text">STS51-1701A</LinkCell>
                      <ItemCell>New Belgium</ItemCell>
                      <ItemCell>Varick</ItemCell>
                      <ItemCell>Lips of Faith</ItemCell>
                      <ItemCell>
                        <div className="progress">
                            <div className="progress-bar"></div>
                        </div>
                      </ItemCell>
                      <ItemCell className="light-gray-text"><span className="status"></span>Running</ItemCell>
                    </Row>
                    <Row>
                      <LinkCell  className="blue-text">STS51-1701B</LinkCell>
                      <ItemCell>IPG</ItemCell>
                      <ItemCell>A very long</ItemCell>
                      <ItemCell>Society & Solitude</ItemCell>
                      <ItemCell>
                         <div className="progress">
                            <div className="progress-bar"></div>
                         </div>
                      </ItemCell>
                      <ItemCell className="light-gray-text"><span className="status paused"></span>Paused</ItemCell>
                    </Row>
                    <Row>
                      <LinkCell className="blue-text">STS51-1701C</LinkCell>
                      <ItemCell>Carat</ItemCell>
                      <ItemCell>Boulevard</ItemCell>
                      <ItemCell>Another very long</ItemCell>
                      <ItemCell>
                      <div className="progress">
                            <div className="progress-bar"></div>
                         </div>
                      </ItemCell>
                      <ItemCell  className="light-gray-text"><span className="status complete"></span>Completed</ItemCell>
                    </Row>
                    <Row>
                      <LinkCell className="blue-text">STS51-1701D</LinkCell>
                      <ItemCell>Billups</ItemCell>
                      <ItemCell>Foam & Foam Inc.</ItemCell>
                      <ItemCell>Togetherness</ItemCell>
                      <ItemCell>
                      <div className="progress">
                            <div className="progress-bar"></div>
                         </div>
                      </ItemCell>
                      <ItemCell className="light-gray-text"><span className="status"></span>Running</ItemCell>
                    </Row>
                    <Row>
                      <LinkCell className="blue-text">STS51-1701E</LinkCell>
                      <ItemCell>-</ItemCell>
                      <ItemCell>Zero Gravity</ItemCell>
                      <ItemCell>Mr. Sulu</ItemCell>
                      <ItemCell>
                      <div className="progress">
                            <div className="progress-bar"></div>
                         </div>
                      </ItemCell>
                      <ItemCell className="light-gray-text"><span className="status"></span>Active</ItemCell>
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

export default Orders
