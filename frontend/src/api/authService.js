// src/api/authService.js
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
  const message = error?.response?.data?.msg || fallbackMessage;
  toast.error(message);
  throw new Error(message);
};

const authService = {
  /**
   * Register a new user
   * @param {Object} data { name, gender, dob, email, password, role }
   */
  register: async (data) => {
    try {
      const res = await axiosInstance.post('/auth/register', data);
      toast.success('Registered successfully!');
      return {
        ...res.data.user,
        jwtToken: res.data.token,
      };
    } catch (error) {
      handleApiError(error, 'Registration failed');
    }
  },

  /**
   * Login step 1 - send email/password and receive OTP token
   * @param {String} email
   * @param {String} password
   */
  authenticate: async (email, password) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      toast.success('OTP sent to your email!');
      return res.data; // { otpToken }
    } catch (error) {
      handleApiError(error, 'Login failed');
    }
  },

  /**
   * Login step 2 - verify OTP
   * @param {Object} data { otpToken, otp }
   */
  verifyLoginOtp: async ({ otpToken, otp }) => {
    try {
      const res = await axiosInstance.post('/auth/verify-login-otp', { otpToken, otp });
      toast.success('Logged in successfully!');
      return {
        ...res.data.user,
        jwtToken: res.data.token,
      };
    } catch (error) {
      handleApiError(error, 'OTP verification failed');
    }
  },

  /**
   * Forgot Password - send OTP
   * @param {String} email
   */
  forgotPassword: async (email) => {
    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email });
      toast.success('Reset OTP sent to your email!');
      return res.data; // { msg, otpToken }
    } catch (error) {
      handleApiError(error, 'Failed to send reset OTP');
    }
  },

  /**
   * Reset Password - verify OTP and set new password
   * @param {Object} data { otpToken, otp, newPassword }
   */
  resetPassword: async ({ otpToken, otp, newPassword }) => {
    try {
      const res = await axiosInstance.post('/auth/reset-password', {
        otpToken,
        otp,
        newPassword,
      });
      toast.success('Password reset successfully!');
      return res.data;
    } catch (error) {
      handleApiError(error, 'Reset password failed');
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
  },
};

// Named exports for direct use with AuthContext
export const {
  register,
  authenticate,
  verifyLoginOtp,
  forgotPassword,
  resetPassword,
  logout,
} = authService;

export default authService;
