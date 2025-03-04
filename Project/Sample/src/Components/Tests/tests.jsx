import React from "react";
import "./tests.css";
import useAuth from "../Function/useAuth";
import Header from "../../Pages/users/Header";
import { useNavigate, Link } from "react-router-dom";

const Tests = () => {
  useAuth();
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/testbox');
  };

  const handlepersonTest = () => {
    navigate('/take-personality-test');
  };

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
          <a href="/home" className="nav-item">Dashboard</a>
          <a href="/Ucourselist" className="nav-item">Courses</a>
          <a href="/tests" className="nav-item">Psychometric Tests</a>
          <a href="/blogs" className="nav-item">Discussions</a>
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
              <button className="action-button" onClick={handleStartTest}>Begin Test</button>
            </div>
            <div className="info-card">
              <h3>Personality Test</h3>
              <p>Find career paths that match your interests.</p>
              <Link to="/take-personality-test" className="action-button">Take Test</Link>
            </div>
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

        <div className="tests-container">
          <div className="tests-grid">
            <div className="test-card">
              <h3>Manual Career Assessment</h3>
              <p>Input your scores manually for quick career suggestions</p>
              <Link to="/manual-career-test" className="test-button" id="Manual Career Assessment" >
                Manual Input
              </Link>
            </div>
          </div>
          <div className="tests-grid">
            <div className="test-card">
              <h3>Select your dream Career</h3>
              <p>Input your scores</p>
              <Link to="/dreamcareer" className="test-button">
                Manual Input
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests; 