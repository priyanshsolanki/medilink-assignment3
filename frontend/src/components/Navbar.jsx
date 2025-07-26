import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-white shadow-md fixed w-full z-50">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600 flex items-center">
        <i className="fas fa-heartbeat mr-2"></i> MediLink
      </h1>
      <div className="hidden md:flex space-x-6">
        <a href="#about" className="text-gray-700 hover:text-blue-600">About Us</a>
        <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact Us</a>
        <Link to="/login/patient" className="text-blue-600 hover:text-blue-800">Patient Login</Link>
        <Link to="/login/doctor" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Doctor Login</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
