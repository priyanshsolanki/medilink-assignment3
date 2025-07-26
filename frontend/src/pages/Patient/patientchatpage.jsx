import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone } from 'lucide-react';
import Sidebar from '../../components/Sidebar'; 

// Patient side chat page
export default function PatientDoctorChatPage() {
  const [doctor] = useState({
    name: 'Dr. Alice Smith',
    specialty: 'Cardiologist',
    contact: 'alice.smith@hospital.com',
    phone: '+1 (555) 123-7890',
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 lg:flex-row">
      <Sidebar />
      <main className=" flex-1">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Chat with {doctor.name}
            </h2>
            <span className="text-sm text-gray-600">
              Specialty: {doctor.specialty}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Doctor Details */}
            <aside className="w-full lg:w-1/3 bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3">Doctor Details</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400"/><span>{doctor.contact}</span></li>
                  <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/><span>{doctor.phone}</span></li>
                </ul>
              </section>
            </aside>

            {/* Chat Area */}
            <section className="w-full flex-1 bg-white rounded-lg shadow border border-gray-200 flex flex-col overflow-hidden h-[70vh]">
              <ChatWindow userType="patient" />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// Shared ChatWindow component
function ChatWindow({ userType }) {
  const [messages, setMessages] = useState([
    { id: 'm1', sender: userType, content: 'Hi there!' },
    { id: 'm2', sender: userType === 'patient' ? 'doctor' : 'patient', content: 'Hello, how can I help?' },
  ]);
  const [input, setInput] = useState('');
  const containerRef = useRef();

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: userType, content: input.trim() }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={containerRef} className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}>  
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === userType ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>{msg.content}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex items-center p-4 border-t">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
        />
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition">Send</button>
      </form>
    </div>
  );
}
