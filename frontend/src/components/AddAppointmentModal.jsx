import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddAppointmentModal = ({ onClose, onSubmit }) => {
  const validationSchema = Yup.object({
    doctor: Yup.string().required("Doctor name is required"),
    date: Yup.string().required("Date is required"),
    time: Yup.string().required("Time is required"),
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
        <Formik
          initialValues={{ doctor: "", date: "", time: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onSubmit(values);
            onClose();
          }}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Doctor</label>
                <Field
                  type="text"
                  name="doctor"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
                <ErrorMessage
                  name="doctor"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Date</label>
                <Field
                  type="date"
                  name="date"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Time</label>
                <Field
                  type="time"
                  name="time"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
                <ErrorMessage
                  name="time"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
