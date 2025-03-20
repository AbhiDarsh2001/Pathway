import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';
import useAuth from '../../Components/Function/useAuth';
import './ManualCareerTest.css';

const ManualCareerTest = () => {
    useAuth(); // Add authentication check
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
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const token = localStorage.getItem('token');

    const fetchUserScores = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch personality test results
            const personalityResponse = await axios.get(
                `${import.meta.env.VITE_URL}/personal/results`,
                { headers: { Authorization: token } }
            );
            console.log('Personality response:', personalityResponse);

            // Fetch aptitude test results using the correct endpoint
            const aptitudeResponse = await fetch(
                `${import.meta.env.VITE_URL}/aptitude/results`,
                { headers: { Authorization: token } }
            );
            
            let aptitudeScores = {
                math: 0,
                verbal: 0,
                logic: 0
            };
            
            if (aptitudeResponse.ok) {
                const aptitudeData = await aptitudeResponse.json();
                console.log('Aptitude response:', aptitudeData);
                
                if (aptitudeData.success && aptitudeData.data && aptitudeData.data.scores) {
                    aptitudeScores = {
                        math: aptitudeData.data.scores.math,
                        verbal: aptitudeData.data.scores.verbal,
                        logic: aptitudeData.data.scores.logic
                    };
                }
            }

            if (personalityResponse.data.success && personalityResponse.data.data) {
                const personalityScores = personalityResponse.data.data.scores;
                
                // Set all scores
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

                setFieldErrors({});
            }
        } catch (err) {
            console.error('Error fetching scores:', err);
            setError(err.response?.data?.message || 'Failed to fetch scores. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const validateInput = (name, value) => {
        if (value === '') return '';
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'Must be a number';
        if (numValue < 0 || numValue > 100) return 'Must be between 0 and 100';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setScores(prev => ({
            ...prev,
            [name]: value
        }));

        const error = validateInput(name, value);
        setFieldErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Convert all scores to numbers
            const numericScores = {
                extraversion: parseFloat(scores.extraversion),
                agreeableness: parseFloat(scores.agreeableness),
                conscientiousness: parseFloat(scores.conscientiousness),
                neuroticism: parseFloat(scores.neuroticism),
                openness: parseFloat(scores.openness),
                math: parseFloat(scores.math),
                verbal: parseFloat(scores.verbal),
                logic: parseFloat(scores.logic)
            };

            // Validate all scores are numbers and within range
            for (const [trait, score] of Object.entries(numericScores)) {
                if (isNaN(score)) {
                    throw new Error(`Invalid score for ${trait}`);
                }
                if (score < 10 || score > 100) {
                    throw new Error(`Score for ${trait} must be between 10 and 100`);
                }
            }

            // Send scores to backend
            const response = await axios.post(
                `${import.meta.env.VITE_URL}/career/predict-manual`,
                numericScores,
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Set the result with three career recommendations
                setResult({
                    careerRecommendations: response.data.careerRecommendations, // Expecting an array of recommendations
                    scores: numericScores,
                    probabilities: response.data.probabilities
                });
            } else {
                setError(response.data.message || 'Failed to get career predictions');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to submit scores');
        } finally {
            setIsSubmitting(false);
        }
    };

    const traits = [
        { name: 'extraversion', label: 'Extraversion', description: 'Sociability and energy in social situations' },
        { name: 'agreeableness', label: 'Agreeableness', description: 'Cooperation and consideration of others' },
        { name: 'openness', label: 'Openness', description: 'Curiosity and openness to new experiences' },
        { name: 'neuroticism', label: 'Neuroticism', description: 'Emotional stability and stress response' },
        { name: 'conscientiousness', label: 'Conscientiousness', description: 'Organization and responsibility' },
        { name: 'math', label: 'Mathematical Aptitude', description: 'Numerical and mathematical problem-solving' },
        { name: 'verbal', label: 'Verbal Aptitude', description: 'Language and communication skills' },
        { name: 'logic', label: 'Logical Aptitude', description: 'Analytical and logical reasoning' }
    ];

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
                <div className="manual-test-container">
                    <h2>Manual Career Assessment</h2>
                    <p className="instructions">
                        Enter your scores manually or fetch them from your previous tests (out of 100).
                    </p>

                    <button 
                        className="fetch-scores-button"
                        id="fetch score"
                        onClick={fetchUserScores}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Fetching Scores...' : 'Fetch My Scores'}
                    </button>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="scores-input-grid">
                            {traits.map(({ name, label, description }) => (
                                <div key={name} className="score-input-item">
                                    <label htmlFor={name}>{label}</label>
                                    <input
                                        type="text"
                                        id={name}
                                        name={name}
                                        value={scores[name]}
                                        onChange={handleChange}
                                        className={fieldErrors[name] ? 'error' : ''}
                                    />
                                    <p className="description">{description}</p>
                                    {fieldErrors[name] && (
                                        <span className="error-message">{fieldErrors[name]}</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Getting Predictions...' : 'Get Career Predictions'}
                        </button>
                    </form>

                    {/* Display the prediction result */}
                    {result && (
                        <div className="result-section">
                            <h3>Your Career Recommendations</h3>
                            <div className="recommendation-card">
                                {Array.isArray(result.careerRecommendations) ? (
                                    <div className="recommendations-list">
                                        {result.careerRecommendations.map((career, index) => (
                                            <div key={index} className="recommendation-item">
                                                <h4>{index + 1}. {career}</h4>
                                                {result.probabilities && (
                                                    <p className="probability">
                                                        Confidence: {(result.probabilities[career] * 100).toFixed(2)}%
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No recommendations available</p>
                                )}
                                
                                <div className="scores-summary">
                                    <h4>Your Assessment Scores:</h4>
                                    {Object.entries(result.scores).map(([trait, score]) => (
                                        <div key={trait} className="score-item">
                                            <span className="trait-label">
                                                {trait.charAt(0).toUpperCase() + trait.slice(1)}:
                                            </span>
                                            <span className="score-value">
                                                {score.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManualCareerTest; 