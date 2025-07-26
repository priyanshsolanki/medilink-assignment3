import React, { useState } from "react";
import Sidebar from "../components/Patientsidebar";

import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "Upcoming Appointment Reminder",
      message:
        "You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM",
      time: "2 hours ago",
      read: false,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      type: "prescription",
      title: "Prescription Ready",
      message:
        "Your Atorvastatin prescription is ready for pickup at CVS Pharmacy",
      time: "5 hours ago",
      read: false,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 3,
      type: "test_result",
      title: "Test Results Available",
      message:
        "Your recent blood test results are now available in your medical history",
      time: "1 day ago",
      read: true,
      icon: Info,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: 4,
      type: "reminder",
      title: "Medication Reminder",
      message: "Don't forget to take your evening medication",
      time: "2 days ago",
      read: true,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">
                Stay updated with your health information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {unreadCount} Unread
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Notifications
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Mark all as read
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${notification.bgColor}`}>
                        <IconComponent
                          className={`w-5 h-5 ${notification.color}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                              {notification.message}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                              {notification.time}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
