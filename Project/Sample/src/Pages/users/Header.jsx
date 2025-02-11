// Header.jsx
import React, { useState } from 'react';
import USearchEntrance from '../../Components/search/search';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // Separate CSS file for the header

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear auth token
    navigate('/login'); // Redirect to login page
  };
 
  return (
    <header className="header">
      <nav>
        <Link to="/home" className="nav-link">Home</Link>
        {/* <Link to="/about" className="nav-link">About Us</Link> */}
        <a href="/Ujoblist" className="nav-link" id="viewjob">Job</a>
        <a href="/Ucourselist" className="nav-link" id="viewcourse">Course</a>
        <a href="/blogs" className="nav-link" id='viewblog'>Blog</a>
        <a href="/chatBot" className="nav-link" id='chatBot'>ChatBot</a>
        {/* <USearchEntrance /> */}

        {/* Profile with Hover Dropdown */}
        <div className="profile-container">
          <span className="nav-link profile-link" id="profile">Profile</span>

          <div className="profile-dropdown">
            <Link to="/uprofile" className="dropdown-option" >
              Profile
            </Link>
            <Link to="/add-blog" className="dropdown-option" id="addblog">
              ADD-Blog
            </Link>
            <button onClick={handleLogout} className="dropdown-option logout-button">
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
