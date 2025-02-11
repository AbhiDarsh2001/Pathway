import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TestResults.css';
import useAuth from '../../Components/Function/useAuth';

const TestResults = () => {
  useAuth(); // Add authentication check
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL}/personal/results`, 
        { headers: { Authorization: token } }
      );
      setResults(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch results');
      setLoading(false);
      if (error.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!results) return <div>No results found</div>;

  return (
    <div className="results-container">
      <h2>Your Personality Test Results</h2>
      
      <div className="traits-grid">
        {Object.entries(results.scores).map(([trait, score]) => (
          <div key={trait} className="trait-card">
            <h3>{trait}</h3>
            <div className="score-bar">
              <div 
                className="score-fill"
                style={{ width: `${(score / 40) * 100}%` }}
              />
            </div>
            <p className="score-value">{score}</p>
          </div>
        ))}
      </div>

      <div className="results-date">
        Test taken on: {new Date(results.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TestResults; 