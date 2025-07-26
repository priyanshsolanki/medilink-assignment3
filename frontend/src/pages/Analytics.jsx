import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Activity,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Check,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedMetric, setSelectedMetric] = useState("appointments");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 86400000);
    return () => clearInterval(interval);
  }, []);

  const currentMonth = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const currentDay = currentDate.getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const appointmentData = [
    { date: "Mon", appointments: 10 },
    { date: "Tue", appointments: 15 },
    { date: "Wed", appointments: 12 },
    { date: "Thu", appointments: 18 },
    { date: "Fri", appointments: 20 },
    { date: "Sat", appointments: 8 },
    { date: "Sun", appointments: 5 },
  ];

  const monthlyData = [
    { month: "Jan", patients: 120, appointments: 340 },
    { month: "Feb", patients: 135, appointments: 380 },
    { month: "Mar", patients: 150, appointments: 420 },
    { month: "Apr", patients: 165, appointments: 460 },
    { month: "May", patients: 180, appointments: 500 },
    { month: "Jun", patients: 195, appointments: 540 },
  ];

  const keyMetrics = [
    {
      title: "Total Appointments",
      value: "1,847",
      change: "+12.5%",
      trend: "up",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Active Patients",
      value: "524",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "green",
    },
    {
      title: "Average Wait Time",
      value: "12 min",
      change: "-5.3%",
      trend: "down",
      icon: Clock,
      color: "orange",
    },
    {
      title: "Monthly Revenue",
      value: "$54,000",
      change: "+15.8%",
      trend: "up",
      icon: DollarSign,
      color: "purple",
    },
    {
      title: "Completion Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Activity,
      color: "emerald",
    },
    {
      title: "No-Show Rate",
      value: "5.8%",
      change: "-1.2%",
      trend: "down",
      icon: TrendingUp,
      color: "red",
    },
  ];

  const getTrendIcon = (trend) => {
    if (trend === "up") return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trend === "down") return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend) =>
    trend === "up"
      ? "text-green-600"
      : trend === "down"
      ? "text-red-600"
      : "text-gray-600";

  const getIconColor = (color) =>
    ({
      blue: "text-blue-600",
      green: "text-green-600",
      orange: "text-orange-600",
      purple: "text-purple-600",
      emerald: "text-emerald-600",
      red: "text-red-600",
    }[color] || "text-gray-600");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 lg:flex-row">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600" />
        )}
      </button>

      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transform transition-transform duration-200 ease-in-out fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 p-4 lg:p-6 flex flex-col z-40 overflow-y-auto`}
      >
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Track your practice performance and patient insights
          </p>
        </div>

        {/* Today's Appointments */}
        <div className="grid grid-cols-2 gap-2 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-blue-500 text-white px-3 py-4 lg:px-4 lg:py-5 rounded-lg min-h-[80px] lg:min-h-[90px] flex flex-col justify-center items-center text-center">
            <div className="text-xs lg:text-[13px] leading-tight font-medium whitespace-normal break-words">
              Today's Appointments
            </div>
            <div className="text-2xl lg:text-3xl font-bold mt-1">4</div>
          </div>
          <div className="bg-green-500 text-white px-3 py-4 lg:px-4 lg:py-5 rounded-lg min-h-[80px] lg:min-h-[90px] flex flex-col justify-center items-center text-center">
            <div className="text-xs lg:text-sm font-medium">Completed</div>
            <div className="text-2xl lg:text-3xl font-bold mt-1">8</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 lg:mb-8">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2 lg:space-y-3">
            <Link to="/availability">
              <button className="w-full flex items-center px-3 py-2 text-sm lg:text-base text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <span className="mr-2 lg:mr-3">📅</span>
                Set Availability
              </button>
            </Link>
            <Link to="/patient-directory">
              <button className="w-full flex items-center px-3 py-2 text-sm lg:text-base text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <span className="mr-2 lg:mr-3">👥</span>
                Patient Directory
              </button>
            </Link>
            <Link to="/analytics">
              <button className="w-full flex items-center px-3 py-2 text-sm lg:text-base text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <span className="mr-2 lg:mr-3">📊</span>
                Analytics
              </button>
            </Link>
            <Link to="/settings">
              <button className="w-full flex items-center px-3 py-2 text-sm lg:text-base text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                <span className="mr-2 lg:mr-3">⚙️</span>
                Settings
              </button>
            </Link>
          </div>
        </div>

        {/* Calendar */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-lg font-semibold mb-2">Calendar</h2>
          <div className="text-center mb-2">
            <span className="font-medium">{currentMonth}</span>
          </div>
          <div className="grid grid-cols-7 gap-0.5 lg:gap-1 text-xs lg:text-sm text-center mb-1">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-0.5 lg:gap-1 text-xs lg:text-sm text-center">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`py-1 lg:py-2 ${day === null ? "invisible" : ""} ${
                  day === currentDay ? "font-bold text-blue-600" : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">JD</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 pt-16 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 gap-4 sm:gap-6 flex-col lg:flex-row">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Track your practice performance and patient insights
              </p>
            </div>
            <div className="flex items-center gap-3 flex-col sm:flex-row w-full lg:w-auto">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-auto"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="year">This Year</option>
              </select>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto">
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
            {keyMetrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <metric.icon
                    className={`w-5 sm:w-6 h-5 sm:h-6 ${getIconColor(
                      metric.color
                    )}`}
                  />
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {metric.value}
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p
                    className={`text-sm font-medium ${getTrendColor(
                      metric.trend
                    )}`}
                  >
                    {metric.change}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* Daily Appointments Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Daily Appointments
                </h2>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="appointments">Total Appointments</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="revenue">Revenue</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="appointments"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Growth Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-6">
                Monthly Growth
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="patients"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="appointments"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 sm:gap-6 mt-2 sm:mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">New Patients</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Appointments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
