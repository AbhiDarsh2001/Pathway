import React, { useState, useEffect } from 'react';
import './jobform.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './sidebar';
import useAuth from '../../Components/Function/useAuth';

const JobForm = () => {
  useAuth();
  const { id } = useParams(); // Get the job ID from the URL
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eligibility: '',
    industry: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Fetch job details for editing
      const fetchJob = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_URL}/viewjob/${id}`);
          setFormData({
            name: response.data.name,
            description: response.data.description,
            eligibility: response.data.eligibility.join(', '),
            industry: response.data.industry.join(', '),
          });
        } catch (error) {
          console.error('Error fetching job details:', error);
        }
      };

      fetchJob();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Add validation for the job name
    if (name === 'name') {
      // Regex to allow only alphabets, spaces, commas, and periods
      const validName = /^[A-Za-z\s.,]*$/;
      if (!validName.test(value)) {
        alert('Job name should only contain letters, spaces, commas, or periods.');
        return;
      }
    }
  
    setFormData({
      ...formData,
      [name]: value,
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

      let response;
      if (id) {
        // Update existing job
        response = await axios.put(`${import.meta.env.VITE_URL}/job/${id}`, formattedData);
        alert('Job updated successfully');
      } else {
        // Create new job
        response = await axios.post(`${import.meta.env.VITE_URL}/job`, formattedData);
        alert('Job submitted successfully');
      }

      navigate('/iconjob');
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
      <div className="job-form-container">
        <h2>{id ? 'Edit Job' : 'Submit Job'}</h2>
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
            {loading ? 'Submitting...' : id ? 'Update' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
