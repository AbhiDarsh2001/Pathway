import React, { useState, useEffect } from 'react';
import './mcourseform.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MSidebar from './msidebar';

const MCourseForm = () => {
  const { id } = useParams(); // Get id from URL to determine if we are editing
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

  useEffect(() => {
    if (id) {
      // Fetch course details for editing
      const fetchCourseDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/course/${id}`);
          setFormData(response.data); // Pre-populate form with course details
        } catch (error) {
          console.error('Error fetching course details:', error);
        }
      };
      fetchCourseDetails();
    }
  }, [id]);

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
      // Ensure job and entrance fields are either split or already arrays
      const formattedData = {
        ...formData,
        job: Array.isArray(formData.job) ? formData.job : formData.job.split(',').map((item) => item.trim()),
        entrance: Array.isArray(formData.entrance) ? formData.entrance : formData.entrance.split(',').map((item) => item.trim()),
      };
  
      let response;
      if (id) {
        // If id exists, update course
        response = await axios.put(`http://localhost:8080/course/${id}`, formattedData);
        alert('Course updated successfully');
      } else {
        // If no id, create a new course
        response = await axios.post('http://localhost:8080/course', formattedData);
        alert('Course submitted successfully');
      }
  
      navigate('#iconcourse');
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
        <MSidebar />
        <div className="form-container">
          <h2>{id ? 'Edit Course' : 'Submit Course'}</h2>
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
              {loading ? 'Submitting...' : id ? 'Update' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MCourseForm;
