import React, { Fragment } from "react";
import { Link } from 'react-router-dom';
import './Nav.css';
import keyboard_icon from '../../images/keyboard_icon.png'

const Nav = (props) => {
  return (
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a href="/" className="navbar-item">
          <img src={keyboard_icon} className="mr-2"/> Linos Rock Band
        </a>
      </div>
    </nav>
  )
};

export default Nav;
