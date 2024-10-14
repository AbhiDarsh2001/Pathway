import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import useAuth from '../../../Components/Function/useAuth';
import Header from '../Header';
import FilterComponent from '../../../Components/Filter/filter';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const USearchCourseResults = () => {
  useAuth();
  const query = useQuery().get('query');
  const [course, setCourses] = useState([]);
  const [error, setError] = useState('');

  const marginCref = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/searchentr?query=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch Courses');
        }
        const data = await response.json();
        setCourses(data);
        setError('');
      } catch (error) {
        setError('An error occurred while searching for Courses.');
        setCourses([]);
      }
    };

    if (query) {
      fetchCourses();
    }
  }, [query]);

  useEffect(() => {
    if (course.length >= 0 && marginCref.current) {
      marginCref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [course]);

  return (
    <div>
            <Header />
            <div className="course-list-page">
                {/* <FilterComponent setFilters={setFilters} /> */}
                <div className="Course-list">
                    {course.map((course) => (
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

export default USearchCourseResults;
