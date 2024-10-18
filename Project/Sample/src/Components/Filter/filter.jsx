//filter.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for logout
import './filter.css';

const FilterComponent = ({ setFilters }) => {
  const [categories, setCategories] = useState([]); // Categories from backend
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories
  const [selectedSubcategories, setSelectedSubcategories] = useState([]); // Selected subcategories

  const navigate = useNavigate(); // Initialize navigate for redirection

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/category');
        const data = await response.json();
        setCategories(data); // Assuming each category has a `subcategories` array
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Handle category checkbox change
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  // Handle subcategory checkbox change
  const handleSubcategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSubcategories((prev) =>
      checked ? [...prev, value] : prev.filter((name) => name !== value)
    );
  };

  // Submit selected filters
  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters({ categories: selectedCategories, subcategories: selectedSubcategories });
  };

  // Clear selected filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setFilters({ categories: [], subcategories: [] });
  };

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from local storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="filter-container">
      <form onSubmit={handleSubmit}>
        <div className="filter-group">
            {/* <div className="logo-container">
                <img src="src/assets/CareerPathway.png" alt="Career Pathway Logo" className="logo" />
            </div> */}
          <h3>Categories</h3>
          <div className="filter-options">
            {categories.map((category) => (
              <div key={category._id} className="filter-checkbox-group">
                <input
                  type="checkbox"
                  value={category._id}
                  checked={selectedCategories.includes(category._id)}
                  onChange={handleCategoryChange}
                />
                <label>{category.name}</label>

                {/* Show Subcategories Only If Category Is Selected */}
                {selectedCategories.includes(category._id) && category.subcategories.length > 0 && (
                  <div className="subcategory-options">
                    {category.subcategories.map((subcategory, index) => (
                      <div key={index} className="filter-checkbox-group">
                        <input
                          type="checkbox"
                          value={subcategory}
                          checked={selectedSubcategories.includes(subcategory)}
                          onChange={handleSubcategoryChange}
                        />
                        <label>{subcategory}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="filter-button" >Apply Filters</button>
        <button type="button" onClick={clearFilters} style={{  color: '#333' }}>Clear Filters</button>
      </form>

      {/* Logout button placed at the bottom */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default FilterComponent;
