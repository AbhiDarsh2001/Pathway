import React, { useState, useEffect } from 'react';
import './mjobform.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MSidebar from './msidebar';

const MJobForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eligibility: '',
    industry: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch available categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/category`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorMessage('Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch job details if we are editing
  useEffect(() => {
    if (id) {
      const fetchJobDetails = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_URL}/viewjob/${id}`);
          const jobData = response.data;
          setFormData({
            name: jobData.name,
            description: jobData.description,
            eligibility: Array.isArray(jobData.eligibility) ? jobData.eligibility.join(', ') : jobData.eligibility,
            industry: Array.isArray(jobData.industry) ? jobData.industry.join(', ') : jobData.industry,
          });
        } catch (error) {
          console.error('Error fetching job details:', error);
          setErrorMessage('Error fetching job details');
        }
      };
      fetchJobDetails();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      const validName = /^[A-Za-z\s.,]*$/;
      if (!validName.test(value)) {
        setErrorMessage('Job name should only contain letters, spaces, commas, or periods.');
        return;
      } else {
        setErrorMessage('');
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
    setErrorMessage('');

    try {
      const formattedData = {
        ...formData,
        industry: formData.industry.split(',').map((item) => item.trim()),
        eligibility: formData.eligibility.split(',').map((item) => item.trim()),
      };

      let response;
      if (id) {
        response = await axios.put(`${import.meta.env.VITE_URL}/job/${id}`, formattedData);
        alert('Job updated successfully');
      } else {
        response = await axios.post(`${import.meta.env.VITE_URL}/job`, formattedData);
        alert('Job submitted successfully');
      }

      navigate('/miconjob');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || 'Unknown error');
      alert('Error submitting: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-page-container">
      <MSidebar />
      <div className="job-form-container">
        <h2>{id ? 'Edit Job' : 'Submit Job'}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength="2"
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="eligibility">Eligibility (comma separated):</label>
            <textarea
              name="eligibility"
              id="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="industry">Industry (comma separated):</label>
            <input
              type="text"
              name="industry"
              id="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g., industry1, industry2"
            />
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : id ? 'Update' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MJobForm;
