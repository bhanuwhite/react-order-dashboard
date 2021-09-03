import React from "react";
import searchIcon from "../assets/imgs/search-icon.svg";
import Footer from "./UI-Components/Footer";
import Header from "./UI-Components/Header";
import Sidebar from "./UI-Components/Sidebar";
import {
  Button,
  Section,
  TextBox,
} from "../core/components";

const Home = () => {
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
                    <Button className="warning">4</Button>
                    <p className="orders-text">Errors</p>
                    <Button className="errors">0</Button>
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
              <Section
                  className="w-full revinue-forecast m-t-20"
                  title="revenue forecast"
                  infoLink={{
                    kind: "ext-link",
                    link: "",
                    title: "help",
                  }}
                >
                  <div className="p-5 text-gray-500 text-center">
                    <div class="revenue-surface">
                      <h1>CHART</h1>
                    </div>
                  </div>
                </Section>
              {/* Avg Revenue */}
              <Section
                  className="w-full revinue-forecast m-t-20"
                  title="avg. revenue/surface"
                  infoLink={{
                    kind: "ext-link",
                    link: "",
                    title: "help",
                  }}
                >
                  <div className="p-5 text-gray-500 text-center">
                    <div class="revenue-surface">
                      <h1>TBD?</h1>
                    </div>
                  </div>
                </Section>
               {/* Errors */}
               <Section
                  className="w-full revinue-forecast m-t-20"
                  title="errors"
                  infoLink={{
                    kind: "ext-link",
                    link: "",
                    title: "help",
                  }}
                >
                  <div className="p-5 text-gray-500 errors text-center">
                    <div class="revenue-surface">
                      <h3>No errors</h3>
                    </div>
                  </div>
                </Section>
               {/* Footer */}
              <div className="inside-footer">
              <Footer />
              </div>
          </div>
          </div>
         </div>
       </>
      );
    };
    
  export default Home;