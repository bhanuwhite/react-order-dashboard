import React, {useState} from 'react'
import personImage from '../../assets/imgs/person-img.png';
import adEdgeLogo from "../../assets/imgs/logo2.svg";
import bellSvg from "../../assets/imgs/Alarm.svg";
import searchIcon from "../../assets/imgs/search-icon.svg";
import sidebarMenu from '../../assets/imgs/sidebar-menu.svg';
import Close from "../../assets/imgs/close.png";
import Sidebar from "../UI-Components/Sidebar";
import {
 TextBox,
} from "../../core/components";

const Header = () => {
  const [show, setShow] = useState(true);
  const handleSidebarShow = () => {
    setShow(!show);
  };
  return (
    <header>
      <div class="home-header flex justify-between items-center bg-white h-14">
          <div className="navbar-header sm:hidden">
            <img src={sidebarMenu} alt="sidebarMenuIcon"   className="navbar-toggle collapsed" onClick={handleSidebarShow}/>
            
            {/* Sidebar Mobile */}

            <div className={show ? "sidebar" : "sidebar-mobile"}>
              {/* Sidebar Header */}
              <div class="modile-header-block">
                <div>
                  <img src={adEdgeLogo} alt="AdEdge Logo" class="w-5"/>
                  <h3 class="logo-text">AdEdge Order Center</h3>
                </div>
                <div>
                  <img src={Close} alt="close" class="close" onClick={handleSidebarShow}/>
                </div>
              </div>

                {/* Sidebar body */}
                <Sidebar/>
                {/* Sidebar footer */}
              <div class="mobile-footer">                
              <ul class="widget-links">
                  <li>
                    <a href="">Terms of Use</a>
                  </li>
                  <li>
                    <a href="">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="">EULA</a>
                  </li>
                  <li>
                    <a href="">Limited Warranty</a>
                  </li>
                  <li >
                    <a href="">4G Faileovers Terms</a>
                  </li>
                </ul>
                <p class="copy-right"> @2020 Veea Inc. All Rigts Reserved.</p>
                <p>
                  VeeHub is a trademark of Veea Inc. All other trademarks and tradenames are the property of their respective
                  owners.
                </p>
              </div>
              </div>
          </div>
          <div class="header-logo w-1/3 flex items-center">
              <img src={adEdgeLogo} alt="AdEdge Logo" class="logo"/>
              <h3 class="logo-text mb-none">AdEdge Order Center</h3>
          </div>
          <TextBox
              prependIcon="fas fa-search"
              className="global-search mb-none w-1/3"
              placeholder="Search orders, products and more"
              defaultValue=""
            />
          <div class="notification-block w-1/3 flex justify-end items-center">
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

  )
}

export default Header
