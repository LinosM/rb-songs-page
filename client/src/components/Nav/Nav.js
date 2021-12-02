import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import './Nav.css';
import keyboard_icon from '../../images/keyboard_icon.png';
import piano_icon from '../../images/piano-icon.png';

const Nav = (props) => {
  const location = useLocation();
  const [navActive, setNavActive] = useState(false);
  const [isTablet, setTablet] = useState(window.innerWidth > 1006);
  const updateMedia = () => {
    setTablet(window.innerWidth > 1006);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  // Untoggles the dropdown menu when the width becomes greater than 1006px
  useEffect(() => {
    if (isTablet) setNavActive(false)
  }, [isTablet])

  return (
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link
          to="/"
          className={
            location.pathname === "/"
              ? "navbar-item is-active"
              : "navbar-item"
          }
        >
          <img src={keyboard_icon} alt="Keyboard Icon" className="mr-2" /> Linos Rock Band
        </Link>
        <a
          role="button"
          className={`navbar-burger ${navActive ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={() => {
            setNavActive(!navActive)
          }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className={`navbar-menu ${navActive ? 'is-active is-centered' : ''}`}>

        <div className="navbar-start ">
        <Link
            to="/keys"
            className={
              location.pathname === "/keys"
                ? "navbar-item white is-active"
                : "navbar-item white"
            }
          >
            <span><img src={piano_icon} className="mr-2"></img></span>Keys
          </Link>

          <Link
            to="/about"
            className={
              location.pathname === "/about"
                ? "navbar-item white is-active"
                : "navbar-item white"
            }
          >
            <span><i className="far fa-address-card mr-2"></i></span>About
          </Link>
        </div>

        <div className="navbar-end">
          <a href="https://www.youtube.com/channel/UCSYvnKp-Ct8OVK9zqhb2lTQ" target="_blank" rel="noopener noreferrer" className="navbar-item">
            <i className={`fab fa-youtube ${navActive ? '' : 'fa-2x'} mr-2 white inlineBlock`} />
            <p className={`${navActive ? 'is-size-4' : 'is-size-3'} white inlineBlock`}>YouTube</p>
          </a>
        </div>

      </div>
    </nav>
  )
};

export default Nav;
