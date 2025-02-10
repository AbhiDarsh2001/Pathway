import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import './personalityTest.css';
import useAuth from '../../Components/Function/useAuth';

const PersonalityTest = () => {
  useAuth();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    trait: '',
    options: [
      { text: '', score: 0 },
      { text: '', score: 0 },
      { text: '', score: 0 },
      { text: '', score: 0 }
    ]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/personal/questions`);
      setQuestions(response.data.data);
    } catch (error) {
      setError('Failed to fetch questions');
      console.error('Error fetching questions:', error);
    }
  };

  const handleQuestionChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      [e.target.name]: e.target.value
    });
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: field === 'score' ? Number(value) : value
    };
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_URL}/personal/add-question`, newQuestion);
      setSuccess('Question added successfully!');
      setNewQuestion({
        question: '',
        trait: '',
        options: [
          { text: '', score: 0 },
          { text: '', score: 0 },
          { text: '', score: 0 },
          { text: '', score: 0 }
        ]
      });
      fetchQuestions();
    } catch (error) {
      setError('Failed to add question');
      console.error('Error adding question:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/personal/delete-question/${id}`);
      setSuccess('Question deleted successfully!');
      fetchQuestions();
    } catch (error) {
      setError('Failed to delete question');
      console.error('Error deleting question:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="personality-test-container">
        <h2 className="personality-test-header">Personality Test Management</h2>

        <div className="question-management">
          <h3>Add New Question</h3>
          <form onSubmit={handleSubmit} className="question-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-group">
              <label htmlFor="question">Question</label>
              <input
                id="question"
                type="text"
                name="question"
                placeholder="Enter question"
                value={newQuestion.question}
                onChange={handleQuestionChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="trait">Personality Trait</label>
              <input
                id="trait"
                type="text"
                name="trait"
                placeholder="Enter personality trait"
                value={newQuestion.trait}
                onChange={handleQuestionChange}
                required
              />
            </div>
            
            <div className="options-container">
              {newQuestion.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                    required
                  />
                  <div className="option-score">
                    <label>Score:</label>
                    <input
                      type="number"
                      placeholder="Score"
                      value={option.score}
                      onChange={(e) => handleOptionChange(index, 'score', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button type="submit" className="submit-btn">Add Question</button>
          </form>
        </div>

        <div className="question-management">
          <h3>Existing Questions</h3>
          <table className="questions-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Trait</th>
                <th>Options</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question._id}>
                  <td>{question.question}</td>
                  <td>{question.trait}</td>
                  <td>
                    {question.options.map((option, index) => (
                      <div key={index} className="option-display">
                        {option.text} (Score: {option.score})
                      </div>
                    ))}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(question._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default PersonalityTest; 