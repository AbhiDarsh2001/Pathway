import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './mcourselist.css';
import MSidebar from './msidebar';
import useAuth from '../../Components/Function/useAuth';

const MCourseList = () => {
    useAuth();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/viewcourse/all`);
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="home-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="logo-container">
                    <img
                        src="src/assets/CareerPathway.png"
                        alt="Career Pathway Logo"
                        className="logo"
                    />
                </div>
                <MSidebar />
            </div>

            {/* Main Content Area */}
            <div className="content">
                {/* Course List Section */}
                <div className="welcome-section">
                    <div className="section-header">
                        <h2>Courses</h2>
                    </div>
                    
                    <div className="course-grid">
                        {courses.map((course) => (
                            <div key={course._id} className="course-card">
                                <div className="course-card-content">
                                    <h3>{course.name}</h3>
                                    <p className="course-description">{course.fullName}</p>
                                    <Link to={`/mviewcourse/${course._id}`}>
                                        <button className="view-details-btn">View Details</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MCourseList;
