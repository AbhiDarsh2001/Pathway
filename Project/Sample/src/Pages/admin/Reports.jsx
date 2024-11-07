import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log('Fetching reports...'); // Debug log
        const response = await axios.get(`${import.meta.env.VITE_URL}/api/reports/all-reports`);
        console.log('Response:', response.data); // Debug log
        setReports(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          status: err.response?.status
        });
        setError(`Failed to fetch reports: ${err.message}`);
        setLoading(false);
      }
    };
  
    fetchReports();
  }, []);

  // Handle blog actions
  const handleBlockBlog = async (blogId) => {
    try {
      await axios.put(`${import.meta.env.VITE_URL}/api/reports/block-blog/${blogId}`);
      setReports(reports.map(report => 
        report.blogId._id === blogId 
          ? { ...report, blogId: { ...report.blogId, status: 'blocked' } }
          : report
      ));
    } catch (err) {
      setError('Failed to block blog');
    }
  };

  const handleUnblockBlog = async (blogId) => {
    try {
      await axios.put(`${import.meta.env.VITE_URL}/api/reports/unblock-blog/${blogId}`);
      setReports(reports.map(report => 
        report.blogId._id === blogId 
          ? { ...report, blogId: { ...report.blogId, status: 'active' } }
          : report
      ));
    } catch (err) {
      setError('Failed to unblock blog');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/api/reports/delete-blog/${blogId}`);
      setReports(reports.filter(report => report.blogId._id !== blogId));
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="reports-page">
      <Sidebar />
      <div className="reports-content">
        <h2>Reported Blogs</h2>
        <table className="reports-table">
          <thead>
            <tr>
              <th>Blog Title</th>
              <th>Reported By</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.blogId.title}</td>
                <td>{report.reportedBy.name}</td>
                <td>{report.reason}</td>
                <td>{report.blogId.status === 'blocked' ? 'Blocked' : 'Active'}</td>
                <td>
                  {report.blogId.status === 'blocked' ? (
                    <button onClick={() => handleUnblockBlog(report.blogId._id)}>
                      Unblock
                    </button>
                  ) : (
                    <button onClick={() => handleBlockBlog(report.blogId._id)}>
                      Block
                    </button>
                  )}
                  <button onClick={() => handleDeleteBlog(report.blogId._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
