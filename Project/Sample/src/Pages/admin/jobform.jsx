import React, { useState } from 'react';
import './jobform.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JobForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eligibility: '',
    industry: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedData = {
        ...formData,
        industry: formData.industry.split(',').map((item) => item.trim()),
        eligibility: formData.eligibility.split(',').map((item) => item.trim()),
      };

      const response = await axios.post('http://localhost:8080/job', formattedData);
      console.log(response.data);
      alert('Job submitted successfully');

      setFormData({
        name: '',
        description: '',
        eligibility: '',
        industry: '',
      });

      navigate('/addjob');
    } catch (error) {
      console.error(error);
      alert('Error submitting: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-page-container">
      {/* Header Bar */}
      <div className="header-bar">
        <h1>Job Management</h1>
        <button className="admin-button" onClick={() => navigate('/admin')}>
          Admin Dashboard
        </button>
      </div>

      {/* Job Form */}
      <div className="job-form-container">
        <h2>Submit Job</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Eligibility (comma separated):</label>
            <input
              type="text"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              placeholder="e.g., eligibility1, eligibility2"
            />
          </div>
          <div>
            <label>Industries (comma separated):</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g., industry1, industry2"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
