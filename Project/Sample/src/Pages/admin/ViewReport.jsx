import React from "react";
import ReportedBlogsList from "../../Components/ViewReportedBlogs";
import useAuth from "../../Components/Function/useAuth";
import Sidebar from './sidebar';
import './ViewReport.css';

const ViewReportedBlg = () => {
    useAuth();
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
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="content">
                <div className="welcome-section">
                    <div className="section-header">
                        <h2>Reported Blogs</h2>
                    </div>
                    
                    <div className="report-container">
                        <ReportedBlogsList />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewReportedBlg;