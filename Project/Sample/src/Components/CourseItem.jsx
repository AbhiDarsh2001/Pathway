// src/Components/CourseItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './CourseItem.css'; // Optional, add styles here if needed

const CourseItem = ({ course }) => {
    return (
        <div className="course-item">
            <h2>{course.name}</h2>
            <p>{course.fullName}</p>
            <Link to={`/Uviewcourse/${course._id}`}>
                <button className="detail-btn">Details</button>
            </Link>
        </div>
    );
};

export default CourseItem;
