import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './CareerSuggestions.css';
import Header from './Header';
import useAuth from '../../Components/Function/useAuth';

const CareerSuggestions = () => {
    useAuth(); // Use the same authentication hook
    const [personalityScores, setPersonalityScores] = useState(null);
    const [careerSuggestion, setCareerSuggestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isDefaultScores, setIsDefaultScores] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const manualResults = localStorage.getItem('manualTestResults');
        
        if (manualResults) {
            const results = JSON.parse(manualResults);
            setPersonalityScores(results.scores);
            setCareerSuggestion(results.careerRecommendation);
            setIsDefaultScores(false);
            setLoading(false);
            // Clear the results after loading
            localStorage.removeItem('manualTestResults');
            return;
        }

        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // First fetch user profile to get email
                const userResponse = await axios.get(`${import.meta.env.VITE_URL}/vuprofile`, {
                    headers: { Authorization: token }
                });
                console.log('User profile:', userResponse.data); // Debug log
                setUser(userResponse.data);

                // Fetch personality test results
                console.log('Fetching results for email:', userResponse.data.email); // Debug log
                const response = await axios.get(
                    `${import.meta.env.VITE_URL}/personal/results/${userResponse.data.email}`,
                    { headers: { Authorization: token } }
                );
                
                console.log('Personality results:', response.data); // Debug log

                if (response.data.success && response.data.scores) {
                    setPersonalityScores(response.data.scores);
                    setIsDefaultScores(response.data.isDefault);
                    
                    if (!response.data.isDefault) {
                        // Format scores to 0-10 scale for the ML model
                        const mlInput = {
                            extraversion: Math.round((response.data.scores.extraversion / 40) * 10),
                            agreeableness: Math.round((response.data.scores.agreeableness / 40) * 10),
                            openness: Math.round((response.data.scores.openness / 40) * 10),
                            neuroticism: Math.round((response.data.scores.neuroticism / 40) * 10),
                            conscientiousness: Math.round((response.data.scores.conscientiousness / 40) * 10),
                            math: Math.round((response.data.scores.math / 100) * 10),
                            verbal: Math.round((response.data.scores.verbal / 100) * 10),
                            logic: Math.round((response.data.scores.logic / 100) * 10)
                        };

                        console.log('Sending ML input:', mlInput); // Debug log

                        try {
                            const predictionResponse = await axios.post(
                                `${import.meta.env.VITE_URL}/career/predict-career`,
                                mlInput,
                                { headers: { Authorization: token } }
                            );

                            console.log('Prediction response:', predictionResponse.data); // Debug log

                            if (predictionResponse.data.success) {
                                setCareerSuggestion(predictionResponse.data.careerRecommendation);
                            }
                        } catch (predictionError) {
                            console.error('Prediction error:', predictionError.response?.data || predictionError);
                            handleError(predictionError);
                        }
                    }
                }
            } catch (err) {
                handleError(err);
            } finally {
                setLoading(false);
            }
        };

        const handleError = (err) => {
            console.error('Error:', err);
            
            if (err.response?.data?.expired) {
                // Token expired
                localStorage.removeItem('token'); // Clear expired token
                navigate('/login');
                return;
            }

            if (err.response?.status === 404) {
                setError('No personality test results found. Please take the personality test first.');
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('token'); // Clear invalid token
                navigate('/login');
            } else {
                setError('Failed to fetch data. Please try again later.');
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="home-container">
                <div className="sidebar">
                    <div className="logo-container">
                        <img
                            src="src/assets/CareerPathway.png"
                            alt="Career Pathway Logo"
                            className="logo"
                        />
                    </div>
                    
                    <div className="sidebar-nav">
                        <Link to="/home" className="nav-item">Home</Link>
                        <Link to="/ujoblist" className="nav-item">Jobs</Link>
                        <Link to="/ucourselist" className="nav-item">Courses</Link>
                        <Link to="/blogs" className="nav-item">Blogs</Link>
                        <Link to="/tests" className="nav-item">Tests</Link>
                    </div>
                </div>

                <div className="content">
                    <Header />
                    <div className="career-suggestions-container">
                        <div className="loading-spinner">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-container">
                <div className="sidebar">
                    <div className="logo-container">
                        <img
                            src="src/assets/CareerPathway.png"
                            alt="Career Pathway Logo"
                            className="logo"
                        />
                    </div>
                    
                    <div className="sidebar-nav">
                        <Link to="/home" className="nav-item">Home</Link>
                        <Link to="/ujoblist" className="nav-item">Jobs</Link>
                        <Link to="/ucourselist" className="nav-item">Courses</Link>
                        <Link to="/blogs" className="nav-item">Blogs</Link>
                        <Link to="/tests" className="nav-item">Tests</Link>
                    </div>
                </div>

                <div className="content">
                    <Header />
                    <div className="career-suggestions-container">
                        <div className="error-message">
                            {error}
                            {error.includes('take the personality test') && (
                                <div className="error-action">
                                    <button onClick={() => navigate('/take-personality-test')}>
                                        Take Personality Test
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="sidebar">
                <div className="logo-container">
                    <img
                        src="src/assets/CareerPathway.png"
                        alt="Career Pathway Logo"
                        className="logo"
                    />
                </div>
                
                <div className="sidebar-nav">
                    <Link to="/home" className="nav-item">Home</Link>
                    <Link to="/ujoblist" className="nav-item">Jobs</Link>
                    <Link to="/ucourselist" className="nav-item">Courses</Link>
                    <Link to="/blogs" className="nav-item">Blogs</Link>
                    <Link to="/tests" className="nav-item">Tests</Link>
                </div>
            </div>

            <div className="content">
                <Header />
                <div className="career-suggestions-container">
                    <h2>Your Career Path Analysis</h2>
                    
                    {isDefaultScores && (
                        <div className="warning-message">
                            <p>These are default scores. Please take the personality test for personalized career suggestions.</p>
                            <button onClick={() => navigate('/take-personality-test')}>
                                Take Personality Test
                            </button>
                        </div>
                    )}
                    
                    {personalityScores && (
                        <div className="personality-scores">
                            <h3>Your Personality Profile</h3>
                            <div className="scores-grid">
                                {Object.entries(personalityScores).map(([trait, score]) => (
                                    <div key={trait} className="score-item">
                                        <label>{trait.charAt(0).toUpperCase() + trait.slice(1)}</label>
                                        <div className="score-bar">
                                            <div 
                                                className="score-fill"
                                                style={{ 
                                                    width: `${(score / (trait === 'math' || trait === 'verbal' || trait === 'logic' ? 100 : 40)) * 100}%` 
                                                }}
                                            />
                                            <span>
                                                {Math.round((score / (trait === 'math' || trait === 'verbal' || trait === 'logic' ? 100 : 40)) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {careerSuggestion && (
                        <div className="career-recommendation">
                            <h3>Recommended Career Path</h3>
                            <div className="recommendation-card">
                                <h4>{careerSuggestion}</h4>
                                <p>Based on your personality profile and aptitude scores, this career path aligns well with your strengths.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerSuggestions; 