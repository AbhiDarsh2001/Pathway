// components/ReportedBlogsList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './reportedBlogsList.css';

const ReportedBlogsList = () => {
  const [reportedBlogs, setReportedBlogs] = useState([]);

  useEffect(() => {
    fetchReportedBlogs();
  }, []);

  const fetchReportedBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_URL}/viewreport/reports`, {
        headers: { Authorization: token },
      });
      setReportedBlogs(response.data);
    } catch (error) {
      console.error('Failed to fetch reported blogs:', error);
    }
  };

  const handleBlock = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_URL}/viewreport/block/${blogId}`, {}, {
        headers: { Authorization: token },
      });
      fetchReportedBlogs();
    } catch (error) {
      console.error('Error blocking blog:', error);
    }
  };
  
  const handleUnblock = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_URL}/viewreport/unblock/${blogId}`, {}, {
        headers: { Authorization: token },
      });
      fetchReportedBlogs();
    } catch (error) {
      console.error('Error unblocking blog:', error);
    }
  };
  
  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_URL}/viewreport/delete/${blogId}`, {
          headers: { Authorization: token },
        });
        fetchReportedBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  return (
    <div className="reported-blogs-list">
      <h2>Reported Blogs</h2>
      {reportedBlogs.length > 0 ? (
        reportedBlogs.map((report) => (
          <div key={report._id} className="reported-blog-card">
            <h3>{report.blogId.title}</h3>
            <p><strong>Reported Reason:</strong> {report.reason}</p>
            <p>{report.blogId.content}</p>
            <p><strong>Reported By:</strong> {report.reportedBy.username}</p>
            <div className="action-buttons">
              {report.blogId.status === 'active' ? (
                <button onClick={() => handleBlock(report.blogId._id)}>Block</button>
              ) : (
                <button onClick={() => handleUnblock(report.blogId._id)}>Unblock</button>
              )}
              <button onClick={() => handleDelete(report.blogId._id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>No reported blogs available</p>
      )}
    </div>
  );
};

export default ReportedBlogsList;
