import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase"; // Ensure firebaseApp is initialized

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${import.meta.env.VITE_URL}/login`;
      const { data: res } = await axios.post(url, data); // Destructure response
  
      if (res.token) {
        const { role } = res.data;
  
        localStorage.setItem("token", res.token); // Store the JWT token
        localStorage.setItem("userRole", role); // Store the user's role
        localStorage.setItem("userId", res.data.userId);
        if (role === "admin") {
          navigate("/admin"); // Navigate to the admin page if the role is admin
        } else {
          switch (role) {
            case 1:
              navigate("/home");
              break;
            case 2:
              navigate("/manager");
              break;
            default:
              navigate("/home"); // Default route
          }
        }
      }
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

  // Function to handle Google login
  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
        };

        axios
          .post(`${import.meta.env.VITE_URL}/authWithGoogle`, fields)
          .then((res) => {
            if (!res.data.error) {
              localStorage.setItem("token", res.data.token);
              navigate("/home");
            } else {
              setError(res.data.msg);
            }
          });
      })
      .catch((error) => {
        setError(error.message);
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
              id="emailid"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              id="passwords"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {/* Forgot Password Button */}
            <div style={{ textAlign: "right", marginTop: "5px" }}>
              <Link
                to="/forgotpassword"
                style={{ textDecoration: "none", color: "#007bff" }}
              >
                Forgot Password?
              </Link>
            </div>
            {error && <div className={styles.error_msg}>{error}</div>}
            <button id="login" type="submit" className={styles.green_btn}>
              Sign In
            </button>
            <button 
              type="button"
              className={styles.google_login_button}
              onClick={signInWithGoogle}
            >
              Sign In with Google
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
