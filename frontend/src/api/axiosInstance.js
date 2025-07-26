import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL, // Replace with your API URL
  timeout: 10000, // Request timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors
    if (error.response) {
      if (error.response.status === 403) {
        // Handle unauthorized error
        console.warn("Unauthorized!");

        const navigate = useNavigate();
        if (navigate) {
          navigate("/unauthorized", { replace: true });
        }
        } else if (error.response.status === 401) {
        const navigate = useNavigate();
        if (navigate) {
          // Clear token from local storage
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      } else {
        console.error(
          "Axios Error:",
          error.response.data.message || "An error occurred"
        );
      }
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
