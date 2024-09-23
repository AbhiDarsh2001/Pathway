import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""    });
    const [error, setError] = useState("");
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        specialChar: false,
        number: false,
        match: false,
    });
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if all validations are passed before submitting
        if (!passwordValidations.length || !passwordValidations.specialChar || !passwordValidations.number || !passwordValidations.match) {
            setError("Please ensure all password validations are met.");
            return;
        }

        try {
            const url = "http://localhost:8080/signup";
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
                            onChange={handleChange}
                            value={data.name}
                            required
                            className={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            onChange={handleChange}
                            value={data.confirmPassword}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
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
                        <button type="submit" className={styles.green_btn}>
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
