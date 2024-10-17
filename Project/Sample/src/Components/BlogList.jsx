// components/BlogList.jsx
import React, { useEffect, useState } from 'react';
import './blogList.css';


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

  const handleComment = (index, comment) => {
    if (!comment.trim()) return; // Prevent empty comments
    const updatedBlogs = [...blogs];
    updatedBlogs[index].comments = updatedBlogs[index].comments || [];
    updatedBlogs[index].comments.push(comment);
    setBlogs(updatedBlogs);
  };

  return (
    <div className="blog-list">
      <h1>Blog List</h1>
      {Array.isArray(blogs) && blogs.length > 0 ? (
        blogs.map((blog, index) => (
          <div key={index} className="blog-card">
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <p><strong>Author:</strong> {blog.author?.name || 'Unknown'}</p>
            {blog.image && (
              <img
                src={`http://localhost:8080${blog.image}`}
                alt="Blog"
              />
            )}

            {/* Like Button */}
            <div className="like-section">
              <button onClick={() => handleLike(index)}>👍 Like</button>
              <span>{blog.likes || 0} Likes</span>
            </div>

            {/* Comment Box */}
            <div className="comment-section">
              <input
                type="text"
                placeholder="Add a comment..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleComment(index, e.target.value);
                }}
              />
              <ul className="comments-list">
                {blog.comments?.map((comment, i) => (
                  <li key={i}>{comment}</li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p className="no-blogs">No blogs available</p>
      )}
    </div>
  );
};

export default BlogList;
