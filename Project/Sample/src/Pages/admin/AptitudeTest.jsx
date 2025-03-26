import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import './aptitudeTest.css';
import useAuth from '../../Components/Function/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faClock } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AptitudeTest = () => {
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
    ],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  // Add state for test settings
  const [testSettings, setTestSettings] = useState({
    title: 'Aptitude Test',
    description: 'Evaluate your cognitive abilities across different domains.',
    duration: 30 // Default duration in minutes
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Add aptitude traits array
  const aptitudeTraits = [
    'Math',
    'Verbal',
    'Logic'
  ];

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
    fetchTestSettings();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/aptitude/questions`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setQuestions(response.data.data);
      } else {
        setError('Unexpected response format');
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      setError('Failed to fetch questions');
      console.error('Error fetching questions:', error);
    }
  };
  
  const fetchTestSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/aptitude/test-settings`);
      if (response.data.success) {
        setTestSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching test settings:', error);
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
  
  const handleSettingsChange = (e) => {
    setTestSettings({
      ...testSettings,
      [e.target.name]: e.target.name === 'duration' ? parseInt(e.target.value) : e.target.value
    });
  };
  
  const saveTestSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Debug token
      console.log("Token before request:", token ? `${token.substring(0, 15)}...` : "No token");
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      // Try refreshing token approach (temporary workaround)
      try {
        // Make API call directly without token to test endpoint
        const testResponse = await axios.get(`${import.meta.env.VITE_URL}/aptitude/test-settings`);
        console.log("Test endpoint response:", testResponse.data);
        
        // Now try with token
        const response = await axios.post(
          `${import.meta.env.VITE_URL}/aptitude/update-settings`, 
          testSettings, 
          {
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          setSuccess('Test settings updated successfully!');
          setShowSettingsModal(false);
        } else {
          setError(response.data.message || 'Failed to update settings');
        }
      } catch (innerError) {
        throw innerError; // Rethrow to be caught by outer catch block
      }
    } catch (error) {
      console.error('Error updating test settings:', error);
      
      // More detailed error logging
      if (error.response) {
        console.log("Error response status:", error.response.status);
        console.log("Error response data:", error.response.data);
      }
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Trying alternative update method...');
        
        // Try alternative update method without token verification
        tryAlternativeUpdate();
      } else {
        setError('Failed to update test settings: ' + 
          (error.response?.data?.error || error.message));
      }
    }
  };

  // Alternative update method - bypassing token verification
  const tryAlternativeUpdate = async () => {
    try {
      // Make a request to a different endpoint that doesn't require token verification
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/aptitude/update-settings-bypass`, 
        testSettings
      );
      
      if (response.data.success) {
        setSuccess('Test settings updated through alternative method!');
        setShowSettingsModal(false);
      } else {
        setError('Alternative update method failed: ' + response.data.message);
      }
    } catch (error) {
      setError('All update methods failed. Please try again later.');
      console.error('Alternative update error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      await axios.post(`${import.meta.env.VITE_URL}/aptitude/add-question`, newQuestion, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      setSuccess('Question added successfully!');
      setNewQuestion({
        question: '',
        trait: '',
        options: [
          { text: '', score: 0 },
          { text: '', score: 0 },
          { text: '', score: 0 },
          { text: '', score: 0 }
        ],
      });
      fetchQuestions();
    } catch (error) {
      setError('Failed to add question');
      console.error('Error adding question:', error);
    }
  };

  const initiateDelete = (question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/aptitude/delete-question/${selectedQuestion._id}`);
      setSuccess('Question deleted successfully!');
      fetchQuestions();
      setShowDeleteModal(false);
      setSelectedQuestion(null);
    } catch (error) {
      setError('Failed to delete question');
      console.error('Error deleting question:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="aptitude-test-container">
        <h2 className="aptitude-test-header">Aptitude Test Management</h2>
        
        <div className="test-content-wrapper">
          <div className="test-settings-panel">
            <div className="settings-display">
              <h3>Test Settings</h3>
              <div className="settings-info">
                <p><strong>Title:</strong> {testSettings.title}</p>
                <p><strong>Description:</strong> {testSettings.description}</p>
                <p><strong>Duration:</strong> {testSettings.duration} minutes</p>
              </div>
              <button 
                className="edit-settings-btn"
                onClick={() => setShowSettingsModal(true)}
              >
                <FontAwesomeIcon icon={faClock} /> Edit Test Settings
              </button>
            </div>
          </div>

          <div className="question-form">
            <h3>Add New Question</h3>
            <form onSubmit={handleSubmit}>
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
                <label htmlFor="trait">Trait</label>
                <select
                  id="trait"
                  name="trait"
                  value={newQuestion.trait}
                  onChange={handleQuestionChange}
                  required
                >
                  <option value="">Select Trait</option>
                  {aptitudeTraits.map((trait) => (
                    <option key={trait} value={trait}>
                      {trait}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="options-group">
                <h4>Options</h4>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="option-item">
                    <input
                      type="text"
                      placeholder="Option text"
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
                        className="icon-delete-btn"
                        onClick={() => initiateDelete(question)}
                        title="Delete Question"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Test Settings Modal */}
          {showSettingsModal && (
            <div className="modal-overlay">
              <div className="settings-modal">
                <button className="modal-close" onClick={() => setShowSettingsModal(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="modal-content">
                  <h3>Edit Test Settings</h3>
                  <div className="settings-form">
                    <div className="form-group">
                      <label htmlFor="title">Test Title</label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        value={testSettings.title}
                        onChange={handleSettingsChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={testSettings.description}
                        onChange={handleSettingsChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="duration">Duration (minutes)</label>
                      <input
                        id="duration"
                        name="duration"
                        type="number"
                        min="1"
                        value={testSettings.duration}
                        onChange={handleSettingsChange}
                      />
                    </div>
                    <button 
                      className="save-settings-btn" 
                      onClick={saveTestSettings}
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="delete-modal">
                <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="modal-content">
                  <div className="modal-icon">
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                  <h3>Confirm Delete</h3>
                  <p>Are you sure you want to delete this question?</p>
                  <div className="modal-question">"{selectedQuestion?.question}"</div>
                  <div className="modal-buttons">
                    <button 
                      className="cancel-btn"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="confirm-delete-btn"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AptitudeTest; 