//filter.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './filter.css';

const FilterComponent = ({ setFilters, type }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/category`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((sub) => sub !== subcategory)
        : [...prev, subcategory]
    );
  };

  useEffect(() => {
    setFilters({ 
      categories: selectedCategories,
      subcategories: selectedSubcategories
    });
  }, [selectedCategories, selectedSubcategories, setFilters]);

  return (
    <div className="filter-container">
      <h3>Filter Courses</h3>
      <div className="filter-group">
        {categories.map((category) => (
          <div key={category._id} className="category-item">
            <input
              type="checkbox"
              id={category._id}
              checked={selectedCategories.includes(category._id)}
              onChange={() => handleCategoryChange(category._id)}
            />
            <label htmlFor={category._id}>{category.name}</label>
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="subcategories">
                {category.subcategories.map((subcategory, index) => (
                  <div key={index} className="subcategory-item">
                    {/* <input
                      type="checkbox"
                      id={`${category._id}-${subcategory}`}
                      checked={selectedSubcategories.includes(subcategory)}
                      onChange={() => handleSubcategoryChange(subcategory)}
                    /> */}
                    {/* <label htmlFor={`${category._id}-${subcategory}`}>{subcategory}</label> */}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default FilterComponent;
