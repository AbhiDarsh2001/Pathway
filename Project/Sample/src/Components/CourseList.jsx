// src/Components/CourseList.jsx
import React from 'react';
import CourseItem from './CourseItem';
import './CourseList.css'; // Optional, add styles here if needed

const CourseList = ({ courses }) => {
    return (
        <div className="course-list">
            {courses.map((course) => (
                <CourseItem key={course._id} course={course} />
            ))}
        </div>
    );
};

export default CourseList;