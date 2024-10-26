import React, { useEffect, useState } from 'react';
import Header from './Header';
import useAuth from '../../Components/Function/useAuth';
import FilterComponent from '../../Components/Filter/filter';
import CourseList from '../../Components/CourseList';
import './Ucourselist.css'; // Make sure the updated styles are imported

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
    }, [filters]);

    return (
        <div>
            <Header />
            <div className="course-list-container">
                {/* Left-side filter */}
                <div className="filter-component">
                    <FilterComponent setFilters={setFilters} />
                </div>

                {/* Right-side course list */}
                <CourseList courses={courses} />
            </div>
        </div>
    );
};

export default UCourseList;
