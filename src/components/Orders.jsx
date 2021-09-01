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
         <div class="main-conetnt">
            {/* Side Bar */}
            <div className="sidemenu">
            <Sidebar/>
            </div>
            <div class="content-wrapper">
                <div class="order-heading-block">
                    <h2 class="heading">Orders</h2>
                    <Button className="primary-btn"><i class="fas fa-plus-circle"></i>New Order</Button>
                </div>
                <div class="orders-block">
                  <form action="" method="">
                  <div class="orders-filter">
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
                        invalid
                      />
                  </div>
                  </form> 
                  <div className="order-table">
                  <Table cols="grid-cols-6 table-responsive">
                    <Row>
                      <HeaderCell>Order</HeaderCell>
                      <HeaderCell>Advertiser</HeaderCell>
                      <HeaderCell>Agency</HeaderCell>
                      <HeaderCell>Campaign</HeaderCell>
                      <HeaderCell>Delivery</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                    </Row>
                    <Row>
                      <LinkCell>STS51-1701A</LinkCell>
                      <ItemCell>New Belgium</ItemCell>
                      <ItemCell>Varick</ItemCell>
                      <ItemCell>Lips of Faith</ItemCell>
                      <ItemCell>
                      <div class="progress">
                        <div class="progress-bar w-75" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      </ItemCell>
                      <ItemCell><span className="status"></span>Running</ItemCell>
                    </Row>
                    <Row>
                      <LinkCell>STS51-1701B</LinkCell>
                      <ItemCell>IPG</ItemCell>
                      <ItemCell>A very long</ItemCell>
                      <ItemCell>Society & Solitude</ItemCell>
                      <ItemCell>
                      <div class="progress">
                        <div class="progress-bar w-50" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      </ItemCell>
                      <ItemCell><span className="status paused"></span>Paused</ItemCell>
                    </Row>
                    <Row>
                      <LinkCell>STS51-1701C</LinkCell>
                      <ItemCell>Carat</ItemCell>
                      <ItemCell>Boulevard</ItemCell>
                      <ItemCell>Another very long</ItemCell>
                      <ItemCell>
                      <div class="progress">
                        <div class="progress-bar w-100" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      </ItemCell>
                      <ItemCell><span className="status complete"></span>Completed</ItemCell>
                    </Row>
                    <Row>
                      <LinkCell>STS51-1701D</LinkCell>
                      <ItemCell>Billups</ItemCell>
                      <ItemCell>Foam & Foam Inc.</ItemCell>
                      <ItemCell>Togetherness</ItemCell>
                      <ItemCell>
                      <div class="progress">
                        <div class="progress-bar w-50" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      </ItemCell>
                      <ItemCell><span className="status"></span>Running</ItemCell>
                    </Row>
                    <Row>
                      <LinkCell>STS51-1701E</LinkCell>
                      <ItemCell>-</ItemCell>
                      <ItemCell>Zero Gravity</ItemCell>
                      <ItemCell>Mr. Sulu</ItemCell>
                      <ItemCell>
                      <div class="progress">
                        <div class="progress-bar w-25" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      </ItemCell>
                      <ItemCell><span className="status"></span>Active</ItemCell>
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