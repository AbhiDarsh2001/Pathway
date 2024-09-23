import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login/index";
import Signup from "./Components/Signup/index";
import Main from "./Components/Main/index";
import Home from "./Components/Home/home";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword/ForgotPassword";
import VerifyCode from "./Components/ForgotPassword/ForgotPassword/VerifyCode";
import ResetPassword from "./Components/ForgotPassword/ForgotPassword/ResetPassword";
function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Main />} />
			<Route path="/home" element={<Home />} />
			<Route path="/forgotpassword" element={<ForgotPassword />} />
			<Route path="/verifycode" element={<VerifyCode/>}/>
			<Route path="/resetpassword" element={<ResetPassword/>}/>
        </Routes>
    );
}

export default App;




