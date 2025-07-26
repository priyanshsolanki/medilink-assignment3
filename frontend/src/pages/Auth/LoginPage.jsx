import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  UserCheck,
  Stethoscope,
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Lock,
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authenticate, verifyLoginOtp } from '../../api/authService';

export default function MediLinkLogin() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('select'); // 'select', 'patient', 'doctor'
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('login'); // 'login' | 'verify'
  const [tmpOtpToken, setTmpOtpToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const { setVerifiedAuthUser } = useAuth();
  const isPatient = loginType === 'patient';
  const primaryColor = isPatient ? 'blue' : 'green';
  const icon = isPatient ? UserCheck : Stethoscope;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await authenticate(values.email, values.password);
        if (res?.otpToken) {
          setTmpOtpToken(res.otpToken);
          setStep('verify');
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
  });

  const handleOtpVerification = async () => {
    try {
      if (!otp || otp.length < 4) {
        alert('Please enter a valid OTP');
        return;
      }

      setLoading(true);
      const verifiedUser = await verifyLoginOtp({ otpToken: tmpOtpToken, otp });

      if (verifiedUser) {
        setVerifiedAuthUser(verifiedUser);
        navigate(`/${verifiedUser.role}/dashboard`);
      }
      
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSelection = () => {
    setLoginType('select');
    formik.resetForm();
    setStep('login');
    setOtp('');
    setTmpOtpToken(null);
  };

  if (loginType === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-2xl">
                <Heart className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              MediLink
            </h1>
            <p className="text-gray-600">Choose your login type to continue</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setLoginType('patient')}
              className="w-full bg-white border-2 border-blue-100 hover:border-blue-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-xl">
                  <UserCheck className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Patient Login</h3>
                  <p className="text-gray-600 text-sm">Access your health records and appointments</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setLoginType('doctor')}
              className="w-full bg-white border-2 border-green-100 hover:border-green-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-xl">
                  <Stethoscope className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Doctor Login</h3>
                  <p className="text-gray-600 text-sm">Manage patients and medical records</p>
                </div>
              </div>
            </button>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              ← Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <button
            onClick={handleBackToSelection}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to selection
          </button>

          <div className="flex justify-center mb-4">
            <div className={`bg-gradient-to-r from-${primaryColor}-100 to-${primaryColor}-200 p-4 rounded-2xl`}>
              {step === 'verify' ? (
                <ShieldCheck className={`h-10 w-10 text-${primaryColor}-600`} />
              ) : (
                React.createElement(icon, { className: `h-10 w-10 text-${primaryColor}-600` })
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'verify' ? 'Verify OTP' : isPatient ? 'Patient Login' : 'Doctor Login'}
          </h1>
          <p className="text-gray-600">
            {step === 'verify'
              ? 'Enter the OTP sent to your email to complete login'
              : isPatient
              ? 'Access your health dashboard'
              : 'Access your practice dashboard'}
          </p>
        </div>

        {step === 'login' ? (
          <form onSubmit={formik.handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="you@example.com"
                  required
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-700 text-white py-3 px-4 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-semibold`}
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Next'}
            </button>
            
            {loginType === 'patient' && <>
               {/* Divider */}
               <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/google`}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              </div>
              </>}
              <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={()=>{navigate(`/${loginType}-register`)}}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Sign up here
              </button>
            </p>
          </div>
          </form>
          
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123456"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleOtpVerification}
              className={`w-full bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-700 text-white py-3 px-4 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-semibold`}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">🔒 Your data is protected with end-to-end encryption</p>
        </div>
      </div>
    </div>
  );
}
