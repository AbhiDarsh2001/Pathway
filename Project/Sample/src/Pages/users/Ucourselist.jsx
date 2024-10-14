import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Ucourselist.css';
import Header from './Header';
import useAuth from '../../Components/Function/useAuth';
import FilterComponent from '../../Components/Filter/filter';

const UCourseList = () => {
    useAuth();
    const [courses, setCourses] = useState([]);
    const [filters, setFilters] = useState({ categories: [] });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (filters.categories.length) {
                    queryParams.append('categories', filters.categories.join(','));
                }

                const response = await fetch(`http://localhost:8080/viewcourse/all?${queryParams}`);
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
    }, [filters]); // Re-fetch courses whenever filters change

    return (
        <div>
            <Header />
            <div className="course-list-page">
                <FilterComponent setFilters={setFilters} />
                <div className="Course-list">
                    {courses.map((course) => (
                        <div key={course._id} className="course-item">
                            <h2>{course.name}</h2>
                            <p>{course.fullName}</p>
                            <Link to={`/Uviewcourse/${course._id}`}>
                                <button className="detail-btn">Details</button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UCourseList;
