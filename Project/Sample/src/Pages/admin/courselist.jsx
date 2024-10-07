import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './courselist.css';
import Sidebar from './sidebar'; // Assuming Sidebar component exists

const CourseList = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8080/viewcourse/all'); // Correct route
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                setCourses(data); // Correct setCourses
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="course-list-page">
            <div className="sidebar">
                {/* <Sidebar /> */}
            </div>
            <div className="Course-list">
                {courses.map((course) => ( // Corrected courses.map
                    <div key={course._id} className="course-item">
                        <h2>{course.name}</h2>
                        <p>{course.description}</p> {/* Example additional course details */}
                        <Link to={`/viewcourse/${course._id}`}> {/* Corrected course._id */}
                            <button className="detail-btn">Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList;
