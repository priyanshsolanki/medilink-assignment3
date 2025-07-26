// src/api/recordService.js
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
  const message = error?.response?.data?.message || fallbackMessage;
  toast.error(message);
  throw new Error(message);
};

const recordService = {
  /* ------------------------------------------------------------------ */
  /*  Patient Records                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Fetch all non-deleted records for a patient
   * GET /api/patients/:patientId/records
   */
  getRecords: async (patientId) => {
    try {
      const res = await axiosInstance.get(`/patients/${patientId}/records`);
      return res.data; // Array of record objects
    } catch (error) {
      handleApiError(error, 'Could not load records');
    }
  },

  /**
   * Fetch a single record by ID
   * GET /api/records/:recordId
   */
  getRecord: async (recordId) => {
    try {
      const res = await axiosInstance.get(`/records/${recordId}`);
      return res.data; // Record object
    } catch (error) {
      handleApiError(error, 'Could not load record');
    }
  },

  /**
   * Create a new record for a patient (with optional file upload)
   * POST /api/patients/:patientId/records
   * @param {String} patientId
   * @param {Object} data { title, type, notes, file (File) }
   */
  createRecord: async (patientId, data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('notes', data.notes);
      if (data.file) formData.append('file', data.file);
      const res = await axiosInstance.post(
        `/patients/${patientId}/records`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Record created');
      return res.data;
    } catch (error) {
      handleApiError(error, 'Creation failed');
    }
  },

  /**
   * Update an existing record
   * PUT /api/records/:recordId
   * @param {String} recordId
   * @param {Object} updates { title?, type?, notes? }
   */
  updateRecord: async (recordId, updates) => {
    try {
      const formData = new FormData();
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'file' && value) {
          formData.append('file', value);
        } else {
          formData.append(key, value);
        }
      });
      const config = formData.has('file')
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};

      const res = await axiosInstance.put(
        `/records/${recordId}`,
        formData,
        config
      );
      toast.success('Record updated');
      return res.data;
    } catch (error) {
      handleApiError(error, 'Update failed');
    }
  },

  /**
   * Soft-delete a record
   * DELETE /api/records/:recordId
   */
  deleteRecord: async (recordId) => {
    try {
      const res = await axiosInstance.delete(`/records/${recordId}`);
      toast.success('Record deleted');
      return res.data; // { message, record }
    } catch (error) {
      handleApiError(error, 'Deletion failed');
    }
  },

  /**
   * Download a record's file
   * GET /api/records/:recordId/download
   */
  downloadRecordFile: async (recordId) => {
    try {
      const res = await axiosInstance.get(`/records/${recordId}/download`);
      return res.data.fileUrl;   // now returns { fileUrl }
    } catch (error) {
      handleApiError(error, 'Could not fetch file URL');
    }
  },
};

export const {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  downloadRecordFile,
} = recordService;

export default recordService;
