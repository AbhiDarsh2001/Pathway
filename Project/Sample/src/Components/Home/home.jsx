// Home.jsx
import React from "react";
import "./home.css"; // Style from a separate CSS file
import useAuth from "../Function/useAuth";
import FilterComponent from "../Filter/filter";
import Header from "../../Pages/users/Header";

const Home = () => {
  useAuth();
  return (
    <div className="home-container">
      {/* Sidebar for categories */}
      <div className="sidebar">
        {/* Logo on Top-Left Corner */}
        <div className="logo-container">
          <img
            src="src/assets/CareerPathway.png"
            alt="Career Pathway Logo"
            className="logo"
          />
        </div>
        {/* <div className="filter">
          <FilterComponent />
        </div> */}
      </div>

      {/* Main Content Area */}
      <div className="content" style={{ margin: "50px 0px 50px 250px" }}>
        <Header />

        {/* Welcome Section with Project Details */}
        <div className="welcome-section">
          <h2>Welcome to CareerPathway</h2>
          <p>
            CareerPathway is designed to assist students and professionals in
            making informed decisions about their education and career paths.
            Explore detailed information on various courses, job opportunities,
            and take mock psychometric tests to discover your strengths.
          </p>
          <p>
            You can browse course categories, search for specific programs, or
            connect with institutions and peers through articles and
            discussions. Start by filtering courses or exploring the blogs
            shared by others.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
