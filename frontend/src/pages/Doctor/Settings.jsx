import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AlarmClock, BellDot, Mail, Phone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const Settings = () => {
  const [date, setDate] = useState(new Date());
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    sms: false,
    push: true,
    reminder: true,
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const appointments = [
    { id: 1, name: "Sarah Johnson" },
    { id: 2, name: "Michael Chen" },
  ];

  const toggleNotification = (type) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar/>

      <main className="pt-20 lg:pt-0 flex-1 ">
      {/* Main Content */}
      {/* <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8"> */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h2>
        <p className="text-gray-600 mb-6">
          Manage your account and application preferences
        </p>

        {/* Profile Section */}
        <section className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-xl font-semibold mb-1">Profile Settings</h3>
          <p className="text-gray-600 mb-4">
            Manage your personal information and account preferences
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Dr. Sarah Johnson"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="sarah.johnson@clinic.com"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Specialty
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>General Medicine</option>
                <option>Cardiology</option>
                <option>Neurology</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h3 className="text-xl font-semibold mb-4">
            Notification Preferences
          </h3>
          <div className="space-y-4">
            {[
              { key: "email", label: "Email Notifications", icon: Mail },
              { key: "sms", label: "SMS Notifications", icon: Phone },
              { key: "push", label: "Push Notifications", icon: BellDot },
              {
                key: "reminder",
                label: "Appointment Reminders",
                icon: AlarmClock,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="text-sm sm:text-base">{item.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs[item.key]}
                    onChange={() => toggleNotification(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
