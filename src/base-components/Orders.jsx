import React from 'react'
import Header from './UI-Components/Header'
import Sidebar from "./UI-Components/Sidebar";
import Footer from "../base-components/Footer";
import searchIcon from "../assets/imgs/search-icon.svg";
import Plus from "../assets/imgs/plus.png";

const Orders = () => {
    return (
    <>
      {/* header */}
      <Header/>
      {/* Search filter for mobile */}
      <div class="form-group has-search mobile-filter">
        <span class="form-control-feedback">
                <img src={searchIcon} alt="serarch" />
            </span>
        <input type="text" class="form-control" placeholder="Search orders,products and more" />
      </div>
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
                    <button class="primary-btn"><img src={Plus} alt="plus" />New Order</button>
                </div>
                <div class="orders-block">
                  
                        <form action="" method="">
                        <div class="orders-filter">
                        <div class="form-group search-orders">
                            <span class="form-control-feedback">
                             <img src={searchIcon} alt="Search" />
                            </span>
                            <input type="text" class="form-control" placeholder="Search orders,products and more" id="search-orders"/>
                        </div>
                        <div class="form-group all-orders">
                            <select class="form-control" id="All_orders">
                            <option>All orders</option>
                            <option>Orders1</option>
                            <option>Orders2</option>
                            </select>
                        </div>
                        </div>
                        </form>
                    
                </div>
              
              {/* Footer */}
              <Footer />
            </div>
         </div>
       </div>
    </>
    )
}

export default Orders
