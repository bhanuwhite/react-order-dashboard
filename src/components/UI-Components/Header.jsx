import React, {useState} from 'react'
import personImage from '../../assets/imgs/person-img.png';
import adEdgeLogo from "../../assets/imgs/logo2.svg";
import bellSvg from "../../assets/imgs/Alarm.svg";
import searchIcon from "../../assets/imgs/search-icon.svg";
import sidebarMenu from '../../assets/imgs/sidebar-menu.svg';
import Close from "../../assets/imgs/close.png";
import Sidebar from "../UI-Components/Sidebar";

const Header = () => {
    const [show, setShow] = useState(true);
    const handleSidebarShow = () => {
      setShow(!show);
    };
    return (
        <header>
        <div class="home-header">
            <div className="navbar-header">
              <img src={sidebarMenu} alt="sidebarMenuIcon"   className="navbar-toggle collapsed" onClick={handleSidebarShow}/>
              
              {/* Sidebar Mobile */}

              <div className={show ? "sidebar" : "sidebar-mobile"}>
                {/* Sidebar Header */}
               <div class="modile-header-block">
                  <div>
                    <img src={adEdgeLogo} alt="AdEdge Logo" class="logo"/>
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
                  <div>
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
                    </div>
                  <p class="copy-right"> @2 020 Veea Inc. All Rigts Reserved.</p>
                  <p>
                    VeeHub is a trademark of Veea Inc. All other trademarks and tradenames are the property of their respective
                    owners.
                  </p>
                </div>
                </div>
            </div>
            <div class="header-logo">
                <img src={adEdgeLogo} alt="AdEdge Logo" class="logo"/>
                <h3 class="logo-text mb-none">AdEdge Order Center</h3>
            </div>
            <div class="form-group has-search">
                <span class="form-control-feedback">
                        <img src={searchIcon} alt="serarch" />
                    </span>
                <input type="text" class="form-control" placeholder="Search orders,products and more" id="search"/>
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

    )
}

export default Header
