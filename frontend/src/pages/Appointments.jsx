import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Plus,
  Filter,
  ChevronRight,
  X,
  User,
  Stethoscope,
  CalendarDays,
  Menu,
} from "lucide-react";
import Sidebar from "../components/Patientsidebar";

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [appointments, setAppointments] = useState({
    upcoming: [
      {
        id: 1,
        doctor: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        date: "Jul 19, 2025",
        time: "10:00 AM",
        type: "Video Consultation",
        status: "confirmed",
        duration: "30 min",
      },
      {
        id: 2,
        doctor: "Dr. Michael Chen",
        specialty: "Dermatologist",
        date: "Jul 24, 2025",
        time: "2:30 PM",
        type: "In-Person",
        status: "confirmed",
        duration: "45 min",
      },
      {
        id: 3,
        doctor: "Dr. Emily Rodriguez",
        specialty: "General Practitioner",
        date: "Aug 2, 2025",
        time: "9:15 AM",
        type: "Video Consultation",
        status: "pending",
        duration: "30 min",
      },
    ],
    past: [
      {
        id: 4,
        doctor: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        date: "Jun 15, 2025",
        time: "11:00 AM",
        type: "Video Consultation",
        status: "completed",
        duration: "30 min",
      },
      {
        id: 5,
        doctor: "Dr. Robert Kim",
        specialty: "Orthopedist",
        date: "May 28, 2025",
        time: "3:00 PM",
        type: "In-Person",
        status: "completed",
        duration: "60 min",
      },
    ],
  });

  const [formData, setFormData] = useState({
    doctor: "",
    specialty: "",
    date: "",
    time: "",
    type: "Video Consultation",
    duration: "30 min",
    reason: "",
    notes: "",
  });

  const doctors = [
    { name: "Dr. Sarah Johnson", specialty: "Cardiologist" },
    { name: "Dr. Michael Chen", specialty: "Dermatologist" },
    { name: "Dr. Emily Rodriguez", specialty: "General Practitioner" },
    { name: "Dr. Robert Kim", specialty: "Orthopedist" },
    { name: "Dr. Lisa Wang", specialty: "Neurologist" },
    { name: "Dr. James Smith", specialty: "Endocrinologist" },
  ];

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "doctor") {
      const selectedDoctor = doctors.find((doc) => doc.name === value);
      if (selectedDoctor) {
        setFormData((prev) => ({
          ...prev,
          specialty: selectedDoctor.specialty,
        }));
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.doctor || !formData.date || !formData.time) {
      alert("Please fill in all required fields");
      return;
    }

    const newAppointment = {
      id: Date.now(),
      doctor: formData.doctor,
      specialty: formData.specialty,
      date: new Date(formData.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: formData.time,
      type: formData.type,
      status: "pending",
      duration: formData.duration,
      reason: formData.reason,
      notes: formData.notes,
    };

    setAppointments((prev) => ({
      ...prev,
      upcoming: [...prev.upcoming, newAppointment],
    }));

    setFormData({
      doctor: "",
      specialty: "",
      date: "",
      time: "",
      type: "Video Consultation",
      duration: "30 min",
      reason: "",
      notes: "",
    });

    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    return type === "Video Consultation" ? (
      <Video className="w-4 h-4 text-blue-600" />
    ) : (
      <MapPin className="w-4 h-4 text-green-600" />
    );
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex bg-gray-50 min-h-screen relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 bg-white border border-gray-300 p-2 rounded-md shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="bg-white w-64 shadow-lg">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Appointments
              </h1>
              <p className="text-gray-600">
                Manage your healthcare appointments
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "upcoming"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Upcoming ({appointments.upcoming.length})
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "past"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Past ({appointments.past.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Appointment List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {(activeTab === "upcoming"
              ? appointments.upcoming
              : appointments.past
            ).map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.doctor}
                        </h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {appointment.specialty}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 flex-wrap">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(appointment.type)}
                          <span>{appointment.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {appointment.status === "confirmed" &&
                      activeTab === "upcoming" && (
                        <>
                          {appointment.type === "Video Consultation" && (
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                              Join Call
                            </button>
                          )}
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                            Reschedule
                          </button>
                        </>
                      )}
                    {appointment.status === "completed" && (
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                        View Summary
                      </button>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(activeTab === "upcoming"
            ? appointments.upcoming
            : appointments.past
          ).length === 0 && (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab} appointments
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === "upcoming"
                  ? "You don't have any upcoming appointments scheduled."
                  : "No past appointments to display."}
              </p>
              {activeTab === "upcoming" && (
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Book Your First Appointment
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Book New Appointment
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Schedule your next healthcare visit
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Select Doctor
                </label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.name} value={doctor.name}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>

              {formData.specialty && (
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={today}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Time
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select time...</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Video className="w-4 h-4 mr-2" />
                    Appointment Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Video Consultation">
                      Video Consultation
                    </option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="15 min">15 minutes</option>
                    <option value="30 min">30 minutes</option>
                    <option value="45 min">45 minutes</option>
                    <option value="60 min">60 minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="e.g., Annual checkup, Follow-up visit, Consultation..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any additional information or special requests..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
