import React from 'react';
import personImage from '../assets/imgs/person-img.png';
import adEdgeLogo from "../assets/imgs/logo.png";
import bellSvg from "../assets/imgs/Alarm.svg";
import searchIcon from "../assets/imgs/search-icon.svg";


const Home = () => {
    return (
        /* header */
        <div className="topnav">
            <div className="d-flex align-items-center inner-topnav">
                <img src={adEdgeLogo} alt="AdEdge Logo" className="inner-logo-img" />
                <a className="order-text" href="#home">AdEdge Order Center</a>
            </div>
            <div className="search-container">
                <form action="" className="position-relative">
                    <img src={searchIcon} alt="alarm-logo" className="search-img position-absolute" />
                    <input type="text" placeholder="Search orders,products and more" name="search" className="input-search pl-5"/>
                </form>
            </div>
            <div className="d-flex align-items-center inner-wrapper">
                <a className="hicks-text">A. Hicks</a>
                <img src={personImage} alt="Avatar" className="avatar mr-2" />
                <img src={bellSvg} alt="alarm-logo" className="ml-1" />
            </div>
        </div>

    );
};

export default Home;
