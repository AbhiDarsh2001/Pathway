import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import './CategoryForm.css';

const CategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch existing categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorMessage('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Validate the new category name (case-insensitive)
  const isDuplicateCategory = (name) => {
    return categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
  };

  // Validate category input
  const validateCategoryName = (name) => {
    const trimmedName = name.trim();
    const isValid =
      /^[A-Za-z\s,.]+$/.test(trimmedName) && trimmedName.length >= 2;
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const trimmedCategory = newCategory.trim();

    // Check for invalid input
    if (!validateCategoryName(trimmedCategory)) {
      setErrorMessage(
        'Invalid category name. Please ensure it contains at least 3 letters and no numbers or special characters except , and .'
      );
      setLoading(false);
      return;
    }

    // Check for duplicates (case-insensitive)
    if (isDuplicateCategory(trimmedCategory)) {
      setErrorMessage('This category already exists.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/category', {
        name: trimmedCategory,
      });
      setCategories([...categories, response.data]); // Add new category
      setNewCategory(''); // Clear input
      alert('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      setErrorMessage('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  // Handle category deletion
  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8080/category/${categoryId}`);
      setCategories(categories.filter((category) => category._id !== categoryId));
      alert('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      setErrorMessage('Failed to delete category');
    }
  };

  return (
    <div className="category-page-container">
      <div className="sidebar-and-form-container">
        <Sidebar />
        <div className="form-container">
          <h2>Manage Categories</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="newCategory">New Category Name:</label>
              <input
                type="text"
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
                minLength="3"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Category'}
            </button>
          </form>

          <h3>Existing Categories</h3>
          <ul>
            {categories.map((category) => (
              <li key={category._id}>
                {category.name}{' '}
                <button onClick={() => handleDelete(category._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
