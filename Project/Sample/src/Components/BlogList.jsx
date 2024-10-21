// components/BlogList.jsx
import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import './blogList.css'; // Import the CSS file

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchBlogs();
    fetchCurrentUser();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/blog');
      setBlogs(response.data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      setBlogs([]);
    }
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8080/vuprofile', {
          headers: { Authorization: token },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    }
  };

  const handleLike = (index) => {
    const updatedBlogs = [...blogs];
    updatedBlogs[index].likes = (updatedBlogs[index].likes || 0) + 1;
    setBlogs(updatedBlogs);
  };

  const toggleComments = (index) => {
    const updatedBlogs = [...blogs];
    updatedBlogs[index].showComments = !updatedBlogs[index].showComments;
    setBlogs(updatedBlogs);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/blog/delete/${id}`, {
          headers: { Authorization: token },
        });
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog. Please try again.');
      }
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setEditTitle(blog.title);
    setEditContent(blog.content);
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setEditTitle('');
    setEditContent('');
    setEditImage(null);
  };

  const handleImageChange = (e) => {
    setEditImage(e.target.files[0]);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('content', editContent);
      if (editImage) {
        formData.append('image', editImage);
      }

      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/blog/edit/${editingBlog._id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: token
        },
      });

      handleCancelEdit();
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog. Please try again.');
    }
  };

  return (
    <div className="blog-list">
      <h1>Blog List</h1>
      {blogs.length > 0 ? (
        // Reverse the array to display the newest blogs first
        [...blogs].reverse().map((blog, index) => (
          <div key={index} className="blog-card">
            {editingBlog && editingBlog._id === blog._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <input type="file" onChange={handleImageChange} />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <>
                <h2>{blog.title}</h2>
                <p><strong>{blog.author?.name || 'Unknown'}</strong></p>
                {blog.image && (
                  <img
                    src={`http://localhost:8080${blog.image}`}
                    alt="Blog"
                    className="blog-image"
                  />
                )}
                <p>{blog.content}</p>

                <div className="action-section">
                  <button onClick={() => handleLike(index)}>
                    <FaThumbsUp /> {blog.likes || 0}
                  </button>
                  <button
                    className="comment-button"
                    onClick={() => toggleComments(index)}
                  >
                    <span className="comment-icon"></span> Comments
                  </button>
                  {currentUser && currentUser.id === blog.author._id && (
                    <>
                      <button onClick={() => handleEdit(blog)}>
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDelete(blog._id)}>
                        <FaTrash /> Delete
                      </button>
                    </>
                  )}
                </div>

                {blog.showComments && (
                  <div className="comment-section">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleLike(index, e.target.value);
                      }}
                    />
                    <ul className="comments-list">
                      {blog.comments?.map((comment, i) => (
                        <li key={i}>{comment}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p className="no-blogs">No blogs available</p>
      )}
    </div>
  );
};

export default BlogList;
