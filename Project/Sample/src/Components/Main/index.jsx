import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Main = () => {
    const navigate = useNavigate(); // Initialize the navigate hook

    const handleLogin = () => {
        navigate("/login"); // Navigate to the login page
    };

    const handleRegister = () => {
        navigate("/signup"); // Navigate to the signup page
    };

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>facebook</h1>
                <button className={styles.white_btn} onClick={handleLogin}>
                    Login
                </button>
                <button className={styles.white_btn} onClick={handleRegister}>
                    Register
                </button>
            </nav>
        </div>
    );
};

export default Main;
