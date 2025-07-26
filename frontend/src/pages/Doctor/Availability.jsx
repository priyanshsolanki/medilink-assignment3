// src/pages/SetAvailability.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import availabilityService from "../../api/availabilityService";
import { Clock, Plus, X, Save } from "lucide-react";
import Sidebar from "../../components/Sidebar";

export default function SetAvailability() {
  const { authUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "" });
  const [showAddSlot, setShowAddSlot] = useState(false);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayNames = [
    "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",
  ];

  // Load availability grouped by date
  const loadAvailability = async () => {
    if (!authUser) return;
    try {
      const { availability } = await availabilityService.getDoctorAvailability(authUser.id);
      setAvailabilityMap(availability || {});
    } catch (err) {
      console.error("Error loading availability:", err);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [authUser]);

  // Update today's slots when map or date changes
  useEffect(() => {
    const key = selectedDate.toISOString().split('T')[0];
    setTimeSlots(availabilityMap[key] || []);
  }, [availabilityMap, selectedDate]);

  const addTimeSlot = async () => {
    if (!newSlot.startTime || !newSlot.endTime) return;
    try {
      await availabilityService.createAvailability( {
        doctorId:authUser.id,
        date: selectedDate.toISOString().split('T')[0],
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
      });
      setNewSlot({ startTime: "", endTime: "" });
      setShowAddSlot(false);
      await loadAvailability();
    } catch (err) {
      console.error("Error adding slot:", err);
    }
  };

  const removeTimeSlot = async (availabilityId) => {
    try {
      await availabilityService.deleteAvailability( availabilityId);
      await loadAvailability();
    } catch (err) {
      console.error("Error deleting slot:", err);
    }
  };

  const navigateMonth = (dir) => {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + dir);
    setSelectedDate(d);
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay();
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(d);
    return days;
  };

  const formatDate = (date) =>
    `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  const totalSlots = Object.values(availabilityMap).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pt-20 lg:pt-0 flex-1">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Set Availability</h1>
              <p className="text-gray-600">Manage your available time slots</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div>
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <button onClick={() => navigateMonth(-1)} className="p-1 hover:bg-gray-100 rounded">‹</button>
                  <span className="font-semibold">
                    {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </span>
                  <button onClick={() => navigateMonth(1)} className="p-1 hover:bg-gray-100 rounded">›</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                  {['S','M','T','W','T','F','S'].map((d,i)=><div key={i}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => day && setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                      className={`h-8 rounded text-sm flex items-center justify-center ${day? 'hover:bg-blue-100':''} ${day===selectedDate.getDate()? 'bg-blue-600 text-white':'text-gray-700'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-blue-600">{timeSlots.length}</div>
                  <div className="text-sm text-blue-600">Slots Today</div>
                </div>
                <div className="bg-gray-50 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-gray-600">{totalSlots}</div>
                  <div className="text-sm text-gray-600">Total Slots</div>
                </div>
              </div>
            </div>

            {/* Slots Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Availability for {formatDate(selectedDate)}
                  </h2>
                  <button
                    onClick={() => setShowAddSlot(true)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Slot
                  </button>
                </div>

                {timeSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No slots for this day</div>
                ) : (
                  timeSlots.map(slot => (
                    <div key={slot.availabilityId} className="flex justify-between items-center bg-gray-50 p-3 mb-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <button onClick={() => removeTimeSlot(slot.availabilityId)} className="hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}

                {showAddSlot && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Add New Slot</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Start Time</label>
                        <input
                          type="time"
                          value={newSlot.startTime}
                          onChange={e => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                          className="border px-3 py-2 rounded w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">End Time</label>
                        <input
                          type="time"
                          value={newSlot.endTime}
                          onChange={e => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                          className="border px-3 py-2 rounded w-full"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button onClick={addTimeSlot} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Add Slot
                      </button>
                      <button onClick={() => setShowAddSlot(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
