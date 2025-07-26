import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, Calendar, FileText, Upload, Plus, Download, Send, MessageCircle, X, Minimize2 } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import userService from '../../api/userService';
import recordService from '../../api/recordService';

function calculateAge(dob) {
  const birth = typeof dob === 'string' ? new Date(dob) : dob;
  if (Number.isNaN(birth.getTime())) {
    throw new Error('Invalid date of birth');
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  // If birthday hasn't occurred yet this year, subtract 1
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  return hasHadBirthdayThisYear ? age : age - 1;
}

export default function DoctorPatientChatPage() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments] = useState([
    { id: '1', date: '2025-07-20', time: '10:00 AM', status: 'Completed' },
    { id: '2', date: '2025-07-25', time: '2:00 PM', status: 'Scheduled' },
  ]);
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ file: null, description: '' });
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch patient info
  useEffect(() => {
    userService.getUserById(patientId)
      .then(data => setPatient(data))
      .catch(err => console.error(err));
  }, [patientId]);

  // Fetch records for patient
  const loadRecords = () => {
    recordService.getRecords(patientId)
      .then(data => setRecords(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadRecords();
  }, [patientId]);

  const handleRecordChange = (e) => {
    const { name, files, value } = e.target;
    if (name === 'file') {
      setNewRecord(prev => ({ ...prev, file: files[0] }));
    } else {
      setNewRecord(prev => ({ ...prev, [name]: value }));
    }
  };

  const addRecord = async () => {
    if (!newRecord.file || !newRecord.description) return;
    try {
      await recordService.createRecord(patientId, {
        title: newRecord.file.name,
        type: newRecord.file.name,
        notes: newRecord.description,
        file: newRecord.file
      });
      setNewRecord({ file: null, description: '' });
      loadRecords();
    } catch (err) {
      console.error('Error uploading record:', err);
    }
  };

  const downloadFile = async (recordId) => {
    try {
      const url = await recordService.downloadRecordFile(recordId);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading patient...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 lg:flex-row">
      <Sidebar />
      
      {/* Main Content */}
      <main className={`flex-1 pt-20 lg:pt-0 transition-all duration-300 ${isChatOpen ? 'mr-96' : 'mr-0'}`}>
        <div className="max-w-full mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Patient Profile - {patient.name}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-600">Age {calculateAge(patient.dob)} • {patient.gender}</span>
              </div>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-900">Patient Details</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900 font-medium">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="text-gray-900 font-medium">{new Date(patient.dob).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-900">Appointments</span>
              </h3>
              <div className="space-y-3">
                {appointments.map(appt => (
                  <div key={appt.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">{appt.date} at {appt.time}</p>
                        <p className="text-sm text-gray-600">Status: {appt.status}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appt.status === 'Completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Health Records Section */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-gray-900">Health Records</span>
            </h3>
            
            {/* Records Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
              {records.map(rec => (
                <div key={rec._id} className="group p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all bg-gray-50 hover:bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{rec.title}</h4>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full whitespace-nowrap border">
                            {new Date(rec.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{rec.notes}</p>
                        <p className="text-xs text-gray-500">By Dr. {rec?.uploadedBy?.name}</p>
                      </div>
                    </div>
                    {rec.fileUrl && (
                      <button 
                        onClick={() => downloadFile(rec._id)} 
                        className="opacity-0 group-hover:opacity-100 p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all flex-shrink-0"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Section */}
            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Upload New Record</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-purple-300 hover:bg-purple-50/50 transition-all group cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                      {newRecord.file ? newRecord.file.name : 'Click to upload or drag and drop'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, JPG up to 10MB</p>
                  </label>
                  <input 
                    id="fileUpload" 
                    type="file" 
                    name="file" 
                    onChange={handleRecordChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                </div>
                
                <div className="space-y-4">
                  <textarea 
                    name="description" 
                    rows={4} 
                    placeholder="Enter record description..." 
                    value={newRecord.description} 
                    onChange={handleRecordChange} 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                  />
                  
                  <button 
                    onClick={addRecord} 
                    disabled={!newRecord.file || !newRecord.description}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Record</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 z-50 ${
        isChatOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-gray-900">Chat with {patient.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Online now
            </div>
          </div>
          
          {/* Chat Content */}
          <ChatWindow userType="doctor" />
        </div>
      </div>

      {/* Overlay */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}

function ChatWindow({ userType }) {
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'doctor', content: 'Hello, how can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const containerRef = useRef();

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: userType, content: text }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={containerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
              msg.sender === userType 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md' 
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center space-x-3">
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Type your message..." 
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm" 
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
          />
          <button 
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}