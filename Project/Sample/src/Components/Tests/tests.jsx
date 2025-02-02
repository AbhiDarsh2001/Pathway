import React from "react";
import "./tests.css";
import useAuth from "../Function/useAuth";
import Header from "../../Pages/users/Header";

const Tests = () => {
  useAuth();
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
        {/* Navigation links */}
        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item">Dashboard</a>
          <a href="/courses" className="nav-item">Courses</a>
          <a href="/tests" className="nav-item active">Psychometric Tests</a>
          <a href="/discussions" className="nav-item">Discussions</a>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="content">
        <Header />

        {/* Tests Section */}
        <div className="welcome-section">
          <h2>Psychometric & Aptitude Tests</h2>
          <div className="welcome-cards">
            {/* <div className="info-card">
              <h3>Personality Assessment</h3>
              <p>Discover your personality type and suitable career paths.</p>
              <button className="action-button">Start Assessment</button>
            </div> */}
            <div className="info-card">
              <h3>Aptitude Test</h3>
              <p>Evaluate your skills and cognitive abilities.</p>
              <button className="action-button">Begin Test</button>
            </div>
            {/* <div className="info-card">
              <h3>Career Interest Test</h3>
              <p>Find career paths that match your interests.</p>
              <button className="action-button">Take Test</button>
            </div> */}
          </div>

          {/* Additional Test Categories */}
          <div className="welcome-cards">
            {/* <div className="info-card">
              <h3>IQ Assessment</h3>
              <p>Test your problem-solving and analytical skills.</p>
              <button className="action-button">Start IQ Test</button>
            </div>
            <div className="info-card">
              <h3>Emotional Intelligence</h3>
              <p>Measure your emotional intelligence quotient (EQ).</p>
              <button className="action-button">Begin EQ Test</button>
            </div>
            <div className="info-card">
              <h3>Skills Assessment</h3>
              <p>Evaluate your technical and soft skills.</p>
              <button className="action-button">Start Assessment</button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests; 