import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Main from '../Main/index';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase"; // Ensure firebaseApp is correctly initialized

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const navigate = useNavigate(); // Import and use the navigate hook

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
			navigate(Main); // Redirect to Main component after successful login
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};
// Function to handle Google sign-up
const signInWithGoogle = () => {
	signInWithPopup(auth, googleProvider)
		.then((result) => {
			const user = result.user;

			const fields = {
				name: user.providerData[0].displayName,
				email: user.providerData[0].email,
				phone: user.providerData[0].phoneNumber || '', // Handle null or undefined phone numbers
			};
			console.log(fields);
			axios.post("http://localhost:8080/authWithGoogle", fields).then((res) => {
				try {
					if (!res.data.error) {
						localStorage.setItem("token", res.data.token);
						localStorage.setItem("user", JSON.stringify(res.data.user));

						context?.setAlertBox({
							open: true,
							error: false,
							msg: res.data.msg,
						});

						setTimeout(() => {
							navigate("/");
							context?.setIsLogin(true);
							context?.setisHeaderFooterShow(true);
						}, 2000);
					} else {
						context?.setAlertBox({
							open: true,
							error: true,
							msg: res.data.msg,
						});
					}
				} catch (error) {
					console.log(error);
				}
			});
		})
		.catch((error) => {
			context?.setAlertBox({
				open: true,
				error: true,
				msg: error.message,
			});
		});
};
	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
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
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sign In
						</button>
						<button
						type="button"
						className={styles.google_login_button}
						onClick={signInWithGoogle}
					>
						Sign Up with Google
					</button>
					</form>
				</div>
				<div className={styles.right}>
					<h1>New Here?</h1>
					<Link to="/signup">
						<button type="button" className={styles.white_btn}>
							Sign Up
						</button>
					</Link>
				</div>
			</div>
			
		</div>
	);
};

export default Login;
