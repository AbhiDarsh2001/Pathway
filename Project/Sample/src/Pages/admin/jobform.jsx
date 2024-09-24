import React, { useState } from 'react';
import './jobform.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';

const JobForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eligibility: '',
    categories: '',
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
        categories: '',
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
      <Sidebar />
      
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
            <textarea
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            {/* <label>Categories:</label>
            <select
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select> */}
          </div>
          <div>
            <label>Industry (comma separated):</label>
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
