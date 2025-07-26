// src/api/availabilityService.js
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
  const message = error?.response?.data?.message || fallbackMessage;
  toast.error(message);
  throw new Error(message);
};

const availabilityService = {
  /* ------------------------------------------------------------------ */
  /*  Availability                                                     */
  /* ------------------------------------------------------------------ */
  /**
   * Fetch all availability entries across all doctors
   * GET /api/doctors/availability
   */
  getAllAvailability: async () => {
    try {
      const res = await axiosInstance.get('/availability');
      return res.data; // Array of availability docs
    } catch (error) {
      handleApiError(error, 'Could not load availability');
    }
  },

  /**
   * Fetch grouped 30-minute slots for a specific doctor
   * GET /api/doctors/:doctorId/availability
   */
  getDoctorAvailability: async (doctorId) => {
    try {
      const res = await axiosInstance.get(`/availability/${doctorId}`);
      return res.data; // { doctorId, availability: { date: [slots] }}
    } catch (error) {
      handleApiError(error, 'Could not load doctor availability');
    }
  },

  /**
   * Create a new availability slot (doctor only)
   * POST /api/doctors/:doctorId/availability
   * @param {String} doctorId
   * @param {Object} data { date, startTime, endTime, isRecurring }
   */
  createAvailability: async (data) => {
    try {
      const res = await axiosInstance.post(
        `/availability`,
        data
      );
      toast.success('Availability created');
      return res.data; // Created slot
    } catch (error) {
      handleApiError(error, 'Creation failed');
    }
  },

  /**
   * Update an existing availability slot (doctor only)
   * PUT /api/doctors/:doctorId/availability/:id
   * @param {String} doctorId
   * @param {String} slotId
   * @param {Object} updates { date?, startTime?, endTime?, isRecurring? }
   */
  updateAvailability: async (doctorId, slotId, updates) => {
    try {
      const res = await axiosInstance.put(
        `/doctors/${doctorId}/availability/${slotId}`,
        updates
      );
      toast.success('Availability updated');
      return res.data;
    } catch (error) {
      handleApiError(error, 'Update failed');
    }
  },

  /**
   * Delete an availability slot (doctor only)
   * DELETE /api/doctors/:doctorId/availability/:id
   */
  deleteAvailability: async (slotId) => {
    try {
      const res = await axiosInstance.delete(
        `/availability/${slotId}`
      );
      toast.success('Availability deleted');
      return res.data; // { message }
    } catch (error) {
      handleApiError(error, 'Deletion failed');
    }
  },
};

export const {
  getDoctorAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} = availabilityService;

export default availabilityService;
