import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TestResults.css';
import useAuth from '../../Components/Function/useAuth';

const TestResults = () => {
  useAuth();
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
      
      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError('No test results found');
      }
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch results');
      setLoading(false);
      if (error.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const getTraitDescription = (trait, score) => {
    const descriptions = {
      extraversion: score > 20 ? 'You are outgoing and energetic' : 'You are more reserved and reflective',
      agreeableness: score > 20 ? 'You are friendly and compassionate' : 'You are more analytical and detached',
      conscientiousness: score > 20 ? 'You are organized and responsible' : 'You are more flexible and spontaneous',
      neuroticism: score > 20 ? 'You tend to be more sensitive' : 'You are more emotionally stable',
      openness: score > 20 ? 'You are curious and creative' : 'You are more conventional and practical'
    };
    return descriptions[trait.toLowerCase()] || '';
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!results) return <div className="no-results">No results found</div>;

  return (
    <div className="results-container">
      <h2>Your Personality Test Results</h2>
      
      <div className="traits-grid">
        {Object.entries(results.scores).map(([trait, score]) => (
          // Skip math, verbal, and logic scores as they're from a different test
          !['math', 'verbal', 'logic'].includes(trait) && (
            <div key={trait} className="trait-card">
              <h3>{trait.charAt(0).toUpperCase() + trait.slice(1)}</h3>
              <div className="score-bar">
                <div 
                  className="score-fill"
                  style={{ width: `${(score / 40) * 100}%` }}
                />
              </div>
              <p className="score-value">{score}/40</p>
              <p className="trait-description">{getTraitDescription(trait, score)}</p>
            </div>
          )
        ))}
      </div>

      <div className="results-date">
        Test taken on: {new Date(results.timestamp).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TestResults; 