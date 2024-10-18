// components/BlogList.jsx
import React, { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import './blogList.css'; // Import the CSS file

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:8080/blog');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        setBlogs([]);
      }
    };

    fetchBlogs();
  }, []);

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

  return (
    <div className="blog-list">
      <h1>Blog List</h1>
      {blogs.length > 0 ? (
        // Reverse the array to display the newest blogs first
        [...blogs].reverse().map((blog, index) => (
          <div key={index} className="blog-card">
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
          </div>
        ))
      ) : (
        <p className="no-blogs">No blogs available</p>
      )}
    </div>
  );
};

export default BlogList;
