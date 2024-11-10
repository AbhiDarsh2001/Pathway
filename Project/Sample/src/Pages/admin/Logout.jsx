import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from local storage
    localStorage.removeItem("userData");
    localStorage.removeItem("token");

    // Navigate to the login page
    navigate("/login", { replace: true });

    // Prevent going back to the protected route
    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", () => {
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  return null; // No button or UI needed, since it logs out automatically
};

export default LogoutButton;
