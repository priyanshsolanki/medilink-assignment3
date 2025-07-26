import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  Calendar,
  MapPin,
  FileText,
  Settings,
  Clock,
  Bell,
  HelpCircle,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6 h-screen sticky top-0">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Telehealth Patient
        </h1>
        <p className="text-sm text-gray-600">Comprehensive health portal</p>
      </div>

      <nav className="space-y-1 mb-8">
        <Link
          to="/patient-dashboard"
          className={`flex items-center px-4 py-3 rounded-lg ${
            isActive("/dashboard")
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <User className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/pharmacy-locator"
          className={`flex items-center px-4 py-3 rounded-lg ${
            isActive("/pharmacy")
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <MapPin className="w-5 h-5 mr-3" />
          <span>Pharmacy Locator</span>
        </Link>
        <Link
          to="/medical-history"
          className={`flex items-center px-4 py-3 rounded-lg ${
            isActive("/history")
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FileText className="w-5 h-5 mr-3" />
          <span>Medical History</span>
        </Link>
        <Link
          to="/patient-profile"
          className={`flex items-center px-4 py-3 rounded-lg ${
            isActive("/profile")
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Settings className="w-5 h-5 mr-3" />
          <span>My Profile</span>
        </Link>
      </nav>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Link to="/notifications">
            <button className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
              <Bell className="w-5 h-5 mr-3 text-gray-400" />
              <span>Notifications</span>
            </button>
          </Link>
          <Link to="/appointments">
            <button className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 mr-3 text-gray-400" />
              <span>Appointments</span>
            </button>
          </Link>
          <Link to="/help-center">
            <button className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
              <HelpCircle className="w-5 h-5 mr-3 text-gray-400" />
              <span>Help Center</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">Patient</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
