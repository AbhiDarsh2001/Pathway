import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase"; // Ensure firebaseApp is correctly initialized

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Signup = ({ context }) => {  // If you use context, pass it in as a prop
	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
		  const url = 'http://localhost:8080/signup';
		  const response = await axios.post(url, data);
		  console.log(response.data.msg);
		  navigate('/login');
		} catch (err) {
		
			setError('An error occurred. Please try again.');
		
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
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.left}>
					<h1>Welcome Back</h1>
					<Link to="/login">
						<button type="button" className={styles.white_btn}>
							Sign in
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
						{/* <input
							type="text"
							placeholder="Last Name"
							name="lastName"
							onChange={handleChange}
							value={data.lastName}
							required
							className={styles.input}
						/> */}
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
							Sign Up
						</button>
					</form>
					<button
						type="button"
						className={styles.google_login_button}
						onClick={signInWithGoogle}
					>
						Sign Up with Google
					</button>
				</div>
			</div>
		</div>
	);
};

export default Signup;
