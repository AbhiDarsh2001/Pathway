// Header.jsx
import React from 'react';
import { Link } from "react-router-dom";
import './Header.css'; // Separate CSS file for the header

const Header = () => {
    return (
        <header className="header">
            <nav>
                <Link to="/home" style={ { textDecoration:'none', color:'#00000'}} className="nav-link">
                    Home
                </Link>
                <Link to="/about" style={{ textDecoration: 'none', color: '#000000' }} className="nav-link">
                    About Us
                </Link>
                <a href="/Ujoblist" className="nav-link">Job</a>
                <a href="/Ucourselist" className="nav-link">Course</a>
                <div className="search-bar">
                    <input type="text" placeholder="Search..." />
                </div>
                <Link to="/uprofile" style={{ textDecoration: 'none', color: '#000000' }} className="nav-link">
                    Profile
                </Link>
            </nav>
        </header>
    );
};

export default Header;