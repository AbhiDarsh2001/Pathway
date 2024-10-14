// Header.jsx
import React from 'react';
import USearchEntrance from '../../Components/search/search'
import { Link, useNavigate } from "react-router-dom";
import './Header.css'; // Separate CSS file for the header

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user authentication data (if stored in localStorage/sessionStorage)
        const token = localStorage.removeItem('token'); // Example, modify according to your auth setup
        // Redirect to login page after logout
        navigate("/login");
    };

    return (
        <header className="header">
            <nav>
                <Link to="/home" style={{ textDecoration: 'none', color: '#000000' }} className="nav-link">
                    Home
                </Link>
                <Link to="/about" style={{ textDecoration: 'none', color: '#000000' }} className="nav-link">
                    About Us
                </Link>
                <a href="/Ujoblist" className="nav-link">Job</a>
                <a href="/Ucourselist" className="nav-link">Course</a>
                <USearchEntrance />
                <Link to="/uprofile" style={{ textDecoration: 'none', color: '#000000' }} className="nav-link">
                    Profile
                </Link>
                <button onClick={handleLogout} className="nav-link logout-button">
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default Header;
