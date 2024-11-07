//CategoryForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import './CategoryForm.css';

const CategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/category`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorMessage('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/category/${categoryId}`);
      setCategories(categories.filter((category) => category._id !== categoryId));
      alert('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      setErrorMessage('Failed to delete category');
    }
  };
  
  const handleDeleteSubcategory = async (categoryId, subcategory) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/category/${categoryId}/subcategory/${subcategory}`);
      setCategories(categories.map((category) => 
        category._id === categoryId
          ? { ...category, subcategories: category.subcategories.filter((sc) => sc !== subcategory) }
          : category
      ));
      alert('Subcategory deleted successfully');
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      setErrorMessage('Failed to delete subcategory');
    }
  };
  

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const trimmedCategory = newCategory.trim();

    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/category`, {
        name: trimmedCategory,
      });
      setCategories([...categories, response.data]); 
      setNewCategory(''); // Clear the category input field
      alert('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSubcategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!selectedCategory) {
      setErrorMessage('Please select a category');
      setLoading(false);
      return;
    }

    const trimmedSubcategory = newSubcategory.trim();

    if (trimmedSubcategory) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URL}/category/${selectedCategory}/subcategory`,
          { subcategory: trimmedSubcategory }
        );
        setCategories(
          categories.map((category) =>
            category._id === selectedCategory
              ? { ...category, subcategories: [...category.subcategories, trimmedSubcategory] }
              : category
          )
        );
        alert('Subcategory added successfully');
        setNewSubcategory(''); // Clear the subcategory input field
      } catch (error) {
        console.error('Error adding subcategory:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to add subcategory');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="category-page-container">
      <div className="sidebar-and-form-container">
        <Sidebar />
        <div className="form-container">
          <h2>Manage Categories</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Add new category */}
          <form onSubmit={handleSubmitCategory}>
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

          {/* Add subcategory */}
          <form onSubmit={handleSubmitSubcategory}>
            <div>
              <label htmlFor="selectCategory">Select Category:</label>
              <select
                id="selectCategory"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="newSubcategory">New Subcategory Name:</label>
              <input
                type="text"
                id="newSubcategory"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Subcategory'}
            </button>
          </form>

          <h3>Existing Categories</h3>
          <ul>
  {categories.map((category) => (
    <li key={category._id}>
      {category.name}
      <button onClick={() => handleDeleteCategory(category._id)}>
        Delete Category
      </button>
      <ul>
        {category.subcategories &&
          category.subcategories.map((subcat, index) => (
            <li key={index}>
              {subcat}
              <button
                onClick={() => handleDeleteSubcategory(category._id, subcat)}
              >
                Delete Subcategory
              </button>
            </li>
          ))}
      </ul>
    </li>
  ))}
</ul>

        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
