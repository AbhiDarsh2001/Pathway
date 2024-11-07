import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './courselist.css';
import Sidebar from './sidebar';

const CourseList = () => {
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
        <div className="course-list-page">
            {<Sidebar/>}
            <div className="Course-list" >
                {courses.map((course) => (
                    <div key={course._id} className="course-item">
                        <h2>{course.name}</h2>
                        <p>{course.fullName}</p>
                        <Link to={`/viewcourse/${course._id}`}>
                            <button className="detail-btn">Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList;
