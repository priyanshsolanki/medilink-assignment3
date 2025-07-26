import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from 'lucide-react';

export default function EmailVerification() {
  const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const tokenFromURL = searchParams.get('token');
    const emailFromURL = searchParams.get('email');

    setToken(tokenFromURL);
    setEmail(emailFromURL);
  }, [searchParams]);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setVerificationStatus('error');
        setMessage('Invalid verification link. Please check your email and try again.');
        return;
      }

      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL }/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setVerificationStatus('success');
          setMessage('Your email has been successfully verified! You can now log in to your account.');
        } else {
          setVerificationStatus('error');
          setMessage(data.message || 'Email verification failed. Please try again.');
        }
      } catch (error) {
        setVerificationStatus('error');
        setMessage('Something went wrong. Please check your internet connection and try again.');
      }
    };

    verifyEmail();
  }, [token, email]);

  const handleLoginRedirect = () => {
    // Replace with your navigation logic
    window.location.href = '/login';
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${
                verificationStatus === 'loading' ? 'bg-blue-100' :
                verificationStatus === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {verificationStatus === 'loading' && (
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                )}
                {verificationStatus === 'success' && (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                )}
                {verificationStatus === 'error' && (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {verificationStatus === 'loading' && 'Verifying Your Email'}
              {verificationStatus === 'success' && 'Email Verified!'}
              {verificationStatus === 'error' && 'Verification Failed'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {verificationStatus === 'loading' && 'Please wait while we verify your email address...'}
              {message}
            </p>
          </div>

          {/* Email Display */}
          {email && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center text-gray-700">
                <Mail className="h-5 w-5 mr-2" />
                <span className="font-medium">{email}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {verificationStatus === 'success' && (
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-semibold"
              >
                Continue to Login
              </button>
            )}

            {verificationStatus === 'error' && (
              <div className="space-y-3">
                {/* <button
                  onClick={handleResendVerification}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-semibold"
                >
                  Resend Verification Email
                </button> */}
                <button
                  onClick={handleLoginRedirect}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Back to Login
                </button>
              </div>
            )}

            {verificationStatus === 'loading' && (
              <div className="text-sm text-gray-500">
                This process usually takes a few seconds...
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              🔒 Your account security is our priority
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <button
            onClick={handleBackToHome}
            className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}