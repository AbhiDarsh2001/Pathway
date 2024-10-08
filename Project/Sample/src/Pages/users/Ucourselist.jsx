import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Ucourselist.css';

const UCourseList = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8080/viewcourse/all');
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
            {/* {<Sidebar/>} */}
            <div className="Course-list">
                {courses.map((course) => (
                    <div key={course._id} className="course-item">
                        <h2>{course.name}</h2>
                        <p>{course.description}</p>
                        <Link to={`/Uviewcourse/${course._id}`}>
                            <button className="detail-btn">Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UCourseList;