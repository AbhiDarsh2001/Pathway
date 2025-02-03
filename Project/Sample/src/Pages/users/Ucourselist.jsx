import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import useAuth from '../../Components/Function/useAuth';
import FilterComponent from '../../Components/Filter/filter';
import './Ucourselist.css';
import USearchEntrance from '../../Components/search/search';

const UCourseList = () => {
    useAuth();
    const [courses, setCourses] = useState([]);
    const [filters, setFilters] = useState({ categories: [], subcategories: [] });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (filters.categories.length) {
                    queryParams.append('categories', filters.categories.join(','));
                }
                if (filters.subcategories.length) {
                    queryParams.append('subcategories', filters.subcategories.join(','));
                }

                const response = await fetch(`${import.meta.env.VITE_URL}/viewcourse/all?${queryParams}`);
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
    }, [filters]);

    return (
        <div className="home-container">
            {/* Filter Sidebar */}
            <div className="filter-sidebar">
                <div className="logo-container">
                    <img
                        src="src/assets/CareerPathway.png"
                        alt="Career Pathway Logo"
                        className="logo"
                    />
                </div>
                <FilterComponent setFilters={setFilters} type="course" />
            </div>

            {/* Main Content */}
            <div className="content">
                <Header />
                <div className="welcome-section">
                    <div className="section-header">
                        <h2>Course</h2>
                        <div className="search-box">
                        <USearchEntrance />                        
                        </div>
                    </div>

                    <div className="course-grid">
                        {courses.map((course) => (
                            <div key={course._id} className="course-card">
                                <div className="course-card-content">
                                    <h3>{course.name}</h3>
                                    <p className="course-description">{course.description}</p>
                                    <div className="course-meta">
                                        <span className="category-tag">
                                            {course.category ? course.category.name : 'N/A'}
                                        </span>
                                        <span className="course-duration">
                                            <i className="fas fa-clock"></i> {course.duration || 'Duration N/A'}
                                        </span>
                                    </div>
                                    <Link to={`/Uviewcourse/${course._id}`}>
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

export default UCourseList;
