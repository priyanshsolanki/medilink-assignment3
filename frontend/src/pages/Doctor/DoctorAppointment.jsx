import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Sidebar from "../../components/Sidebar";
import appointmentService, { getAppointmentsByDoctor } from "../../api/appointmentService";
import { useAuth } from "../../context/AuthContext";

// Validation schema using Yup
const appointmentValidationSchema = Yup.object({
  name: Yup.string()
    .required("Patient name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  age: Yup.number()
    .required("Age is required")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120")
    .integer("Age must be a whole number"),
  time: Yup.string()
    .required("Time is required"),
  duration: Yup.number()
    .required("Duration is required")
    .min(15, "Duration must be at least 15 minutes")
    .max(180, "Duration cannot exceed 180 minutes"),
  type: Yup.string()
    .required("Consultation type is required")
    .oneOf(["Video Consultation", "Phone Consultation", "In-Person"], "Invalid consultation type"),
  status: Yup.string()
    .required("Status is required")
    .oneOf(["Pending", "Confirmed", "Scheduled"], "Invalid status"),
  description: Yup.string()
    .max(500, "Description must be less than 500 characters")
});

const ScheduleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const {authUser} = useAuth();
  const [appointments, setAppointments] = useState([  ]);

  const initialFormValues = {
    name: "",
    age: "",
    time: "",
    duration: 30,
    type: "Video Consultation",
    description: "",
    status: "Pending",
  };

  const timeSlots = [
    { time: "08:00", available: true },
    { time: "08:30", available: true },
    { time: "09:00", available: false },
    { time: "09:30", available: true },
    { time: "10:00", available: true },
    { time: "10:30", available: false },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: true },
    { time: "12:30", available: true },
    { time: "13:00", available: true },
    { time: "13:30", available: true },
    { time: "14:00", available: false },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: false },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
    { time: "17:00", available: true },
    { time: "17:30", available: true },
  ];
// fetch existing appointments on mount
  useEffect(() => {
    appointmentService
      .getAppointmentsByDoctor(authUser?.id)
      .then((data) => setAppointments(data))
      .catch(() => {});
  }, []);

  // Helper functions for calendar
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getBgColor = (index) => {
    const colors = [
      "bg-blue-100",
      "bg-purple-100",
      "bg-pink-100",
      "bg-green-100",
      "bg-yellow-100",
      "bg-red-100",
    ];
    return colors[index % colors.length];
  };

  const getTextColor = (index) => {
    const colors = [
      "text-blue-600",
      "text-purple-600",
      "text-pink-600",
      "text-green-600",
      "text-yellow-600",
      "text-red-600",
    ];
    return colors[index % colors.length];
  };
  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        name: values.name,
        age: values.age,
        time: values.time,
        duration: values.duration,
        type: values.type,
        description: values.description,
        status: values.status,
      };
      const created = await appointmentService.bookAppointment(payload);
      // append new appointment
      setAppointments((prev) => [...prev, created]);
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      // error toast shown by service
    } finally {
      setSubmitting(false);
    }
  };

  // handle delete via API
  const handleDeleteAppointment = async () => {
    try {
      await appointmentService.cancelAppointment(selectedAppointment.id);
      setAppointments((prev) => prev.filter((app) => app.id !== selectedAppointment.id));
      setIsDeleteModalOpen(false);
      setSelectedAppointment(null);
    } catch {
      // error toast
    }
  };

  useEffect(() => {
    getAppointmentsByDoctor(authUser.id)
      .then((data) => setAppointments(data))
      .catch((err) => console.error(err))
      .finally(() => {});
  }, []);

  // const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
  //   // Check if the selected time slot is still available
  //   const selectedTimeSlot = timeSlots.find(slot => slot.time === values.time);
  //   if (!selectedTimeSlot || !selectedTimeSlot.available) {
  //     alert("Selected time slot is no longer available. Please choose another time.");
  //     setSubmitting(false);
  //     return;
  //   }

  //   const newAppointment = {
  //     id: appointments.length + 1,
  //     name: values.name,
  //     age: parseInt(values.age),
  //     time: values.time,
  //     duration: `${values.duration} min`,
  //     type: values.type,
  //     description: values.description,
  //     status: values.status,
  //     initials: getInitials(values.name),
  //     bgColor: getBgColor(appointments.length),
  //     textColor: getTextColor(appointments.length),
  //   };

  //   setAppointments((prev) => [...prev, newAppointment]);
  //   resetForm();
  //   setIsModalOpen(false);
  //   setSubmitting(false);
  // };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Video Consultation":
        return "📹";
      case "Phone Consultation":
        return "📞";
      case "In-Person":
        return "🏥";
      default:
        return "📋";
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  // const handleDeleteAppointment = () => {
  //   setAppointments(
  //     appointments.filter((app) => app.id !== selectedAppointment.id)
  //   );
  //   setIsDeleteModalOpen(false);
  //   setSelectedAppointment(null);
  // };

  // Custom Field Components for better styling
  const CustomField = ({ name, type = "text", placeholder, className, children, ...props }) => (
    <Field name={name}>
      {({ field, meta }) => (
        <div>
          {type === "select" ? (
            <select
              {...field}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
              } ${className}`}
              {...props}
            >
              {children}
            </select>
          ) : type === "textarea" ? (
            <textarea
              {...field}
              placeholder={placeholder}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
              } ${className}`}
              {...props}
            />
          ) : (
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
              } ${className}`}
              {...props}
            />
          )}
          <ErrorMessage name={name} component="div" className="text-red-500 text-xs mt-1" />
        </div>
      )}
    </Field>
  );

  // Format the current date for display
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 lg:flex-row">
      <Sidebar/>
      <main className="pt-20 lg:pt-0 flex-1 ">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {formattedDate}
            </h2>
            <div className="flex space-x-2 sm:space-x-4 mt-2">
              <button className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-medium">
                Day
              </button>
              <button className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs sm:text-sm font-medium">
                Week
              </button>
              <button className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs sm:text-sm font-medium">
                Month
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 sm:space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-red-500 rounded-full"></div>
              <span className="text-xs sm:text-sm text-gray-600">3</span>
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full sm:w-64 pl-8 sm:pl-10 pr-3 py-1 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="absolute left-2 sm:left-3 top-2 sm:top-2.5 text-gray-400">
                🔍
              </div>
            </div>
            <button className="px-3 py-1 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xs sm:text-sm">
              Filter
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 sm:px-6 py-1 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-xs sm:text-sm"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 lg:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Today's Schedule
              </h3>
              <span className="text-xs sm:text-sm text-gray-500">
                {appointments.length} appointments
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 sm:p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div
                      className={`w-8 sm:w-10 h-8 sm:h-10 ${appointment.bgColor} rounded-full flex items-center justify-center`}
                    >
                      <span
                        className={`${appointment.textColor} font-medium text-sm sm:text-base`}
                      >
                        {appointment.initials}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                        {appointment?.patientId?.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                      {appointment?.patientId?.email}
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      <span>🕘</span>
                      <span>
                        {appointment.time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      <span>{getTypeIcon(appointment.type)}</span>
                      <span>{appointment.date}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                      {appointment.description}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                      {appointment.isNewPatient && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          New Patient
                        </span>
                      )}
                      <button
                        onClick={() => handleViewAppointment(appointment)}
                        className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm"
                      >
                        View
                      </button>
                      <button className="text-green-500 hover:text-green-700 text-xs sm:text-sm">
                        Start Call
                      </button>
                      <button
                        onClick={() => handleDeleteClick(appointment)}
                        className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </main>
    </div>
  );
};

export default ScheduleManagement;