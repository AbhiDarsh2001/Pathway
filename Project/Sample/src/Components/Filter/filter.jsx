import React, { useState, useEffect } from 'react';
import './filter.css';

const FilterComponent = ({ setFilters }) => {
    const [categories, setCategories] = useState([]); // Categories from backend
    const [selectedCategories, setSelectedCategories] = useState([]); // Selected filters
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch('http://localhost:8080/category');
          const data = await response.json();
          setCategories(data); // Array of categories with IDs
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
      fetchCategories();
    }, []);
  
    const handleCheckboxChange = (e) => {
      const { value, checked } = e.target;
      setSelectedCategories((prev) =>
        checked ? [...prev, value] : prev.filter((id) => id !== value)
      );
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setFilters({ categories: selectedCategories }); // Send category IDs to parent
    };
  
    const clearFilters = () => {
      setSelectedCategories([]);
      setFilters({ categories: [] });
    };
  
    return (
      <div className="filter-container">
        <form onSubmit={handleSubmit}>
          <div className="filter-group">
            <h3>Categories</h3>
            <div className="filter-options">
              {categories.map((category) => (
                <div key={category._id} className="filter-checkbox-group">
                  <input
                    type="checkbox"
                    value={category._id} // Send category ID
                    checked={selectedCategories.includes(category._id)}
                    onChange={handleCheckboxChange}
                  />
                  <label>{category.name}</label>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="filter-button">Apply Filters</button>
          <button type="button" onClick={clearFilters}>Clear Filters</button>
        </form>
      </div>
    );
  };
  
  export default FilterComponent;
