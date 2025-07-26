import { Shield, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
          {/* Animated Shield Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-red-50 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
          </div>
          
          {/* Error Code */}
          <div className="text-7xl font-bold text-red-500 mb-4 animate-pulse">
            403
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          
          {/* Message */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Go to Homepage
            </button>
            
            <button className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Error Code: 403 | Request ID: #REQ-{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-indigo-200/30 rounded-full blur-xl animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-purple-200/30 rounded-full blur-xl animate-bounce delay-500"></div>
    </div>
  );
}