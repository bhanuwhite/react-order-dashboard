import React, { useState } from "react";
import personImage from "../assets/imgs/person-img.png";
// import adEdgeLogo from "../assets/imgs/logo.png";
// import bellSvg from "../assets/imgs/Alarm.svg";
// import searchIcon from "../assets/imgs/search-icon.svg";
import homeIcon from "../assets/imgs/home-icon.svg";
import entities from "../assets/imgs/entities.svg";
import help from "../assets/imgs/help.svg";
/* eslint-disable jsx-a11y/anchor-is-valid */
// import personImage from '../assets/imgs/person-img.png';
import adEdgeLogo from "../assets/imgs/logo2.svg";
import bellSvg from "../assets/imgs/Alarm.svg";
import sidebarMenu from '../assets/imgs/sidebar-menu.svg'
import searchIcon from "../assets/imgs/search-icon.svg";

const Home = () => {
  const [show, setShow] = useState(true);
  const handleSidebarShow = () => {
    setShow(!show);
  };

  return (
    <div>
      {/* header */}
      <div className="topnav">
        <div className="navbar-header">
          <img src={sidebarMenu} alt="sidebarMenuIcon"   className="navbar-toggle collapsed"
            onClick={handleSidebarShow}/>
        </div>
     
        <div className="d-flex align-items-center inner-topnav">
          <img src={adEdgeLogo} alt="AdEdge Logo" className="inner-logo-img" />
          <a className="order-text" href="#home">
            AdEdge Order Center
          </a>
        </div>

        {/* <div className="search-container">
          <form action="" className="position-relative form-input">
            <img
              src={searchIcon}
              alt="alarm-logo"
              className="search-img position-absolute"
            />
            <input
              type="text"
              placeholder="Search orders,products and more"
              name="search"
              className="input-search pl-5"
            />
          </form>
        </div> */}
       
        <div className="d-flex align-items-center inner-wrapper">
          <a className="hicks-text">A. Hicks</a>
          <img src={personImage} alt="Avatar" className="avatar mr-2" />
          <img src={bellSvg} alt="alarm-logo" className="ml-1" />
        </div>
      </div>
      <hr className="mb-0 mt-0" />

      <form action="" className="position-relative responsive-seachbar">
        <img
          src={searchIcon}
          alt="alarm-logo"
          className="search-img position-absolute"
        />
        <input
          type="text"
          placeholder="Search orders,products and more"
          name="search"
          className="responsive-searchinput pl-5"
        />
      </form>

      {/* sidebar */}

      <div className="banner">
        <div className={show ? "sidebar" : "sidebar-none"}>
            
          <div className="btn-group">
            <a type="button" className="btn-text">
              Atesh's Group
            </a>
            <button
              type="button"
              className="btn btn-text ml-5 dropdown-toggle dropdown-toggle-split"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span className="sr-only">Toggle Dropdown</span>
            </button>
          </div>
          <div>
            <a href="#home" className="mt-3">
              <img src={homeIcon} alt="home-icon" className="mr-1 mb-1" /> Home
            </a>
            <a href="#services">
              <img
                src={help}
                alt="help-icon"
                className="mr-1 mb-1 dashboad-icons"
              />
              Orders
            </a>
            <a href="#clients">
              <img
                src={help}
                alt="help-icon"
                className="mr-1 mb-1 dashboad-icons"
              />{" "}
              Products
            </a>
            <a href="#contact">
              <img
                src={help}
                alt="help-icon"
                className="mr-1 mb-1 dashboad-icons"
              />{" "}
              Prices
            </a>
            <a href="#contact">
              <img
                src={help}
                alt="help-icon"
                className="mr-1 mb-1 dashboad-icons"
              />{" "}
              Reports
            </a>
            <a href="#contact">
              <img
                src={entities}
                alt="entities-icon"
                className="mr-1 mb-1 dashboad-icons"
              />{" "}
              Entities
            </a>
          </div>
          <div className="bottom-line">
            <a href="#contact" className="mt-3">
              <img
                src={entities}
                alt="entities-icon"
                className="mr-1 mb-1 dashboad-icons"
              />{" "}
              Settings
            </a>
            <a href="#contact">
              <img
                src={help}
                alt="help-icon"
                className="mr-1 mb-1 dashboad-icons"
              />{" "}
              Help
            </a>
          </div>
          <div className="d-flex align-items-center  logo-wrapper d-lg-none d-md-block d-sm-block">
            <div className="d-flex align-items-center inner-topnav">
              <img
                src={adEdgeLogo}
                alt="AdEdge Logo"
                className="inner-logo-img"
              />
              <a className="order-firm" href="#home">
                AdEdge Order Center
              </a>
              <button className="cross-icon ml-5" onClick={handleSidebarShow}>
                X
              </button>
            </div>
          </div>
        </div>
     
        <hr className="mb-0 mt-0" />

        {/* home main-content */}
        <div className="home-main-wrapper">
          <p className="inner-home-text">Home</p>

          <div className="d-flex align-items-center cards-wrapper">
            <div className="order-card">
              <div className="d-flex align-items-center inner-offer-card">
                <p className="mb-0 orders-text">Orders</p>
                <p className="mb-0 see-text">see all</p>
              </div>
            </div>
            <div className="occupancy-card">
              <center className="occupied-text">occupancy</center>
            </div>
            <div className="occupancy-card">
              <center className="occupied-text">availability</center>
            </div>
            <div className="occupancy-card">
              <center className="occupied-text">warnings</center>
              <button type="button" className="warn-btn ml-2">
                4
              </button>
              <center className="occupied-text">errors</center>
              <button type="button" className="error-btn ml-2">
                0
              </button>
            </div>
            <div className="order-card"></div>
          </div>
          <div className="revenue-card mt-3">
            <div className="d-flex inner-revenue-text">
              <p className="revenue-text mb-0">revenue forecast</p>
              <div className="question-icon">?</div>
            </div>
          </div>
          <div className="revenue-card mt-3">
            <div className="d-flex inner-revenue-text">
              <p className="revenue-text mb-0">avg. revenue/surface</p>
              <div className="question-icon">?</div>
            </div>
            <center className="mt-5 TBD-text">TBD?</center>
          </div>
          <div className="revenue-card mt-3">
            <div className="d-flex inner-revenue-text">
              <p className="revenue-text mb-0">errors</p>
              <div className="question-icon">?</div>
            </div>
            <div className="errors-banner">
              <center className="mt-5">No errors</center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
