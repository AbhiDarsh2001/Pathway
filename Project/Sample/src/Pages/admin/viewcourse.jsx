import React, { useEffect, useState } from 'react';
import './viewcourse.css'; // Use a proper CSS file for courses
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';

const VCourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);  // State for course details
    const [loading, setLoading] = useState(true);  // State for loading status

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/viewcourse/${id}`); // Correct route for fetching course details
                if (!response.ok) {
                    throw new Error('Failed to fetch course details');
                }
                const data = await response.json();
                setCourse(data);  // Set the course details
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setLoading(false);  // Set loading to false regardless of success or failure
            }
        };
    
        fetchCourseDetails();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if (!confirmDelete) return; // Cancel deletion if user chooses not to proceed

        try {
            const response = await fetch(`http://localhost:8080/delcourse/${id}`, { // Correct URL for course deletion
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Course deleted successfully');
                navigate('/iconcourse'); // Redirect to the course list
            } else {
                const errorMessage = await response.text();
                alert(`Failed to delete the course: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Could not delete course. Please try again later.');
        }
    };
    
    // Loading state
    if (loading) return <div>Loading...</div>;

    // If course is null or doesn't exist, show a message
    if (!course) return <div>Course not found</div>;

    return (
        <div>
            <div className="Course-details">
                {/* <Sidebar /> */}
                <h1>{course.name}</h1> {/* Accessing course.name */}
                <p><strong>Description:</strong> {course.description}</p>
                {course.eligibility && <p><strong>Eligibility:</strong> {course.eligibility}</p>} {/* Accessing course eligibility */}
                {course.categories && <p><strong>Categories:</strong> {course.categories}</p>}
                {course.job && <p><strong>job:</strong> {course.job.join(', ')}</p>}
                {course.entrance && <p><strong>Entrance:</strong>{course.entrance.join(', ')}</p>}
                <div className="button-container">
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default VCourseDetails;
