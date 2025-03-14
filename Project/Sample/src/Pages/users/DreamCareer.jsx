import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./DreamCareer.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const DreamCareer = () => {
  const [dreamJob, setDreamJob] = useState("");
  const [careerPath, setCareerPath] = useState(null);
  const [scores, setScores] = useState({
    extraversion: '',
    agreeableness: '',
    openness: '',
    neuroticism: '',
    conscientiousness: '',
    math: '',
    verbal: '',
    logic: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [academicDetails, setAcademicDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScores, setEditedScores] = useState({});

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch academic details
        const academicResponse = await axios.get(`${import.meta.env.VITE_URL}/vuprofile`, {
          headers: { Authorization: token }
        });
        setAcademicDetails(academicResponse.data.marks);

        // Fetch personality scores
        const personalityResponse = await fetch(
          `${import.meta.env.VITE_URL}/personal/results`,
          { headers: { Authorization: token } }
        );

        // Fetch aptitude scores
        const aptitudeResponse = await fetch(
          `${import.meta.env.VITE_URL}/aptitude/results`,
          { headers: { Authorization: token } }
        );

        if (personalityResponse.ok && aptitudeResponse.ok) {
          const personalityData = await personalityResponse.json();
          const aptitudeData = await aptitudeResponse.json();

          const personalityScores = personalityData.data.scores;
          let aptitudeScores = {
            math: 0,
            verbal: 0,
            logic: 0
          };

          if (aptitudeData.success && aptitudeData.data && aptitudeData.data.scores) {
            aptitudeScores = {
              math: aptitudeData.data.scores.math,
              verbal: aptitudeData.data.scores.verbal,
              logic: aptitudeData.data.scores.logic
            };
          }

          setScores({
            extraversion: (personalityScores.extraversion * 2.5).toString(),
            agreeableness: (personalityScores.agreeableness * 2.5).toString(),
            openness: (personalityScores.openness * 2.5).toString(),
            neuroticism: (personalityScores.neuroticism * 2.5).toString(),
            conscientiousness: (personalityScores.conscientiousness * 2.5).toString(),
            math: aptitudeScores.math.toFixed(2).toString(),
            verbal: aptitudeScores.verbal.toFixed(2).toString(),
            logic: aptitudeScores.logic.toFixed(2).toString()
          });
        } else {
          throw new Error('Failed to fetch scores');
        }
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Failed to fetch details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [token]);

  const handleInputChange = (event) => {
    setDreamJob(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!dreamJob.trim()) {
      alert("Please enter a valid career.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/getCareerPath`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          dreamJob,
          scores,
          academicDetails
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to fetch career path");
      }

      if (data.success && data.steps) {
        setCareerPath(data);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error fetching career path:", error);
      alert(error.message || "Failed to fetch career path. Please try again later.");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedScores(scores);
  };

  const handleScoreChange = (trait, value) => {
    // Ensure the value is between 0 and 100
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0), 100);
    setEditedScores(prev => ({
      ...prev,
      [trait]: numValue.toString()
    }));
  };

  const handleSaveScores = () => {
    setScores(editedScores);
    setIsEditing(false);
    // Store the manual test results in localStorage
    localStorage.setItem('manualTestResults', JSON.stringify({
      scores: editedScores,
      careerRecommendation: dreamJob || 'Not specified'
    }));
  };

  const handleHome = () => {
    navigate("/home");
  };
  
  const handleCourses = () => {
    navigate("/Ucourselist");
  };
  
  const handleTests = () => {
    navigate("/tests");
  };
  
  const handleBlogs = () => {
    navigate("/blogs");
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
        
        <div className="dream-career-content">
          <div className="welcome-section">
            <h2>Find Your Dream Career Path</h2>
            
            {isLoading ? (
              <div className="loading-indicator">Loading...</div>
            ) : (
              <>
                {error && <div className="error-message">{error}</div>}
                
                <div className="career-search-section">
                  <form onSubmit={handleSubmit} className="career-search-form">
                    <input
                      type="text"
                      placeholder="Enter your dream Career"
                      value={dreamJob}
                      onChange={handleInputChange}
                      className="career-input"
                    />
                    <button type="submit" className="action-button">Find Path</button>
                  </form>
                </div>

                <div className="career-info-cards">
                  {/* Scores Card */}
                  <div className="info-card">
                    <h3>Your Scores</h3>
                    {!isEditing ? (
                      <>
                        <div className="scores-list">
                          <div className="score-item">
                            <span>Extraversion:</span> {scores.extraversion}
                          </div>
                          <div className="score-item">
                            <span>Agreeableness:</span> {scores.agreeableness}
                          </div>
                          <div className="score-item">
                            <span>Openness:</span> {scores.openness}
                          </div>
                          <div className="score-item">
                            <span>Neuroticism:</span> {scores.neuroticism}
                          </div>
                          <div className="score-item">
                            <span>Conscientiousness:</span> {scores.conscientiousness}
                          </div>
                          <div className="score-item">
                            <span>Math:</span> {scores.math}
                          </div>
                          <div className="score-item">
                            <span>Verbal:</span> {scores.verbal}
                          </div>
                          <div className="score-item">
                            <span>Logic:</span> {scores.logic}
                          </div>
                        </div>
                        <button onClick={handleEditClick} className="action-button">Edit Scores</button>
                      </>
                    ) : (
                      <div className="edit-scores">
                        {Object.entries(editedScores).map(([trait, score]) => (
                          <div key={trait} className="score-input">
                            <label>{trait.charAt(0).toUpperCase() + trait.slice(1)}:</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={score}
                              onChange={(e) => handleScoreChange(trait, e.target.value)}
                            />
                          </div>
                        ))}
                        <div className="edit-buttons">
                          <button onClick={handleSaveScores}>Save</button>
                          <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Academic Details Card */}
                  {academicDetails && (
                    <div className="info-card">
                      <h3>Academic Information</h3>
                      <div className="academic-list">
                        {academicDetails.tenthMark > 0 && (
                          <div className="academic-item">
                            <span>10th Mark:</span> {academicDetails.tenthMark}%
                          </div>
                        )}
                        {academicDetails.twelthMark > 0 && (
                          <div className="academic-item">
                            <span>12th Mark:</span> {academicDetails.twelthMark}%
                          </div>
                        )}
                        {academicDetails.degreeMark > 0 && (
                          <div className="academic-item">
                            <span>Degree Mark:</span> {academicDetails.degreeMark}%
                          </div>
                        )}
                        {academicDetails.pgMark > 0 && (
                          <div className="academic-item">
                            <span>PG Mark:</span> {academicDetails.pgMark}%
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Career Path Results */}
                {careerPath && (
                  <div className="career-path-container">
                    <h2>Career Path: {dreamJob}</h2>
                    <div className="career-path-content">
                      {careerPath.steps.map((step, index) => {
                        // Updated function to convert text with asterisks to bold without showing asterisks
                        const formatText = (text) => {
                          if (!text) return '';
                          
                          // Replace **text** with bold elements
                          const parts = text.split(/(\*\*.*?\*\*)/g);
                          
                          return parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              // Extract just the text between ** and make it bold
                              const boldText = part.substring(2, part.length - 2);
                              return <strong key={i}>{boldText}</strong>;
                            }
                            return part;
                          });
                        };

                        // Check for section headers
                        if (step.includes('1. A step-by-step') || 
                            step.includes('2. Required qualifications') ||
                            step.includes('3. Skills') ||
                            step.includes('4. Potential challenges') ||
                            step.includes('5. Alternative careers')) {
                          return (
                            <div key={index} className="section-header">
                              <h3>{formatText(step.split('.')[1])}</h3>
                            </div>
                          );
                        }
                        
                        // Regular content
                        return (
                          <div key={index} className="career-step">
                            {step.startsWith('-') ? (
                              <li>{formatText(step.substring(1).trim())}</li>
                            ) : step.match(/^\d+\./) ? (
                              <div className="numbered-step">
                                <span className="step-number">{step.split('.')[0]}</span>
                                <span className="step-content">{formatText(step.split('.')[1])}</span>
                              </div>
                            ) : (
                              <p>{formatText(step)}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamCareer;
