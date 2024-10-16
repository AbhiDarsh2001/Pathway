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
        <Link to="/about" className="nav-link">About Us</Link>
        <a href="/Ujoblist" className="nav-link">Job</a>
        <a href="/Ucourselist" className="nav-link">Course</a>
        <USearchEntrance />

        {/* Profile with Hover Dropdown */}
        <div className="profile-container">
          <span className="nav-link profile-link">Profile</span>

          <div className="profile-dropdown">
            <Link to="/uprofile" className="dropdown-option">
              Edit Profile
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
