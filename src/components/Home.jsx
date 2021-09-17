import React from "react";
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
        <Header/>
        {/*Global Search mobile */}
        <TextBox
          prependIcon="fas fa-search"
          className="mobile-filter sm:hidden"
          placeholder="Search orders, products and more"
          defaultValue=""
        />
       <div class="bg-clear-white">
         <div class="main-conetnt flex">
           {/* Side Bar */}
           <div className="sidemenu">
            <Sidebar/>
            </div>
            {/* Home Content */}
            <div class="content-wrapper">
              <h2 class="heading">Home</h2>
              <div class="stats-block flex-none sm:flex justify-between mt-5">
                {/* Orders */}
                <div class="order-card bg-white">
                  <div class="order-card-text flex justify-between">
                  <p className="orders-text text-neutral-dark uppercase mb-0">Orders</p>
                  <p className="see-all text-primary uppercase mb-0">see all</p>
                  </div>
                </div>
              
                <div class="occupancy-block flex justify-between">
                    {/* Occupancy */}
                  <div class="occupancy-card bg-white">
                    <p className="orders-text text-neutral-dark uppercase mb-0">Occupancy</p>
                  </div>
                    {/* Availability */}
                  <div class="occupancy-card bg-white p-4">
                    <p className="orders-text text-neutral-dark uppercase mb-0">Availability</p>
                  
                  </div>
                  {/* Warnings */}
                  <div class="occupancy-card bg-white">
                    <p className="orders-text text-neutral-dark uppercase mb-0">Warnings</p>
                    <Button className="warning">4</Button>
                    <p className="orders-text text-neutral-dark uppercase mb-0">Errors</p>
                    <Button className="errors">0</Button>
                  </div>
                </div>
                {/* Total Records */}
                <div class="order-card mb-none bg-white">
                    <div className="order-text-inside flex justify-between items-center"><span class="number text-primary mr-6">38</span> <span class="text">total orders</span></div>
                    <div className="order-text-inside flex justify-between items-center"><span class="number text-primary mr-6">8</span> <span class="text">total products</span></div>
                    <div className="order-text-inside flex justify-between items-center"><span class="number text-primary mr-6">12</span> <span class="text">total entities</span></div>
                    <div className="order-text-inside flex justify-between items-center"><span class="number text-primary mr-6">5</span> <span class="text">total prices</span></div>
                </div>
              </div>
              {/* Revenue Forecast */}
              <Section
                  className="w-full revinue-forecast mt-5"
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
                  className="w-full revinue-forecast mt-5"
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
                  className="w-full revinue-forecast mt-5"
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