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

            // Fetch aptitude test results
            const aptitudeResponse = await axios.get(
                `${import.meta.env.VITE_URL}/test/results/${localStorage.getItem('email')}`,
                { headers: { Authorization: token } }
            );

            if (personalityResponse.data.success && personalityResponse.data.data) {
                const personalityScores = personalityResponse.data.data.scores;
                
                // Calculate average scores for math, verbal, and logic from aptitude tests
                const aptitudeScores = aptitudeResponse.data.reduce((acc, test) => {
                    if (test.testId?.category) {
                        const score = (test.score / test.testId.totalMarks) * 100;
                        acc[test.testId.category.toLowerCase()] = score;
                    }
                    return acc;
                }, {});

                // Convert personality scores from 0-40 to 0-100 scale
                setScores({
                    extraversion: (personalityScores.extraversion * 2.5).toString(),
                    agreeableness: (personalityScores.agreeableness * 2.5).toString(),
                    openness: (personalityScores.openness * 2.5).toString(),
                    neuroticism: (personalityScores.neuroticism * 2.5).toString(),
                    conscientiousness: (personalityScores.conscientiousness * 2.5).toString(),
                    math: aptitudeScores.math?.toString() || '',
                    verbal: aptitudeScores.verbal?.toString() || '',
                    logic: aptitudeScores.logic?.toString() || ''
                });

                setFieldErrors({}); // Clear any existing field errors
            }
        } catch (err) {
            console.error('Error fetching scores:', err);
            setError('Failed to fetch scores. Please try again.');
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
        
        // Validate all fields
        const errors = {};
        let hasError = false;
        Object.entries(scores).forEach(([name, value]) => {
            const error = validateInput(name, value);
            if (error || value === '') {
                errors[name] = error || 'This field is required';
                hasError = true;
            }
        });

        if (hasError) {
            setFieldErrors(errors);
            return;
        }

        setIsSubmitting(true);
        setError(null);
        
        try {
            const numericScores = Object.entries(scores).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: parseFloat(value)
            }), {});

            console.log('Sending scores:', numericScores);

            const response = await axios.post(
                `${import.meta.env.VITE_URL}/career/predict-manual`,
                numericScores,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Response:', response.data);

            if (response.data.success) {
                setResult({
                    scores: numericScores,
                    careerRecommendation: response.data.careerRecommendation
                });
            } else {
                console.log(response.data.error);
                setError(response.data.error || 'Failed to get career prediction');
            }
        } catch (err) {
            console.error('Error details:', err);
            setError(
                err.response?.data?.error || 
                err.response?.data?.details || 
                'Failed to process scores. Please try again.'
            );
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
                        Enter your scores manually or fetch them from your previous tests.
                    </p>

                    <button 
                        className="fetch-scores-button"
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

                    {/* New Result Section */}
                    {result && (
                        <div className="result-section">
                            <h3>Your Career Recommendation</h3>
                            <div className="recommendation-card">
                                <h4>{result.careerRecommendation}</h4>
                                <p>Based on your input scores:</p>
                                <div className="scores-summary">
                                    {Object.entries(result.scores).map(([trait, score]) => (
                                        <div key={trait} className="score-item">
                                            <span className="trait-label">
                                                {trait.charAt(0).toUpperCase() + trait.slice(1)}:
                                            </span>
                                            <span className="score-value">{score}</span>
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