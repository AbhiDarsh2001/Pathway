import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login/index";
import Signup from "./Components/Signup/index";
import Main from "./Components/Main/index";
import Home from "./Components/Home/home";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword/ForgotPassword";
import VerifyCode from "./Components/ForgotPassword/ForgotPassword/VerifyCode";
import ResetPassword from "./Components/ForgotPassword/ForgotPassword/ResetPassword";
import Dashboard from "./Pages/admin/Dashboard";
import CourseForm from "./Pages/admin/courseform";
import JobForm from "./Pages/admin/jobform";
import JobList from "./Pages/admin/joblist";
import VJobDetails from "./Pages/admin/viewjob";
import AddManager from "./Pages/admin/addmanager";
import CourseList from "./Pages/admin/courselist";
import VCourseDetails from "./Pages/admin/viewcourse";
import ManagerList from "./Pages/admin/managerlist";
import Profile from "./Pages/users/profile";
import UEditProfile from "./Pages/users/updateprofile";
import UCourseList from "./Pages/users/Ucourselist";
import Uviewcourse from "./Pages/users/Uviewcourse";
import UJobList from "./Pages/users/Ujoblist";
import Uviewjob from "./Pages/users/Uviewjob";
import MDashboard from "./Pages/manager/mdashboard";
import MCourseForm from "./Pages/manager/mcourseform";
import CategoryForm from "./Pages/admin/CategoryForm";
import MJobForm from "./Pages/manager/mjobform";
import MJobList from "./Pages/manager/mjoblist";
import MVJobDetails from "./Pages/manager/mviewjob";
import MCourseList from "./Pages/manager/mcourselist";
import MVCourseDetails from "./Pages/manager/mviewcourse";
import USidebar from "./Pages/users/Usidebar";
import USearchCourseResults from "./Pages/users/searchresult/searchcourse";
import BlogForm from './Components/BlogForm';
import BlogList from './Components/BlogList';
import ViewReportedBlg from "./Pages/admin/ViewReport";
import AdminLogout from "./Pages/admin/Logout";
import InstituteRegistration from "./Pages/Institute/institute";
import InstitutionList from "./Pages/admin/institutionList";
import ChatBot from "./Components/ChatBot/chatbot";
import ErrorBoundary from './Components/ChatBot/ErrorBoundary';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
			<Route path="/home" element={<Home />} />
			<Route path="/main" element={<Main />} />
			<Route path="/forgotpassword" element={<ForgotPassword />} />
			<Route path="/verifycode" element={<VerifyCode/>}/>
			<Route path="/resetpassword" element={<ResetPassword/>}/>
			<Route path="/admin" element={<Dashboard />} />
			<Route path="/addcourse" element = {<CourseForm />} />
			<Route path="/addjob" element = {<JobForm />} />
			<Route path='/iconjob' element= {<JobList />} />
			<Route path='/viewjob/:id' element= {<VJobDetails />} />
			<Route path='/addmanager' element= {<AddManager />} />
			<Route path='/iconcourse' element = {<CourseList />} />
			<Route path='/viewcourse/:id' element = {<VCourseDetails />} />
			<Route path='/iconmanager' element = {<ManagerList />} />
			<Route path='/uprofile' element = {<Profile />} />
			<Route path='/userpro' element = {<UEditProfile />} />
			<Route path="/editcourse/:id" element={<CourseForm />} />
			<Route path='/Ucourselist' element={<UCourseList />} />
			<Route path='/Uviewcourse/:id' element ={<Uviewcourse />} />
			<Route path='/Ujoblist' element={<UJobList />} />
			<Route path='/Uviewjob/:id' element={<Uviewjob />} />
			<Route path="/editjob/:id" element={<JobForm />} />
			<Route path='/manager' element={<MDashboard />} />
			<Route path="/maddcourse" element = {<MCourseForm />} />
			<Route path="/meditjob/:id" element = {<MJobForm />} />
			<Route path="/meditcourse/:id" element ={<MCourseForm />} />
			<Route path="/maddjob" element ={<MJobForm />} />
			<Route path='/Catagory' element={<CategoryForm />} />
			<Route path='/miconjob' element={<MJobList />} />
			<Route path='/mviewjob/:id' element={<MVJobDetails />} />
			<Route path='/miconcourse' element={<MCourseList />} />
			<Route path='/mviewcourse/:id' element={<MVCourseDetails />} />
			<Route path='/usidebar' element={<USidebar />} />
			<Route path='/searchcourse-results' element={<USearchCourseResults />} />
			<Route path="/blogs" element={<BlogList />} />
      		<Route path="/add-blog" element={<BlogForm />} />
			<Route path="/reports" element={<ViewReportedBlg />} />
			<Route path="/logout" element={<AdminLogout />} />
			
			<Route path="/institute" element={<InstituteRegistration />} />
			<Route path="/institutionList" element={<InstitutionList />} />
			<Route path="/chatBot" element={
				<ErrorBoundary>
					<ChatBot />
				</ErrorBoundary>
			} />

        </Routes>
    );
}

export default App;




