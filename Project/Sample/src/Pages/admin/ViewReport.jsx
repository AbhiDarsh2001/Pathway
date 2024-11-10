import React from "react";
import ReportedBlogsList from "../../Components/ViewReportedBlogs";
import useAuth from "../../Components/Function/useAuth";

const ViewReportedBlg = () => {
    useAuth();
    return (
        <>
        <div>
            <ReportedBlogsList />
        </div>
        </>
    )
}

export default ViewReportedBlg;