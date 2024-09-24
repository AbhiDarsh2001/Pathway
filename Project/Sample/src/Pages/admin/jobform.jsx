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
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedData = {
        ...formData,
        // Convert job and entrance into arrays by splitting the comma-separated values
        industry: formData.industry.split(',').map(item => item.trim()),
        eligibility: formData.eligibility.split(',').map(item => item.trim()),
      };

      const response = await axios.post('http://localhost:8080/job', formattedData); // Adjust backend endpoint
      console.log(response.data);
      alert('Course submitted successfully');

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
        {/* <div>
          <label>Eligibility:</label>
          <textarea
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            required
          />
        </div> */}
        {/* <div>
          <label>Categories:</label>
          <select name="categories" value={formData.categories} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="PG">PG</option>
            <option value="UG">UG</option>
            <option value="Professional">Professional</option>
            <option value="Non-professional">Non-professional</option>
          </select>
        </div> */}
        <div>
          <label>Eligibility (comma separated IDs):</label>
          <input
            type="text"
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            placeholder="e.g., eligibility1, eligibility2"
          />
        </div>
        <div>
          <label>Industries (comma separated IDs):</label>
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
  );
};

export default JobForm;
