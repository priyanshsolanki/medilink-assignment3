import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  Home,
  User2,
  Menu,
  X,
  Calendar,
  FileText,
  Users,
  Settings,
  Timer,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout, authUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const userFirstName = authUser?.name?.split(" ")[0];
  const userRole = authUser?.role; // 'doctor' or 'patient'

  const doctorNavItems = [
    { name: "Home", icon: <Home size={20} />, path: "/doctor/dashboard" },
    { name: "Profile", icon: <User2 size={20} />, path: "/profile" },
    { name: "Appointments", icon: <Calendar size={20} />, path: "/doctor/appointment" },
    { name: "Patients", icon: <Users size={20} />, path: "/patient-directory" },
    { name: "Availability", icon: <Timer size={20} />, path: "/availability" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const patientNavItems = [
    { name: "Home", icon: <Home size={20} />, path: "/patient/dashboard" },
    { name: "Profile", icon: <User2 size={20} />, path: "/patient/profile" },
    { name: "Book Appointment", icon: <Calendar size={20} />, path: "/patient/book-appointment" },
    { name: "Reports", icon: <FileText size={20} />, path: "/patient/medical-history" },
    { name: "Pharmacy locator", icon: <MapPin size={20} />, path: "/pharmacy-locator" },

  ];

  const navItems = userRole === "doctor" ? doctorNavItems : patientNavItems;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40 h-16">
        <div className="flex items-center justify-between p-4">
          <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:text-gray-800">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold text-gray-800">Medilink</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg fixed lg:static top-16 lg:top-0 h-[calc(100vh-64px)] lg:h-auto p-6 flex flex-col justify-between overflow-y-auto transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div>
          {authUser && userFirstName && (
            <div className="flex items-center space-x-3 p-3 rounded-lg mb-6">
              <img
                src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?w=1480"
                alt="User"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
              <span className="text-gray-700 font-semibold">{userFirstName}</span>
            </div>
          )}

          <nav className="space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-gray-700 p-3 rounded-lg w-full text-left transition ${
                    isActive ? "bg-blue-100 text-blue-600" : "hover:bg-blue-50"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <NavLink
            to="/logout"
            onClick={() => logout()}
            className="flex items-center space-x-3 text-red-600 hover:bg-red-50 p-3 rounded-lg"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </NavLink>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
