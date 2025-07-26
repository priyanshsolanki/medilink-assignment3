import React, { createContext, useContext, useState, useEffect } from "react";
import {
  authenticate as authServiceLogin,
  logout as authServiceLogout
} from "../api/authService";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('auth')));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate(); 
  // On initial load
  useEffect(() => {
    setAuthUser(getAuthUserFromToken());
  }, []);

  // 1. Call Cognito login, return token + email (do not set authUser yet)
  const authenticate = (email, password) => {
    return authServiceLogin(email, password);
  };
  // Define a structure for the token payload (optional for TypeScript users)
  const getAuthUserFromToken = () => {
    const token = localStorage.getItem("token"); // assuming it's stored as "token"
    if (!token) return null;

    try {
      const decoded = jwtDecode(token); // decode the token
      console.log(decoded)
      return decoded; // includes name, role, email, etc.
    } catch (err) {
      console.error("Invalid JWT token", err);
      navigate(`/`);

      return null;
    }
  };

  // 2. Store after verifying security & cipher
  const setVerifiedAuthUser = (auth) => {
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem("token", auth.jwtToken);

    setAuthUser(auth);
    setToken(auth.jwtToken);
    navigate(`${auth.role}/dashboard`);
  };

  // 3. Logout
  const logout = () => {
    authServiceLogout();
    setAuthUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        authenticate,
        logout,
        token,
        setVerifiedAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
