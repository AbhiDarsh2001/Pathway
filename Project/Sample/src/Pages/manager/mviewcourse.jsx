import React, { useEffect, useState } from 'react';
import './mviewcourse.css';
import { useParams, useNavigate } from 'react-router-dom';
import MSidebar from './msidebar';
import useAuth from '../../Components/Function/useAuth';

const MVCourseDetails = () => {
  useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/viewcourse/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/delcourse/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Course deleted successfully');
        navigate('/iconcourse');
      } else {
        const errorMessage = await response.text();
        alert(`Failed to delete the course: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Could not delete course. Please try again later.');
    }
  };

  const handleEdit = () => {
    navigate(`/meditcourse/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div>
      <div className="Course-details">
        <MSidebar />
        <h1>{course.name}</h1>
        <h2>{course.fullName}</h2>
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Eligibility:</strong> {course.eligibility}</p>
        <p><strong>Category:</strong> {course.category?.name}</p>
        <p><strong>Job:</strong> {course.job.join(', ')}</p>
        <p><strong>Entrance:</strong> {course.entrance.join(', ')}</p>
        <p><strong>Duration:</strong> {course.duration} months</p>
        <div className="button-container">
          <button className="back-button" onClick={() => navigate(-1)}>Back</button>
          <button className="edit-button" onClick={handleEdit}>Edit</button>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default MVCourseDetails;
