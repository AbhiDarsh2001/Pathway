// Home.jsx
import React from "react";
import "./home.css"; // Style from a separate CSS file
import useAuth from "../Function/useAuth";
import FilterComponent from "../Filter/filter";
import Header from "../../Pages/users/Header";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useAuth();

  const navigate = useNavigate();

  const handleviewcourse = () => {
    navigate("/Ucourselist");
  }
  const handletest = () => {
    navigate("/tests");
  }
  const handleblog = () => {
    navigate("/blogs");
  }
  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img
            src="src/assets/CareerPathway.png"
            alt="Career Pathway Logo"
            className="logo"
          />
        </div>
        {/* Add navigation links */}
        <nav className="sidebar-nav">
          <a href="/home" className="nav-item">Dashboard</a>
          <a href="/Ucourselist" className="nav-item">Courses</a>
          <a href="/tests" className="nav-item">Psychometric Tests</a>
          <a href="/blogs" className="nav-item">Discussions</a>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="content">
        <Header />

        {/* Welcome Section with enhanced styling */}
        <div className="welcome-section">
          <h2>Welcome to CareerPathway</h2>
          <div className="welcome-cards">
            <div className="info-card">
              <h3>Explore Courses</h3>
              <p>Browse through our extensive collection of courses and educational programs.</p>
              <button className="action-button" onClick={handleviewcourse}>View Courses</button>
            </div>
            <div className="info-card">
              <h3>Take Tests</h3>
              <p>Discover your strengths with our psychometric tests.</p>
              <button className="action-button" onClick={handletest}>Take Test</button>
            </div>
            <div className="info-card">
              <h3>Join Discussions</h3>
              <p>Connect with peers and share your experiences.</p>
              <button className="action-button" onClick={handleblog}>join now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
