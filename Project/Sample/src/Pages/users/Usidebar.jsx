import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './usidebar.css';

const USidebar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/category');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = () => {
    // Perform logout logic here
    console.log('Logging out...');
    navigate('/login'); // Redirect to login page after logout
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="sidebar">
      <h2>Categories</h2>
      <div className="categories-list">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category._id} className="category-item">
              <input
                type="checkbox"
                id={`category-${category._id}`}
                name={category.name}
              />
              <label htmlFor={`category-${category._id}`}>{category.name}</label>
            </div>
          ))
        ) : (
          <p>No categories available</p>
        )}
      </div>

      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default USidebar;
