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
            {/* Navigation Bar */}
            <nav className={styles.navbar}>
                <h1>Pathway - Your Educational Companion</h1>
                <button className={styles.white_btn} onClick={handleLogin}>
                    Login
                </button>
                <button className={styles.white_btn} onClick={handleRegister}>
                    Register
                </button>
            </nav>

            {/* Website Overview Section */}
            <section className={styles.overview_section}>
                <h2>Welcome to Pathway</h2>
                <p>
                    Pathway is an innovative platform designed to guide students in making informed decisions about their higher studies and career paths. Whether you're a student exploring courses or an institution offering guidance, Pathway brings together resources and insights to help you on your educational journey.
                </p>
            </section>

            {/* Features Section */}
            <section className={styles.features_section}>
                <h2>Features of Pathway</h2>
                <ul>
                    <li>Browse detailed information on various courses and their future career prospects.</li>
                    <li>Get insights into job opportunities related to your course of interest.</li>
                    <li>Learn about entrance exams required for specific courses, including tips on how to crack them.</li>
                    <li>Connect with other students and institutions through articles, blogs, and messaging features.</li>
                </ul>
            </section>

            {/* How it Works Section */}
            <section className={styles.how_it_works_section}>
                <h2>How Pathway Works</h2>
                <p>
                    Pathway simplifies the decision-making process by providing detailed descriptions of courses, entrance exams, and job prospects. You can browse courses, read articles, and even interact with other users to get a comprehensive understanding of the best options for your future.
                </p>
            </section>

            {/* Call to Action Section */}
            <section className={styles.cta_section}>
                <h2>Get Started Today</h2>
                <p>Sign up now to start exploring educational opportunities, or log in if you're already part of our community!</p>
                <button className={styles.green_btn} onClick={handleRegister}>
                    Join Pathway
                </button>
                <button className={styles.white_btn} onClick={handleLogin}>
                    Login
                </button>
            </section>
        </div>
    );
};

export default Main;
