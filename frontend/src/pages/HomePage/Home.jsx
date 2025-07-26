import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Clock, Shield, ArrowRight, Stethoscope, UserCheck } from 'lucide-react';

export default function MediLinkHomepage() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Name */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MediLink
              </span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About Us
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact Us
              </a>
              <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Get Started
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Connecting Health,
              <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent pb-3">
                Empowering Care
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              MediLink bridges the gap between patients and healthcare providers with secure, 
              efficient digital solutions for modern medical practice management.
            </p>
            
            {/* Login Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button onClick={() => navigate('/login')} className="group bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 min-w-[200px]">
                <UserCheck className="h-6 w-6" />
                <span className="font-semibold text-lg">Login Here</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

{/*               
              <button className="group bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 min-w-[200px]">
                <Stethoscope className="h-6 w-6" />
                <span className="font-semibold text-lg">Doctor Login</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button> */}
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="bg-blue-100 p-3 rounded-full">
            <Heart className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-300">
          <div className="bg-green-100 p-3 rounded-full">
            <Stethoscope className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose MediLink?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience healthcare management like never before with our comprehensive platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient-Centered</h3>
              <p className="text-gray-600">
                Intuitive interface designed with patients in mind for easy appointment booking and health tracking
              </p>
            </div>
            
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">
                Instant notifications and updates keep everyone informed about appointments and health status
              </p>
            </div>
            
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                HIPAA-compliant security ensures your medical information remains protected and confidential
              </p>
            </div>
            
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg">
                <Stethoscope className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor-Friendly</h3>
              <p className="text-gray-600">
                Streamlined workflows and comprehensive tools help healthcare providers deliver better care
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About MediLink
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                MediLink is revolutionizing healthcare delivery by creating seamless connections between 
                patients and healthcare providers. Our platform combines cutting-edge technology with 
                user-friendly design to make healthcare management simple, secure, and efficient.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                From appointment scheduling to medical records management, MediLink provides comprehensive 
                solutions that save time, reduce errors, and improve patient outcomes. Join thousands of 
                satisfied users who have transformed their healthcare experience with MediLink.
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Learn More
              </button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-200 to-green-200 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Healthcare Made Simple</h3>
                      <p className="text-gray-600">Connecting care, one click at a time</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">✓ Secure patient records</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">✓ Easy appointment booking</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">✓ Real-time communication</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We're here to help you get started with MediLink
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">support@medilink.com</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-green-600 p-3 rounded-full w-fit mx-auto mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">1-800-MEDILINK</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Healthcare Ave, Medical District</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">MediLink</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">© 2025 MediLink. All rights reserved.</p>
              <p className="text-gray-400">Connecting healthcare, one patient at a time.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}