import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "" 
    });
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        specialChar: false,
        number: false,
        match: false,
    });
    const [touchedFields, setTouchedFields] = useState({
        email: false,
        password: false,
        confirmPassword: false,
    });

    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });

        if (input.name === "email") {
            validateEmail(input.value);
        }

        // Validate password and confirm password
        if (input.name === "password") {
            validatePassword(input.value);
        }

        if (input.name === "confirmPassword") {
            setPasswordValidations((prev) => ({
                ...prev,
                match: input.value === data.password,
            }));
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    };

    const validatePassword = (password) => {
        const hasLength = password.length >= 6;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        setPasswordValidations({
            length: hasLength,
            specialChar: hasSpecialChar,
            number: hasNumber,
            match: data.confirmPassword === password,
        });
    };

    const handleBlur = (field) => {
        setTouchedFields({ ...touchedFields, [field]: true });
    };

    // Helper function to check if the name is empty or contains only spaces
    const validateName = (name) => {
        return name.trim().length > 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if the name field contains only spaces
        if (!validateName(data.name)) {
            setError("Name cannot be empty or contain only spaces.");
            return;
        }

        // Check if all validations are passed before submitting
        if (!passwordValidations.length || !passwordValidations.specialChar || !passwordValidations.number || !passwordValidations.match) {
            setError("Please ensure all password validations are met.");
            return;
        }

        try {
            const url = `${import.meta.env.VITE_URL}/signup`;
            const { data: res } = await axios.post(url, {
                name: data.name,
                email: data.email,
                password: data.password,
            });
            navigate('/login'); // Redirect after successful signup
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/login">
                        <button type="button" className={styles.white_btn}>
                            Sign In
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            id="name"
                            onChange={handleChange}
                            value={data.name}
                            required
                            className={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            id="email"
                            onChange={handleChange}
                            onBlur={() => handleBlur("email")}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        {touchedFields.email && emailError && (
                            <div className={styles.error_msg}>{emailError}</div>
                        )}
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            id="password"
                            onChange={handleChange}
                            onBlur={() => handleBlur("password")}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            id="confirmpassword"
                            onChange={handleChange}
                            onBlur={() => handleBlur("confirmPassword")}
                            value={data.confirmPassword}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        
                        {/* Show password validation messages */}
                        <div className={styles.validation_msg}>
                            <p style={{ color: passwordValidations.length ? 'green' : 'red' }}>
                                {passwordValidations.length ? '✓ Minimum 6 characters' : '✗ Minimum 6 characters'}
                            </p>
                            <p style={{ color: passwordValidations.specialChar ? 'green' : 'red' }}>
                                {passwordValidations.specialChar ? '✓ At least one special character' : '✗ At least one special character'}
                            </p>
                            <p style={{ color: passwordValidations.number ? 'green' : 'red' }}>
                                {passwordValidations.number ? '✓ At least one number' : '✗ At least one number'}
                            </p>
                            <p style={{ color: passwordValidations.match ? 'green' : 'red' }}>
                                {passwordValidations.match ? '✓ Passwords match' : '✗ Passwords do not match'}
                            </p>
                        </div>

                        <button type="submit" className={styles.green_btn} id="signup">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
