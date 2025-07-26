import React, { useState, useMemo, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Star,
  X,
  Check,
  Search,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import availabilityService from "../../api/availabilityService";
import appointmentService from "../../api/appointmentService";

const BookingSchema = Yup.object().shape({
  reason: Yup.string()
    .min(10, "Please provide more details (minimum 10 characters)")
    .required("Reason for visit is required"),
});

// Helper function to generate letter avatar
const getLetterAvatar = (name) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Generate a consistent background color based on the name
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500'
  ];
  
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  
  return {
    initials,
    bgColor: colors[colorIndex]
  };
};

// Letter Avatar Component
const LetterAvatar = ({ name, size = "w-16 h-16", textSize = "text-lg" }) => {
  const { initials, bgColor } = getLetterAvatar(name);
  
  return (
    <div className={`${size} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold ${textSize}`}>
      {initials}
    </div>
  );
};

export default function DoctorAppointmentBooking() {
  const { authUser } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch doctors with availability
  useEffect(() => {
    availabilityService.getAllAvailability()
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load doctors. Please try again.");
        setLoading(false);
      });
  }, []);

  // specialties derived from fetched doctors
  const specialties = useMemo(() => {
    const set = new Set(doctors.map((d) => d.specialty));
    return ["All", ...Array.from(set)];
  }, [doctors]);

  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const filteredDoctors = useMemo(() => {
    let list = selectedSpecialty === "All"
      ? doctors
      : doctors.filter((doc) => doc.specialty === selectedSpecialty);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.location.toLowerCase().includes(q)
      );
    }
    return list;
  }, [doctors, selectedSpecialty, searchQuery]);

  const formik = useFormik({
    initialValues: { reason: "" },
    validationSchema: BookingSchema,
    onSubmit: async (values, { resetForm }) => {
      setBookingLoading(true);
      
      const payload = {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        patientId: authUser.id,
        reason: values.reason,
      };
      
      try {
        await appointmentService.bookAppointment(payload);
        
        // Update local state to remove booked slot
        setDoctors(prevDoctors => 
          prevDoctors.map(doc => {
            if (doc.id === selectedDoctor.id) {
              const updatedAvailability = { ...doc.availability };
              if (updatedAvailability[selectedDate]) {
                updatedAvailability[selectedDate] = updatedAvailability[selectedDate].filter(
                  slot => slot.availabilityId !== selectedSlot?.availabilityId
                );
              }
              return { ...doc, availability: updatedAvailability };
            }
            return doc;
          })
        );
        
        setShowSuccessModal(true);
        setShowBookingForm(false);
        setSelectedDoctor(null);
        setSelectedDate("");
        setSelectedTime("");
        setSelectedSlot(null);
        resetForm();
      } catch (err) {
        console.error("Booking error:", err);
        setError("Failed to book appointment. Please try again.");
      } finally {
        setBookingLoading(false);
      }
    },
  });

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedSlot(null);
  };

  const handleTimeSlotSelect = (date, slot) => {
    setSelectedDate(date);
    setSelectedTime(slot.startTime);
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const getAvailableDates = () => {
    return selectedDoctor
      ? Object.keys(selectedDoctor.availability).sort()
      : [];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="pt-20 lg:pt-0 flex-1">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading doctors...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pt-20 lg:pt-0 flex-1">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
              <button 
                onClick={() => setError(null)} 
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctors..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex flex-wrap gap-2">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSpecialty === spec
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor List */}
          {!selectedDoctor && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <LetterAvatar 
                      name={doctor.name} 
                      size="w-16 h-16" 
                      textSize="text-lg"
                    />
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold">{doctor.name}</h3>
                      <p className="text-blue-600 flex items-center">
                        <Stethoscope className="w-4 h-4 mr-1" /> {doctor.specialty}
                      </p>
                      {doctor.location && (
                        <p className="text-gray-500 text-sm flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" /> {doctor.location}
                        </p>
                      )}
                      {doctor.rating && (
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm">{doctor.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {Object.values(doctor.availability || {}).flat().length} slots available
                    </div>
                    <button
                      onClick={() => handleDoctorSelect(doctor)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      View Availability
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Availability & Booking */}
          {selectedDoctor && (
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <LetterAvatar 
                    name={selectedDoctor.name} 
                    size="w-16 h-16" 
                    textSize="text-lg"
                  />
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">{selectedDoctor.name}</h2>
                    <p className="text-blue-600">{selectedDoctor.specialty}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDoctor(null)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <h3 className="font-semibold mb-3">Select a Date</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {getAvailableDates().map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      selectedDate === date
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {new Date(date).toLocaleDateString()}
                  </button>
                ))}
              </div>
              {selectedDate && (
                <>
                  <h3 className="font-semibold mb-3">Select a Time Slot</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {selectedDoctor.availability[selectedDate].map((slot) => (
                      <button
                        key={slot.availabilityId + slot.startTime}
                        onClick={() => handleTimeSlotSelect(selectedDate, slot)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          selectedTime === slot.startTime
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Booking Modal */}
          {showBookingForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Book Appointment</h3>
                  <button onClick={() => setShowBookingForm(false)}>
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <LetterAvatar 
                      name={selectedDoctor.name} 
                      size="w-10 h-10" 
                      textSize="text-sm"
                    />
                    <div className="ml-3">
                      <p className="font-semibold">{selectedDoctor.name}</p>
                      <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <strong>Time:</strong> {selectedTime}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for visit *
                    </label>
                    <textarea
                      name="reason"
                      rows={3}
                      value={formik.values.reason}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="Please describe your symptoms or reason for the visit..."
                    />
                    {formik.touched.reason && formik.errors.reason && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.reason}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={formik.handleSubmit}
                      disabled={bookingLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Booking...
                        </>
                      ) : (
                        "Confirm"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
                <CheckCircle2 className="mx-auto mb-4 w-8 h-8 text-green-600" />
                <h3 className="text-lg font-semibold mb-2">Appointment Booked!</h3>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}