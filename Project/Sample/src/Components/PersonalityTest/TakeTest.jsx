import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TakeTest.css';
import useAuth from '../../Components/Function/useAuth';

const TakeTest = () => {
  useAuth(); // Add authentication check
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Get token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/personal/test-questions`, {
        headers: { Authorization: token }
      });
      setQuestions(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch questions');
      setLoading(false);
      if (error.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption
    });
  };

  const calculateTraitScores = () => {
    const traitScores = {
      Neuroticism: 0,
      Agreeableness: 0,
      Conscientiousness: 0,
      Openness: 0,
      Extraversion: 0
    };

    questions.forEach(question => {
      const answer = answers[question._id];
      if (answer) {
        traitScores[question.trait] += answer.score;
      }
    });

    return traitScores;
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError('Please answer all questions');
      return;
    }

    try {
      const scores = calculateTraitScores();
      await axios.post(
        `${import.meta.env.VITE_URL}/personal/submit-test`, 
        { scores },
        { headers: { Authorization: token } }
      );
      navigate('/home');
    } catch (error) {
      setError('Failed to submit test');
      if (error.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (questions.length === 0) return <div>No questions available</div>;

  return (
    <div className="take-test-container">
      <div className="progress-bar">
        <div 
          className="progress"
          style={{ width: `${(currentQuestion + 1) / questions.length * 100}%` }}
        />
      </div>

      <div className="question-card">
        <h2>Question {currentQuestion + 1} of {questions.length}</h2>
        <p className="question-text">{questions[currentQuestion].question}</p>

        <div className="options-list">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                answers[questions[currentQuestion]._id]?.text === option.text 
                  ? 'selected' 
                  : ''
              }`}
              onClick={() => handleAnswer(questions[currentQuestion]._id, option)}
            >
              {option.text}
            </button>
          ))}
        </div>

        <div className="navigation-buttons">
          {currentQuestion > 0 && (
            <button
              className="nav-button"
              onClick={() => setCurrentQuestion(curr => curr - 1)}
            >
              Previous
            </button>
          )}
          
          {currentQuestion < questions.length - 1 ? (
            <button
              className="nav-button"
              onClick={() => setCurrentQuestion(curr => curr + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="submit-button"
              onClick={handleSubmit}
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeTest; 