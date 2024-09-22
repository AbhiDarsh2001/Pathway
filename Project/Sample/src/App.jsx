import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login/index";
import Signup from "./Components/Signup/index";
import Main from "./Components/Main/index";
import Home from "./Components/Home/home";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Main />} />
			<Route path="/home" element={<Home />} />
        </Routes>
    );
}

export default App;




