// src/api/userService.js
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
  const message = error?.response?.data?.message || fallbackMessage;
  toast.error(message);
  throw new Error(message);
};

const userService = {
  /**
   * Fetch all doctors
   * GET /api/doctors
   * @returns {Promise<Array>} list of doctor profiles
   */
  getAllDoctors: async () => {
    try {
      const res = await axiosInstance.get('/users/doctors');
      return res.data;
    } catch (error) {
      handleApiError(error, 'Could not load doctors');
    }
  },
  /**
   * Fetch all patients
   * GET /api/patients
   * @returns {Promise<Array>} list of doctor profiles
   */
  getAllPatients: async () => {
    try {
      const res = await axiosInstance.get('/users/patients');
      return res.data;
    } catch (error) {
      handleApiError(error, 'Could not load patients');
    }
  },
  /**
   * Fetch a single user by ID
   * GET /api/doctors/:userId
   * @param {String} userId
   * @returns {Promise<Object>} user profile
   */
  getUserById: async (userId) => {
    try {
      const res = await axiosInstance.get(`/users/${userId}`);
      return res.data;
    } catch (error) {
      handleApiError(error, 'Could not load user');
    }
  }
};

export const { getAllDoctors, getUserById } = userService;
export default userService;
