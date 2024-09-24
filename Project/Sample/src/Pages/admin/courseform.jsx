import React, { useState } from 'react';
import './courseform.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';

const CourseForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eligibility: '',
    categories: '',
    job: '',
    entrance: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
    setErrorMessage('');

    try {
      const formattedData = {
        ...formData,
        job: formData.job.split(',').map((item) => item.trim()),
        entrance: formData.entrance.split(',').map((item) => item.trim()),
      };

      const response = await axios.post('http://localhost:8080/course', formattedData);
      console.log(response.data);
      alert('Course submitted successfully');

      setFormData({
        name: '',
        description: '',
        eligibility: '',
        categories: '',
        job: '',
        entrance: '',
      });

      navigate('/addcourse');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || 'Unknown error');
      alert('Error submitting: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-page-container">
      <div className="sidebar-and-form-container">
        <Sidebar />
        <div className="form-container">
          <h2>Submit Course</h2>
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
                minLength="3"
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
              <label htmlFor="eligibility">Eligibility:</label>
              <textarea
                name="eligibility"
                id="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="categories">Categories:</label>
              <select
                name="categories"
                id="categories"
                value={formData.categories}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="PG">PG</option>
                <option value="UG">UG</option>
                <option value="Professional">Professional</option>
                <option value="Non-professional">Non-professional</option>
              </select>
            </div>
            <div>
              <label htmlFor="job">Job (comma separated):</label>
              <input
                type="text"
                name="job"
                id="job"
                value={formData.job}
                onChange={handleChange}
                placeholder="e.g., job1, job2, job3"
              />
            </div>
            <div>
              <label htmlFor="entrance">Entrance (comma separated):</label>
              <input
                type="text"
                name="entrance"
                id="entrance"
                value={formData.entrance}
                onChange={handleChange}
                placeholder="e.g., entrance1, entrance2"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
