import React, { useEffect, useState } from 'react';
import './viewcourse.css';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';

const VCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/viewcourse/${id}`);
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
      const response = await fetch(`http://localhost:8080/delcourse/${id}`, { method: 'DELETE' });
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
    navigate(`/editcourse/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div>
      <div className="Course-details">
        {/* <Sidebar /> */}
        <h1>{course.name}</h1>
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Eligibility:</strong> {course.eligibility}</p>
        <p><strong>Categories:</strong> {course.categories}</p>
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

export default VCourseDetails;
