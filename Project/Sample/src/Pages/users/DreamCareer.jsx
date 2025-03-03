import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./DreamCareer.css";

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
      const response = await fetch("/api/getCareerPath", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dreamJob }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch career path");
      }

      const data = await response.json();
      setCareerPath(data);
    } catch (error) {
      console.error("Error fetching career path:", error);
      alert("Failed to fetch career path. Please try again later.");
    }
  };

  return (
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
            <div className="career-path">
              <h3>Career Path for {dreamJob}:</h3>
              <ul>
                {careerPath.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="scores-display">
            <h3>Your Scores</h3>
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
  );
}; 

export default DreamCareer;
