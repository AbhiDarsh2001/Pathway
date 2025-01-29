// components/BlogList.jsx
import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './blogList.css';
import Header from '../Pages/users/Header';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [reportReason, setReportReason] = useState('Violence Content'); // Default reason

  useEffect(() => {
    fetchBlogs();
    fetchCurrentUser();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/blog`);
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
        const response = await axios.get(`${import.meta.env.VITE_URL}/vuprofile`, {
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
        await axios.delete(`${import.meta.env.VITE_URL}/blog/delete/${id}`, {
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
      await axios.put(`${import.meta.env.VITE_URL}/blog/edit/${editingBlog._id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },  
      });

      handleCancelEdit();
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog. Please try again.');
    }
  };

  const handleReportClick = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      const reportData = {
        blogId,
        reason: reportReason,
        reportedBy: currentUser.id,
      };
      await axios.post(`${import.meta.env.VITE_URL}/report/submit`, reportData, {
        headers: { Authorization: token },
      });
      alert('Blog reported successfully');
    } catch (error) {
      console.error('Error reporting blog:', error);
      alert('Failed to report blog. Please try again.');
    }
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img
            src="src/assets/CareerPathway.png"
            alt="Career Pathway Logo"
            className="logo"
          />
        </div>
        
        <div className="sidebar-nav">
          <Link to="/home" className="nav-item">
            Home
          </Link>
          <Link to="/ujoblist" className="nav-item">
            Jobs
          </Link>
          <Link to="/ucourselist" className="nav-item">
            Courses
          </Link>
          <Link to="/ubloglist" className="nav-item">
            Blogs
          </Link>
          <Link to="/uprofile" className="nav-item">
            Profile
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="welcome-section">
          <div className="section-header">
            <h2>Blog Posts</h2>
            <div className="search-box">
              <input type="text" placeholder="Search blogs..." className="search-input" />
            </div>
          </div>

          <div className="blog-grid">
            {blogs.length > 0 ? (
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
                          src={`${import.meta.env.VITE_URL}${blog.image}`}
                          alt="Blog"
                          className="blog-image"
                        />
                      )}
                      <p>{blog.content}</p>

                      <div className="action-section">
                        {currentUser && currentUser.id === blog.author._id ? (
                          <>
                            <button onClick={() => handleEdit(blog)}>
                              <FaEdit /> Edit
                            </button>
                            <button onClick={() => handleDelete(blog._id)}>
                              <FaTrash /> Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <select onChange={(e) => setReportReason(e.target.value)} value={reportReason}>
                              <option value="Violence Content">Violence Content</option>
                              <option value="False Information">False Information</option>
                              <option value="Nudity or Sexual Content">Nudity or Sexual Content</option>
                              <option value="Promoting Unwanted Content">Promoting Unwanted Content</option>
                              {/* <option value="I Just Don't Like the Post">I Just Don't Like the Post</option> */}
                            </select>
                            <button 
                              onClick={() => handleReportClick(blog._id)}
                              className="report-button"
                            >
                              Report
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
        </div>
      </div>
    </div>
  );
};

export default BlogList;
