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
          
          {/* Main Test Categories */}
          <div className="tests-grid">
            <div className="test-card">
              <h3>Personality Assessment</h3>
              <p>Discover your personality type and suitable career paths.</p>
              <div className="button-container">
                <Link to="/take-personality-test" className="test-button">Start Assessment</Link>
              </div>
            </div>
            
            <div className="test-card">
              <h3>Mock Test</h3>
              <p>Evaluate your skills and cognitive abilities.</p>
              <div className="button-container">
                <button className="test-button" onClick={handleStartTest}>Begin Test</button>
              </div>
            </div>
            
            <div className="test-card">
              <h3>Aptitude Test</h3>
              <p>Find career paths that match your interests.</p>
              <div className="button-container">
                <Link to="/take-aptitude-test" className="test-button">Take Test</Link>
              </div>
            </div>

            <div className="test-card">
              <h3>Manual Career Assessment</h3>
              <p>Input your scores manually for quick career suggestions</p>
              <div className="button-container">
                <Link to="/manual-career-test" className="test-button">Manual Input</Link>
              </div>
            </div>

            <div className="test-card">
              <h3>Select Your Dream Career</h3>
              <p>Explore and select your ideal career path</p>
              <div className="button-container">
                <Link to="/dreamcareer" className="test-button">Get Started</Link>
              </div>
            </div>
            
            {/* Additional test cards can be uncommented if needed */}
            {/*
            <div className="test-card">
              <h3>IQ Assessment</h3>
              <p>Test your problem-solving and analytical skills.</p>
              <div className="button-container">
                <button className="test-button">Start IQ Test</button>
              </div>
            </div>
            
            <div className="test-card">
              <h3>Emotional Intelligence</h3>
              <p>Measure your emotional intelligence quotient (EQ).</p>
              <div className="button-container">
                <button className="test-button">Begin EQ Test</button>
              </div>
            </div>
            
            <div className="test-card">
              <h3>Skills Assessment</h3>
              <p>Evaluate your technical and soft skills.</p>
              <div className="button-container">
                <button className="test-button">Start Assessment</button>
              </div>
            </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tests; 