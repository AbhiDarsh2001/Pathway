import React, { useState } from 'react';
import './courseform.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        job: formData.job.split(',').map(item => item.trim()),
        entrance: formData.entrance.split(',').map(item => item.trim()),
      };

      const response = await axios.post('http://localhost:8080/course', formattedData); // Adjust backend endpoint
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

      navigate('/admin/courses');
    } catch (error) {
      console.error(error);
      alert('Error submitting: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-form-container">
      <h2>Submit Course</h2>
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
          <label>Eligibility:</label>
          <textarea
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Categories:</label>
          <select name="categories" value={formData.categories} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="PG">PG</option>
            <option value="UG">UG</option>
            <option value="Professional">Professional</option>
            <option value="Non-professional">Non-professional</option>
          </select>
        </div>
        <div>
          <label>Job (comma separated IDs):</label>
          <input
            type="text"
            name="job"
            value={formData.job}
            onChange={handleChange}
            placeholder="e.g., job1, job2, job3"
          />
        </div>
        <div>
          <label>Entrance (comma separated IDs):</label>
          <input
            type="text"
            name="entrance"
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
  );
};

export default CourseForm;
