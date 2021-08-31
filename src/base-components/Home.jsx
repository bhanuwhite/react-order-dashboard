import React, { useState } from "react";
import searchIcon from "../assets/imgs/search-icon.svg";
import Footer from "../base-components/Footer";
import Header from "./UI-Components/Header";
import Sidebar from "./UI-Components/Sidebar";

const Home = () => {
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
      {/* Home Main Conetnt */}
     <div class="main-layout">
       <div class="main-conetnt">
         {/* Side Bar */}
         <div className="sidemenu">
          <Sidebar/>
          </div>
          <div class="content-wrapper">
            <h2 class="heading">Home</h2>
             {/* Stats */}
            <div class="stats-block">
              {/* Orders */}
              <div class="order-card">
                <div class="order-card-text">
                <p className="orders-text">Orders</p>
                <p className="see-all">see all</p>
                </div>
              </div>
            
              <div class="occupancy-block">
                  {/* Occupancy */}
                <div class="occupancy-card">
                  <p className="orders-text">Occupancy</p>
                  <div class="progress cstm-border">
                      <span class="title timer" data-from="0" data-to="70" data-speed="1800">70%</span>
                      <div class="overlay"></div>
                      <div class="left cstm-border"></div>
                      <div class="right cstm-border"></div>
                  </div>
                </div>
                  {/* Availability */}
                <div class="occupancy-card">
                  <p className="orders-text">Availability</p>
                
                </div>
                {/* Warnings */}
                <div class="occupancy-card">
                  <p className="orders-text">Warnings</p>
                  <button className="warning">4</button>
                  <p className="orders-text">Errors</p>
                  <button className="errors">0</button>
                </div>
              </div>
              {/* Total Records */}
              <div class="order-card mb-none">
                  <div className="order-text-inside"><span class="number">38</span> <span class="text">total orders</span></div>
                  <div className="order-text-inside"><span class="number">8</span> <span class="text">total products</span></div>
                  <div className="order-text-inside"><span class="number">12</span> <span class="text">total entities</span></div>
                  <div className="order-text-inside"><span class="number">5</span> <span class="text">total prices</span></div>
              </div>
            </div>
            {/* Revenue Forecast */}
            <div class="revinue-forecast">
              <div class="order-card-text">
                <p className="orders-text">revenue forecast</p>
                <p className="see-all">?</p>
                </div>   
            </div>
            {/* Avg Revenue */}
            <div class="revinue-forecast">
              <div class="order-card-text">
                <p className="orders-text">avg. revenue/surface</p>
                <p className="see-all">?</p>
                </div>
                <div class="revenue-surface">
                  <h1>TBD?</h1>
                </div>
            </div>
             {/* Errors */}
            <div class="revinue-forecast">
              <div class="order-card-text">
                <p className="orders-text">errors</p>
                <p className="see-all">?</p>
                </div>
                <div class="inside-errors">
                  <div class="error-block">
                  <p>No Errors</p>
                  </div>
                </div>
            </div>
             {/* Footer */}
            <Footer />
        </div>
        </div>
       </div>
     </>
    );
  };
  
export default Home;
