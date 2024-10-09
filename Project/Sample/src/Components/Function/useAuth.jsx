import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('token');
        if (!user) {
            navigate('/');
        }
    },[navigate]);
};

export default useAuth;