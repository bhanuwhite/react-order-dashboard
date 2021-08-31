import React, { useState } from "react";
import personImage from '../assets/imgs/person-img.png';
import adEdgeLogo from "../assets/imgs/logo2.svg";
import bellSvg from "../assets/imgs/Alarm.svg";
import searchIcon from "../assets/imgs/search-icon.svg";
import sidebarMenu from '../assets/imgs/sidebar-menu.svg';
import homeIcon from "../assets/imgs/home-icon.svg";
import settings from "../assets/imgs/settings.svg";
import help from "../assets/imgs/help.svg";

const Home = () => {
    const [show, setShow] = useState(true);
    const handleSidebarShow = () => {
      setShow(!show);
    };
  
    return (
      <div>
             {/* header */}
        <header>
              <div class="home-header">
              <div className="navbar-header">
            <img src={sidebarMenu} alt="sidebarMenuIcon"   className="navbar-toggle collapsed"
              onClick={handleSidebarShow}/>
          </div>
                  <div class="header-logo">
                      <img src={adEdgeLogo} alt="AdEdge Logo" />
                      <h3 class="logo-text mb-none">AdEdge Order Center</h3>
                  </div>

                  <div class="form-group has-search">
                      <span class="form-control-feedback">
                              <img src={searchIcon} alt="serarch" />
                          </span>
                      <input type="text" class="form-control" placeholder="Search orders,products and more" />
                  </div>
                  <div class="notification-block">
                      <span class="mb-none">A.Hicks</span>
                      <span class="mb-none">
                          <img src={personImage} alt="Avatar" class="user-profile"/>
                      </span>
                      <span>
                          <a href=""><img src={bellSvg} alt="alarm-logo" class="notification"/></a>
                      </span>
                  </div>
              </div>
      </header>
      <div class="form-group has-search mobile-filter">
        <span class="form-control-feedback">
                <img src={searchIcon} alt="serarch" />
            </span>
        <input type="text" class="form-control" placeholder="Search orders,products and more" />
    </div>
     {/* Main Conetnt */}
     <div class="main-layout">
            <div class="main-conetnt">
              <div class="sidemenu">
                <select class="custom-select" id="gender2">
                    <option selected>Atesh's Group</option>
                    <option value="1">Group</option>
                    <option value="2">Group1</option>
                  </select>
                <div class="divider mb-8"></div>
                  <ul class="navbar-nav">
                      <li class="navlink">
                          <a href="#"><img src={homeIcon} alt="Home Page" class="nav-icons"/> Home</a>
                      </li>
                      <li class="navlink">
                          <a href="#"><img src={homeIcon} alt="Home Page" class="nav-icons"/> Orders</a>
                      </li>
                      <li class="navlink">
                          <a href="#"><img src={homeIcon} alt="Home Page" class="nav-icons"/> Products</a>
                      </li>
                      <li class="navlink">
                          <a href="#"><img src={homeIcon} alt="Home Page" class="nav-icons"/> Reports</a>
                      </li>
                      <li class="navlink">
                          <a href="#"><img src={homeIcon} alt="Home Page" class="nav-icons"/> Entities</a>
                      </li>
                      <div class="divider mbt-8"></div>
                      <li class="navlink">
                          <a href="#"><img src={settings} alt="Home Page" class="nav-icons"/> Settings</a>
                      </li>
                      <li class="navlink">
                          <a href="#"><img src={help} alt="Home Page" class="nav-icons"/> Help</a>
                      </li>
                  </ul>
                </div>
            <div class="content-wrapper">
                <h2 class="heading">Home</h2>
                <div class="stats-block">
                  <div class="order-card">
                    <div class="order-card-text">
                    <p className="orders-text">Orders</p>
                    <p className="see-all">see all</p>
                    </div>
                  </div>
                  <div class="occupancy-block">
                    <div class="occupancy-card">
                      <p className="orders-text">Occupancy</p>
                      <div class="progress cstm-border">
                          <span class="title timer" data-from="0" data-to="70" data-speed="1800">70%</span>
                          <div class="overlay"></div>
                          <div class="left cstm-border"></div>
                          <div class="right cstm-border"></div>
                      </div>
                    </div>
                    <div class="occupancy-card">
                      <p className="orders-text">Availability</p>
                    
                    </div>
                    <div class="occupancy-card">
                      <p className="orders-text">Warnings</p>
                      <button className="warning">4</button>
                      <p className="orders-text">Errors</p>
                      <button className="errors">0</button>
                    </div>
                  </div>
                  <div class="order-card mb-none">
                     <div className="order-text-inside"><span class="number">38</span> <span class="text">total orders</span></div>
                     <div className="order-text-inside"><span class="number">8</span> <span class="text">total products</span></div>
                     <div className="order-text-inside"><span class="number">12</span> <span class="text">total entities</span></div>
                     <div className="order-text-inside"><span class="number">5</span> <span class="text">total prices</span></div>
                  </div>
                </div>
                <div class="revinue-forecast">
                  <div class="order-card-text">
                    <p className="orders-text">revenue forecast</p>
                    <p className="see-all">?</p>
                    </div>
                   
                </div>
                <div class="revinue-forecast">
                  <div class="order-card-text">
                    <p className="orders-text">avg. revenue/surface</p>
                    <p className="see-all">?</p>
                    </div>
                    <div class="revenue-surface">
                      <h1>TBD?</h1>
                   </div>
                </div>
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
            </div>
              </div>
                
            
        </div>
     </div>
    );
  };
  
export default Home;
