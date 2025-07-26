import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Share2,
  Printer,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";

const MedicalHistory = () => {
  const [medicalRecords] = useState([
    {
      id: 1,
      type: "Lab Results",
      date: "2025-06-10",
      title: "Blood Test Results",
      doctor: "Dr. Sarah Johnson",
      files: ["Complete Blood Count.pdf", "Cholesterol Panel.pdf"],
    },
    {
      id: 2,
      type: "Imaging",
      date: "2025-05-15",
      title: "Chest X-Ray",
      doctor: "Dr. Michael Chen",
      files: ["X-Ray_20250515.pdf", "Radiology_Report.pdf"],
    },
    {
      id: 3,
      type: "Prescription",
      date: "2025-04-22",
      title: "Medication Renewal",
      doctor: "Dr. Emily Rodriguez",
      files: ["Prescription_Atorvastatin.pdf"],
    },
    {
      id: 4,
      type: "Consultation Notes",
      date: "2025-03-18",
      title: "Annual Checkup",
      doctor: "Dr. David Wilson",
      files: ["Consultation_Notes.pdf"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || record.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="pt-20 lg:pt-0 flex-1 ">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Medical History
              </h1>
              <p className="text-gray-600">
                View and manage your medical records
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Records</option>
                  <option value="Lab Results">Lab Results</option>
                  <option value="Imaging">Imaging</option>
                  <option value="Prescription">Prescriptions</option>
                  <option value="Consultation Notes">Consultation Notes</option>
                </select>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Medical Records List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">
                Medical Records ({filteredRecords.length})
              </h2>
            </div>
            <div className="p-6">
              {filteredRecords.length > 0 ? (
                <div className="space-y-6">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.type === "Lab Results"
                                  ? "bg-purple-100 text-purple-800"
                                  : record.type === "Imaging"
                                  ? "bg-blue-100 text-blue-800"
                                  : record.type === "Prescription"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {record.type}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(record.date)}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mt-2">
                            {record.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {record.doctor}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mt-4">
                        <h4 className="text-sm font-medium text-gray-700">
                          Files:
                        </h4>
                        <div className="space-y-2">
                          {record.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-700">
                                  {file}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="p-1 text-blue-600 hover:text-blue-800">
                                  <Download className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-600 hover:text-gray-800">
                                  <Share2 className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-600 hover:text-gray-800">
                                  <Printer className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No medical records found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
};

export default MedicalHistory;
