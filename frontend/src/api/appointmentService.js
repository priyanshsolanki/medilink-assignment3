// src/api/appointmentService.js
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
  const message = error?.response?.data?.message || fallbackMessage;
  toast.error(message);
  throw new Error(message);
};

const appointmentService = {
  /* ------------------------------------------------------------------ */
  /*  Appointments                                                      */
  /* ------------------------------------------------------------------ */

  /**
   * Book an appointment
   * @param {Object} data { patientId, doctorId, date (YYYY-MM-DD), time (HH:mm) }
   */
  bookAppointment: async (data) => {
    try {
      const res = await axiosInstance.post('/appointments/book', data);
      toast.success('Appointment booked!');
      return res.data;          // { message, appointmentId, callLink }
    } catch (error) {
      handleApiError(error, 'Booking failed');
    }
  },

  /**
   * Fetch appointments for a patient
   * @param {String} patientId
   */
  getAppointmentsByPatient: async (patientId) => {
    try {
      const res = await axiosInstance.get(`/appointments/patient/${patientId}`);
      return res.data;          // Array of appointments
    } catch (error) {
      handleApiError(error, 'Could not load appointments');
    }
  },

  /**
   * Fetch appointments for a doctor
   * @param {String} doctorId
   */
  getAppointmentsByDoctor: async (doctorId) => {
    try {
      const res = await axiosInstance.get(`/appointments/doctor/${doctorId}`);
      return res.data;
    } catch (error) {
      handleApiError(error, 'Could not load appointments');
    }
  },

  /**
   * Reschedule an existing appointment
   * @param {String} appointmentId
   * @param {Object} data { newDate, newTime }
   */
  rescheduleAppointment: async (appointmentId, data) => {
    try {
      const res = await axiosInstance.put(
        `/appointments/${appointmentId}/reschedule`,
        data
      );
      toast.success('Appointment rescheduled!');
      return res.data;          // { message, callLink }
    } catch (error) {
      handleApiError(error, 'Reschedule failed');
    }
  },

  /**
   * Cancel an appointment
   * @param {String} appointmentId
   */
  cancelAppointment: async (appointmentId) => {
    try {
      const res = await axiosInstance.delete(`/appointments/${appointmentId}`);
      toast.success('Appointment cancelled');
      return res.data;          // { message }
    } catch (error) {
      handleApiError(error, 'Cancellation failed');
    }
  },

  /**
   * Update appointment status (doctor/admin only)
   * @param {String} appointmentId
   * @param {String} status  one of 'confirmed' | 'completed' | 'cancelled'
   */
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const res = await axiosInstance.patch(
        `/appointments/${appointmentId}/status`,
        { status }
      );
      toast.success('Status updated');
      return res.data;          // { message }
    } catch (error) {
      handleApiError(error, 'Status update failed');
    }
  },

  /**
   * Retrieve a fresh video-call link
   * @param {String} appointmentId
   */
  getCallLink: async (appointmentId) => {
    try {
      const res = await axiosInstance.get(`/appointments/${appointmentId}/call-link`);
      return res.data;          // { callLink }
    } catch (error) {
      handleApiError(error, 'Unable to get call link');
    }
  },

  /* ------------------------------------------------------------------ */
  /*  Availability slots (doctor only)                                  */
  /* ------------------------------------------------------------------ */

  /**
   * Create a new availability slot
   * @param {Object} data { doctorId, date, startTime, endTime, isRecurring }
   */
  createAvailability: async (data) => {
    try {
      const res = await axiosInstance.post('/availabilities', data);
      toast.success('Availability created');
      return res.data;          // slot object
    } catch (error) {
      handleApiError(error, 'Creation failed');
    }
  },

  /**
   * Update an existing availability slot
   * @param {String} id
   * @param {Object} data { date, startTime, endTime, isRecurring }
   */
  updateAvailability: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/availabilities/${id}`, data);
      toast.success('Availability updated');
      return res.data;
    } catch (error) {
      handleApiError(error, 'Update failed');
    }
  },

  /**
   * Delete an availability slot
   * @param {String} id
   */
  deleteAvailability: async (id) => {
    try {
      const res = await axiosInstance.delete(`/availabilities/${id}`);
      toast.success('Availability deleted');
      return res.data;          // { message }
    } catch (error) {
      handleApiError(error, 'Deletion failed');
    }
  },
};

/* -------------------------------------------------------------------- */
/* Named exports for use inside React components / hooks                */
/* -------------------------------------------------------------------- */
export const {
  bookAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  rescheduleAppointment,
  cancelAppointment,
  updateAppointmentStatus,
  getCallLink,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} = appointmentService;

export default appointmentService;
