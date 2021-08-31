import React from 'react'
import homeIcon from "../../assets/imgs/home.png";
import homeIconActive from "../../assets/imgs/home-active.png";
import settings from "../../assets/imgs/settings.png";
import settingsActive from "../../assets/imgs/settings-active.png";
import help from "../../assets/imgs/help.png";
import helpActive from "../../assets/imgs/prices-active.png";
import Orders from "../../assets/imgs/orders.png";
import OrdersActive from "../../assets/imgs/orders-active.png";
import Entities from "../../assets/imgs/entities.png";
import EntitiesActive from "../../assets/imgs/entities-active.png";
import Reports from "../../assets/imgs/reports.png";
import ReportsActive from "../../assets/imgs/reports-active.png";
import Products from "../../assets/imgs/products.png";
import ProductsActive from "../../assets/imgs/products-active.png";
import Prices from "../../assets/imgs/prices.png";
import PricesActive from "../../assets/imgs/prices-active.png";
const Sidebar = () => {
    return (
        <>
         {/* Select Dropsown */}
          <select class="custom-select" id="gender2">
              <option selected>Atesh's Group</option>
              <option value="1">Group</option>
              <option value="2">Group1</option>
            </select>
          <div class="divider mb-8"></div>
            {/* Side menu links */}
            <ul class="navbar-nav">
                <li class="navlink active">
                    <a href="#"><img src={homeIcon} alt="Home Page" class="nav-icons"/>
                    <img src={homeIconActive} alt="Home" class="nav-icons-active"/> Home</a>
                </li>
                <li class="navlink">
                    <a href="#"><img src={Orders} alt="Orders" class="nav-icons"/> 
                    <img src={OrdersActive} alt="Orders" class="nav-icons-active"/>Orders</a>
                </li>
                <li class="navlink">
                    <a href="#"><img src={Products} alt="Products" class="nav-icons"/> 
                    <img src={ProductsActive} alt="Products" class="nav-icons-active"/>Products</a>
                </li>
                <li class="navlink">
                    <a href="#"><img src={Prices} alt="Prices" class="nav-icons"/>
                    <img src={PricesActive} alt="Prices" class="nav-icons-active"/> Prices</a>
                </li>
                <li class="navlink">
                    <a href="#"><img src={Reports} alt="Reports" class="nav-icons"/>
                    <img src={ReportsActive} alt="Reports" class="nav-icons-active"/> Reports</a>
                </li>
                <li class="navlink">
                    <a href="#"><img src={Entities} alt="Entities" class="nav-icons"/>
                    <img src={EntitiesActive} alt="Entities" class="nav-icons-active"/> Entities</a>
                </li>
                <div class="divider mbt-8"></div>
                <li class="navlink">
                    <a href="#"><img src={settings} alt="Settings" class="nav-icons"/>
                    <img src={settingsActive} alt="Settings" class="nav-icons-active"/> Settings</a>
                </li>
                <li class="navlink">
                    <a href="#"><img src={help} alt="Help" class="nav-icons"/>
                    <img src={helpActive} alt="Help" class="nav-icons-active"/> Help</a>
                </li>
            </ul>
        </>
    )
}

export default Sidebar
