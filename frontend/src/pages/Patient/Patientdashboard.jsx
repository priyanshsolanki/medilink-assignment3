import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Video, Phone, MapPin, User, Search, Filter, ChevronDown, Bell, Plus } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { getAppointmentsByPatient } from '../../api/appointmentService';
import { useAuth } from '../../context/AuthContext';

const PatientAppointmentsDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const {authUser} = useAuth();
  const navigate = useNavigate();

  // Function to generate avatar initials from name
  const getAvatarInitials = (name) => {
    if (!name) return 'DR';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Function to generate consistent color based on name
  const getAvatarColors = (name) => {
    if (!name) return { bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
    
    const colors = [
      { bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
      { bgColor: 'bg-green-100', textColor: 'text-green-600' },
      { bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
      { bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
      { bgColor: 'bg-red-100', textColor: 'text-red-600' },
      { bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' },
      { bgColor: 'bg-pink-100', textColor: 'text-pink-600' },
      { bgColor: 'bg-teal-100', textColor: 'text-teal-600' },
      { bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
      { bgColor: 'bg-cyan-100', textColor: 'text-cyan-600' },
      { bgColor: 'bg-lime-100', textColor: 'text-lime-600' },
      { bgColor: 'bg-emerald-100', textColor: 'text-emerald-600' }
    ];

    // Create a simple hash from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use absolute value and modulo to get consistent color index
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  // Sample patient appointments data
  const [appointments, setAppointments] = useState([
    // {
    //   id: 1,
    //   doctorName: "Dr. Sarah Johnson",
    //   specialty: "Cardiologist",
    //   date: "2025-07-25",
    //   time: "10:00 AM",
    //   duration: "30 min",
    //   type: "Video Consultation",
    //   status: "Upcoming",
    //   hospital: "City Medical Center",
    //   reason: "Follow-up consultation for heart checkup",
    //   canReschedule: true,
    //   canCancel: true
    // },
    // {
    //   id: 2,
    //   doctorName: "Dr. Michael Chen",
    //   specialty: "Dermatologist",
    //   date: "2025-07-28",
    //   time: "2:30 PM",
    //   duration: "45 min",
    //   type: "In-Person",
    //   status: "Upcoming",
    //   hospital: "Skin Care Clinic",
    //   reason: "Skin condition assessment",
    //   canReschedule: true,
    //   canCancel: true
    // },
    // {
    //   id: 3,
    //   doctorName: "Dr. Emily Rodriguez",
    //   specialty: "General Physician",
    //   date: "2025-07-22",
    //   time: "9:15 AM",
    //   duration: "30 min",
    //   type: "Phone Consultation",
    //   status: "Completed",
    //   hospital: "Community Health Center",
    //   reason: "Annual health checkup",
    //   canReschedule: false,
    //   canCancel: false
    // },
    // {
    //   id: 4,
    //   doctorName: "Dr. David Wilson",
    //   specialty: "Orthopedist",
    //   date: "2025-08-02",
    //   time: "11:00 AM",
    //   duration: "60 min",
    //   type: "In-Person",
    //   status: "Upcoming",
    //   hospital: "Orthopedic Specialists",
    //   reason: "Knee pain evaluation",
    //   canReschedule: true,
    //   canCancel: true
    // },
    // {
    //   id: 5,
    //   doctorName: "Dr. Lisa Thompson",
    //   specialty: "Psychiatrist",
    //   date: "2025-07-20",
    //   time: "3:00 PM",
    //   duration: "45 min",
    //   type: "Video Consultation",
    //   status: "Cancelled",
    //   hospital: "Mental Health Associates",
    //   reason: "Therapy session",
    //   canReschedule: false,
    //   canCancel: false
    // }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Rescheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video Consultation':
        return <Video className="w-4 h-4" />;
      case 'Phone Consultation':
        return <Phone className="w-4 h-4" />;
      case 'In-Person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  useEffect(() => {
    getAppointmentsByPatient(authUser.id)
      .then((data) => setAppointments(data))
      .catch((err) => console.error(err))
      .finally(() => {});
  }, []);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesTab = selectedTab === 'all' || 
      (selectedTab === 'confirmed' && appointment.status === 'confirmed') ||
      (selectedTab === 'completed' && appointment.status === 'completed') ||
      (selectedTab === 'cancelled' && appointment.status === 'cancelled');

    const matchesSearch = appointment.doctorName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      appointment.specialty?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchTerm?.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || appointment.type === selectedFilter;

    return matchesTab && matchesSearch && matchesFilter;
  });

  const getTabCount = (tab) => {
    return appointments.filter(appointment => 
      tab === 'all' || appointment.status === (tab.toLowerCase())
    ).length;
  };

  return (
    <main className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="pt-20 lg:pt-0 flex-1 ">
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your healthcare appointments</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <button onClick={()=>navigate('/patient/book-appointment')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{getTabCount('confirmed')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{getTabCount('completed')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'all', label: 'All', count: getTabCount('all') },
                { id: 'confirmed', label: 'Confirmed', count: getTabCount('confirmed') },
                { id: 'completed', label: 'Completed', count: getTabCount('completed') },
                { id: 'cancelled', label: 'Cancelled', count: getTabCount('cancelled') }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor, specialty, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      {['all', 'Video Consultation', 'Phone Consultation', 'In-Person'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setSelectedFilter(filter);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm ${
                            selectedFilter === filter ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          {filter === 'all' ? 'All Types' : filter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => {
              const avatarColors = getAvatarColors(appointment.doctorName);
              const avatarInitials = getAvatarInitials(appointment.doctorName);
              
              return (
                <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Section - Doctor Info */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-12 h-12 ${avatarColors.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className={`${avatarColors.textColor} font-semibold text-lg`}>
                            {avatarInitials}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {appointment.doctorName}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{appointment.specialty}</p>
                          <p className="text-sm text-gray-500 mb-3">{appointment.hospital}</p>
                          <p className="text-sm text-gray-700">{appointment.reason}</p>
                        </div>
                      </div>

                      {/* Right Section - Appointment Details */}
                      <div className="lg:text-right space-y-3">
                        <div className="flex lg:flex-col items-start lg:items-end gap-2">
                          <div className="flex items-center text-gray-600 text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="font-medium">{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{appointment.time} ({appointment.duration || "30 min"})</span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            {getTypeIcon(appointment.type)}
                            <span className="ml-2">{appointment.type}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                          {appointment.status === 'confirmed' && (
                            <>
                              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                Join Call
                              </button>
                              {(
                                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                                  Reschedule
                                </button>
                              )}
                              {(
                                <button className="px-4 py-2 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors">
                                  Cancel
                                </button>
                              )}
                            </>
                          )}
                          {appointment.status === 'Completed' && (
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                              View Summary
                            </button>
                          )}
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Need to book a new appointment?</h3>
              <p className="text-blue-100">Find the right doctor and schedule your visit</p>
            </div>
            <button onClick={()=>navigate('/patient/book-appointment')}  className="mt-4 md:mt-0 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Find Doctors
            </button>
          </div>
        </div>
      </div>
    </div>
    </main>
    </main>
  );
};

export default PatientAppointmentsDashboard;