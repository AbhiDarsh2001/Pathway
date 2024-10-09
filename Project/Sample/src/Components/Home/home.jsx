// Home.jsx
import React from 'react';
import { Link } from "react-router-dom";
import './home.css'; // style a separate CSS file

const Home = () => {
    return (
      <div className="home-container">
        {/* Sidebar for categories */}
        <div className="sidebar">
          {/* Logo on Top-Left Corner */}
          <div className="logo-container">
            <img src="src/assets/Pathway_logo.png" alt="Career Pathway Logo" className="logo" />
          </div>
                <h2>Categories</h2>
                <ul className="category-list">
                    <li><input type="checkbox" /> UG</li>
                    <li><input type="checkbox" /> PG</li>
                    <li><input type="checkbox" /> Professional</li>
                    <li><input type="checkbox" /> Technical</li>
                    <li><input type="checkbox" /> Non-Tech</li>
                </ul>
            </div>

            {/* Main Content Area */}
      <div className="content" style={{ margin: '50px 0px 50px 250px' }}>
        <header className="header">
          {/* Logo or Picture on Top */}
          <div className="logo-container">
            {/* <img src="src/assets/Pathway_logo.png" alt="Career Pathway Logo" className="logo" /> */}
          </div>

          <nav>
            <Link to="/home" style={ { textDecoration:'none', color:'#00000'}}>
                Home
            </Link>
            <Link to="/" style={{ textDecoration: 'none', color: '#000000' }}>
                About Us
            </Link>
            <a href="/Ujoblist">Job</a>
            <a href="/Ucourselist">Course</a>
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div>
            <Link to="/uprofile" style={{ textDecoration: 'none', color: '#000000' }}>
                Profile
            </Link>
        </nav>
                </header>

                {/* Course Cards */}
                <div className="course-cards">
                    <div className="card">
                        <img src="src/assets/physics.webp" alt="Physics" />
                        <h3>B.Sc Physics</h3>
                        <p>Physics is the branch of science that deals with the study of matter and its fundamental interactions with the universe.</p>
                        <button>Details</button>
                    </div>

                    <div className="card">
                        <img src="src/assets/maths.jpg" alt="Mathematics" />
                        <h3>Bsc Mathematics</h3>
                        <p>Mathematics is a science of numbers and shapes that deals with the logic of shape, quantity, and arrangement.</p>
                        <button>Details</button>
                    </div>

                    <div className="card">
                        <img src="src/assets/chemistry.jpg" alt="Chemistry" />
                        <h3>B.Sc Chemistry</h3>
                        <p>Chemistry is the branch of science that deals with the study of substances and their properties, compositions, and reactions.</p>
                        <button>Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
