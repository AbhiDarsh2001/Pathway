import React, { useState, useEffect } from 'react';
import './courseform.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './sidebar';

const CourseForm = () => {
  const { id } = useParams(); // Get id from URL to determine if we are editing
  const [formData, setFormData] = useState({
    name: '',
    fullName: '', // Added fullName field
    description: '',
    eligibility: '',
    category: '',
    job: '',
    entrance: '',
    duration: '' // Adding duration field
  });
  const [categories, setCategories] = useState([]); // For dynamic categories
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch available categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/category'); // Assuming your API route for categories
        setCategories(response.data); // Set fetched categories
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorMessage('Error fetching categories');
      }
    };

    fetchCategories();
  }, []);

  // Fetch course details if we are editing
  useEffect(() => {
    if (id) {
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
    const { name, value } = e.target;

    // Add validation for the course name
    if (name === 'name' || name === 'fullName') {
      // Regex to allow only alphabets, spaces, commas, and periods
      const validName = /^[A-Za-z\s.,]*$/;
      if (!validName.test(value)) {
        setErrorMessage('Course name should only contain letters, spaces, commas, or periods.');
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
        job: Array.isArray(formData.job) ? formData.job : formData.job.split(',').map((item) => item.trim()),
        entrance: Array.isArray(formData.entrance) ? formData.entrance : formData.entrance.split(',').map((item) => item.trim()),
      };

      let response;
      if (id) {
        response = await axios.put(`http://localhost:8080/course/${id}`, formattedData);
        alert('Course updated successfully');
      } else {
        response = await axios.post('http://localhost:8080/course', formattedData);
        alert('Course submitted successfully');
      }

      navigate('/iconcourse');
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
      <div className='sidebar'>
        <Sidebar />
      </div>
      <div className="form-container">
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
                minLength="2" // Example minimum length
              />
            </div>

            <div>
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                minLength="5" // Example minimum length for full name
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
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
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
            <div>
              <label htmlFor="duration">Duration (in months):</label>
              <input
                type="number"
                name="duration"
                id="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Enter course duration"
                required
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

export default CourseForm;