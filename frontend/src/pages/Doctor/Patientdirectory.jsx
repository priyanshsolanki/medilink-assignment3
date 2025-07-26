import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  MapPin,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  User,
  Users,
  Clock,
  FileText,
  Menu,
  X,
  ChevronDown,
  Download,
  MessageCircle,
  Activity,
  Heart,
  AlertCircle,
  CheckCircle,
  Calendar,
  Grid3X3,
  List,
  SortAsc,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import userService from "../../api/userService";

const PatientDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);

  // Function to generate avatar initials from name
  const getAvatarInitials = (name) => {
    if (!name) return 'PT';
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
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Sample patients with basic data
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      dob: "1990-08-15",
      gender: "Female",
      joinDate: "2023-03-15"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@email.com",
      dob: "1995-03-22",
      gender: "Male",
      joinDate: "2023-08-22"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      dob: "1978-12-05",
      gender: "Female",
      joinDate: "2022-11-10"
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@email.com",
      dob: "1971-09-18",
      gender: "Male",
      joinDate: "2022-01-05"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      email: "lisa.thompson@email.com",
      dob: "1994-11-30",
      gender: "Female",
      joinDate: "2024-02-14"
    },
    {
      id: 6,
      name: "Robert Martinez",
      email: "robert.martinez@email.com",
      dob: "1985-06-10",
      gender: "Male",
      joinDate: "2023-01-20"
    },
    {
      id: 7,
      name: "Jennifer Davis",
      email: "jennifer.davis@email.com",
      dob: "1992-04-03",
      gender: "Female",
      joinDate: "2023-05-12"
    },
  ]);

  const filteredAndSortedPatients = patients
    .filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.gender.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        selectedFilter === "all" || 
        (selectedFilter === "male" && patient.gender.toLowerCase() === "male") ||
        (selectedFilter === "female" && patient.gender.toLowerCase() === "female") ||
        (selectedFilter === "recent" && new Date(patient.joinDate) > new Date('2023-01-01'));

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'age':
          aValue = calculateAge(a.dob);
          bValue = calculateAge(b.dob);
          break;
        case 'gender':
          aValue = a.gender.toLowerCase();
          bValue = b.gender.toLowerCase();
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate);
          bValue = new Date(b.joinDate);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const getPatientStats = () => {
    return {
      total: patients.length,
      male: patients.filter(p => p.gender.toLowerCase() === 'male').length,
      female: patients.filter(p => p.gender.toLowerCase() === 'female').length,
      recent: patients.filter(p => new Date(p.joinDate) > new Date('2023-01-01')).length
    };
  };

  useEffect(() => {
    setIsLoading(true);
      userService.getAllPatients()
        .then((data) => setPatients(data))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
  }, []);

  const stats = getPatientStats();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 lg:flex-row">
      <Sidebar />
      <main className="pt-20 lg:pt-0 flex-1">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Header */}
          <div className="">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
                  <p className="text-sm text-gray-600 mt-1">Manage and view all patient information</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Male</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.male}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-pink-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Female</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.female}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">New (2023+)</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.recent}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="p-6">
                {/* Search and Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients by name, email, or gender..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg ${
                          viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <Grid3X3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg ${
                          viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Filter Options */}
                {showFilters && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter By</label>
                        <select
                          value={selectedFilter}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Patients</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="recent">New Patients (2023+)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="name">Name</option>
                          <option value="age">Age</option>
                          <option value="gender">Gender</option>
                          <option value="joinDate">Join Date</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="asc">Ascending</option>
                          <option value="desc">Descending</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Patient List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Patients ({filteredAndSortedPatients.length})
                  </h3>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAndSortedPatients.map((patient) => {
                      const avatarColors = getAvatarColors(patient.name);
                      const avatarInitials = getAvatarInitials(patient.name);
                      const age = calculateAge(patient.dob);
                      
                      return (
                        <div
                          key={patient._id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 ${avatarColors.bgColor} rounded-full flex items-center justify-center`}>
                                <span className={`${avatarColors.textColor} font-semibold text-lg`}>
                                  {avatarInitials}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {patient.name}
                                </h3>
                                <p className="text-xs text-gray-600">
                                  {age} years, {patient.gender}
                                </p>
                              </div>
                            </div>
                            <div className="relative">
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{patient.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <CalendarIcon className="w-3 h-3" />
                              <span>DOB: {formatDate(patient.dob)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <UserPlus className="w-3 h-3" />
                              <span>Joined: {formatDate(patient.createdAt)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/doctor/chat/${patient._id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleViewPatient(patient)}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              patient.gender.toLowerCase() === 'male' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-pink-100 text-pink-800'
                            }`}>
                              {patient.gender}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAndSortedPatients.map((patient) => {
                      const avatarColors = getAvatarColors(patient.name);
                      const avatarInitials = getAvatarInitials(patient.name);
                      const age = calculateAge(patient.dob);
                      
                      return (
                        <div
                          key={patient._id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-10 h-10 ${avatarColors.bgColor} rounded-full flex items-center justify-center`}>
                              <span className={`${avatarColors.textColor} font-semibold`}>
                                {avatarInitials}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-medium text-gray-900">{patient.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  patient.gender.toLowerCase() === 'male' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-pink-100 text-pink-800'
                                }`}>
                                  {patient.gender}
                                </span>
                              </div>
                              <div className="flex items-center gap-6 text-sm text-gray-600">
                                <span>{age} years</span>
                                <span>{patient.email}</span>
                                <span>DOB: {formatDate(patient.dob)}</span>
                                <span>Joined: {formatDate(patient.joinDate)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/doctor/chat/${patient._id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleViewPatient(patient)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {filteredAndSortedPatients.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Details Modal */}
        {showPatientDetails && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[100vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${getAvatarColors(selectedPatient.name).bgColor} rounded-full flex items-center justify-center`}>
                    <span className={`${getAvatarColors(selectedPatient.name).textColor} font-semibold text-lg`}>
                      {getAvatarInitials(selectedPatient.name)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-sm text-gray-600">Patient ID: {selectedPatient._id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPatientDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Full Name</p>
                            <p className="font-medium">{selectedPatient.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Date of Birth</p>
                            <p className="font-medium">{formatDate(selectedPatient.dob)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Age</p>
                            <p className="font-medium">{calculateAge(selectedPatient.dob)} years</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Gender</p>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              selectedPatient.gender.toLowerCase() === 'male' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-pink-100 text-pink-800'
                            }`}>
                              {selectedPatient.gender}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{selectedPatient.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Join Date</p>
                            <p className="font-medium">{formatDate(selectedPatient.joinDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Phone Number</p>
                            <p className="font-medium">+1 (555) 123-4567</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Address</p>
                            <p className="font-medium">123 Main St, City, State 12345</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Emergency Contact</p>
                            <p className="font-medium">John Doe - +1 (555) 987-6543</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Blood Type</p>
                            <p className="font-medium">O+</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-900">Recent Visits</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">3</p>
                          <p className="text-sm text-blue-700">Last 6 months</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-900">Appointments</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">12</p>
                          <p className="text-sm text-green-700">Completed</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            <span className="font-medium text-yellow-900">Prescriptions</span>
                          </div>
                          <p className="text-2xl font-bold text-yellow-600">2</p>
                          <p className="text-sm text-yellow-700">Active</p>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Known Allergies</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            Penicillin
                          </span>
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            Shellfish
                          </span>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Chronic Conditions</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                            Hypertension
                          </span>
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                            Diabetes Type 2
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Annual Checkup</p>
                          <p className="text-sm text-gray-600">Completed routine examination and blood work</p>
                          <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Prescription Refill</p>
                          <p className="text-sm text-gray-600">Refilled blood pressure medication</p>
                          <p className="text-xs text-gray-500 mt-1">1 week ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Lab Results</p>
                          <p className="text-sm text-gray-600">Blood glucose levels within normal range</p>
                          <p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/doctor/chat/${selectedPatient._id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Start Chat</span>
                  </Link>
                </div>
                <button
                  onClick={() => setShowPatientDetails(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDirectory;