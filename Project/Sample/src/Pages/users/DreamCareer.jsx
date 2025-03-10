import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./DreamCareer.css";
import USidebar from "./Usidebar";
import Header from "./Header";

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
          `${import.meta.env.VITE_URL}/test/results/${localStorage.getItem('email')}`,
          { headers: { Authorization: token } }
        );

        if (personalityResponse.ok && aptitudeResponse.ok) {
          const personalityData = await personalityResponse.json();
          const aptitudeData = await aptitudeResponse.json();

          const personalityScores = personalityData.data.scores;
          const aptitudeScores = {
            math: 0,
            verbal: 0,
            logic: 0
          };

          aptitudeData.forEach(result => {
            if (result.testId && result.testId.title) {
              const percentage = (result.score / result.testId.totalMarks) * 100;
              const title = result.testId.title.toLowerCase();

              if (title.includes('math')) {
                aptitudeScores.math = percentage;
              } else if (title.includes('verbal')) {
                aptitudeScores.verbal = percentage;
              } else if (title.includes('logic')) {
                aptitudeScores.logic = percentage;
              }
            }
          });

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

  return (
    <div className="home-container">
      {/* <USidebar /> */}
      <div className="main-content">
        <Header />
        <div className="dream-career-container">
          <h2>Find Your Dream Career Path</h2>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Enter your dream job"
                  value={dreamJob}
                  onChange={handleInputChange}
                />
                <button type="submit">Find Path</button>
              </form>
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
              <div className="scores-display">
                <h3>Your Scores</h3>
                {!isEditing ? (
                  <>
                    <ul>
                      <li>Extraversion: {scores.extraversion}</li>
                      <li>Agreeableness: {scores.agreeableness}</li>
                      <li>Openness: {scores.openness}</li>
                      <li>Neuroticism: {scores.neuroticism}</li>
                      <li>Conscientiousness: {scores.conscientiousness}</li>
                      <li>Math: {scores.math}</li>
                      <li>Verbal: {scores.verbal}</li>
                      <li>Logic: {scores.logic}</li>
                    </ul>
                    <button onClick={handleEditClick}>Edit Scores</button>
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
              {academicDetails && (
                <div className="academic-details">
                  <h3>Academic Information</h3>
                  <ul>
                    {academicDetails.tenthMark > 0 && <li>10th Mark: {academicDetails.tenthMark}%</li>}
                    {academicDetails.twelthMark > 0 && <li>12th Mark: {academicDetails.twelthMark}%</li>}
                    {academicDetails.degreeMark > 0 && <li>Degree Mark: {academicDetails.degreeMark}%</li>}
                    {academicDetails.pgMark > 0 && <li>PG Mark: {academicDetails.pgMark}%</li>}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DreamCareer;
