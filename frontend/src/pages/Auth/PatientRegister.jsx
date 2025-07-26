import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Heart, UserCheck, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, Calendar, Users } from 'lucide-react';
import { register } from '../../api/authService';
import { useAuth } from '../../context/AuthContext';

export default function PatientRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {setVerifiedAuthUser} = useAuth();
  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Full name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
        .min(10, 'Phone number must be at least 10 digits'),
      dob: Yup.date()
        .max(new Date(), 'Date of birth cannot be in the future')
        .required('Date of birth is required'),
      gender: Yup.string()
        .required('Please select your gender'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
        .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
        .matches(/(?=.*\d)/, 'Password must contain at least one number')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
      agreeToTerms: Yup.boolean()
        .oneOf([true], 'You must agree to the terms and conditions')
    }),
    onSubmit: async (values) => {
      const {confirmPassword, agreeToTerms, ...val} = values;
      try {
        const verifiedUser = await register(val);
        if (verifiedUser) {
          // setVerifiedAuthUser(verifiedUser);
          navigate('/login');
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </button>

          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-2xl shadow-lg">
              <UserCheck className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Registration</h1>
          <p className="text-gray-600 text-lg">Create your health account</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={formik.handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      formik.touched.name && formik.errors.name 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                    }`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <p className="text-sm text-red-600 mt-1">{formik.errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      formik.touched.email && formik.errors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                    }`}
                    placeholder="patient@example.com"
                    required
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-600 mt-1">{formik.errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone and DOB Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      formik.touched.phone && formik.errors.phone 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{formik.errors.phone}</p>
                )}
              </div>

              {/* Date of Birth Field */}
              <div>
                <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formik.values.dob}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      formik.touched.dob && formik.errors.dob 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                    }`}
                    required
                  />
                </div>
                {formik.touched.dob && formik.errors.dob && (
                  <p className="text-sm text-red-600 mt-1">{formik.errors.dob}</p>
                )}
              </div>
            </div>

            {/* Gender Field */}
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                Gender *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    formik.touched.gender && formik.errors.gender 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                  }`}
                  required
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              {formik.touched.gender && formik.errors.gender && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.gender}</p>
              )}
            </div>

            {/* Password Fields Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      formik.touched.password && formik.errors.password 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                    }`}
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-red-600 mt-1">{formik.errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 hover:border-blue-400'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{formik.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formik.values.agreeToTerms}
                onChange={formik.handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I agree to the{' '}
                <button type="button" className="text-blue-600 hover:text-blue-700 font-medium underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-blue-600 hover:text-blue-700 font-medium underline">
                  Privacy Policy
                </button>
              </label>
            </div>
            {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.agreeToTerms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Create Patient Account
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={handleBackToLogin}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <span className="mr-2">🔒</span>
            Your medical data is protected with end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  );
}