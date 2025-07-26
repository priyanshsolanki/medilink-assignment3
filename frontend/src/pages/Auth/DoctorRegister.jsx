import React, { useState } from 'react';
import { Heart, Stethoscope, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, FileText, UserPlus, Users, Calendar, MapPin, GraduationCap, Building } from 'lucide-react';
import { register } from '../../api/authService';
import { useNavigate } from 'react-router-dom';

export default function DoctorRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    licenseNumber: '',
    specialty: '',
    password: '',
    confirmPassword: '',
    role: 'doctor',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Family Medicine',
    'Gastroenterology',
    'General Surgery',
    'Internal Medicine',
    'Neurology',
    'Obstetrics & Gynecology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Other'
  ];

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value) newErrors.name = 'Full name is required';
        else if (value.length < 2) newErrors.name = 'Name must be at least 2 characters';
        else delete newErrors.name;
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) newErrors.email = 'Email is required';
        else if (!emailRegex.test(value)) newErrors.email = 'Invalid email address';
        else delete newErrors.email;
        break;
      case 'phone':
        const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
        if (value && !phoneRegex.test(value)) newErrors.phone = 'Invalid phone number format';
        else if (value && value.length < 10) newErrors.phone = 'Phone number must be at least 10 digits';
        else delete newErrors.phone;
        break;
      case 'dob':
        if (!value) newErrors.dob = 'Date of birth is required';
        else if (new Date(value) > new Date()) newErrors.dob = 'Date of birth cannot be in the future';
        else delete newErrors.dob;
        break;
      case 'gender':
        if (!value) newErrors.gender = 'Please select your gender';
        else delete newErrors.gender;
        break;
      case 'licenseNumber':
        if (!value) newErrors.licenseNumber = 'Medical license number is required';
        else if (value.length < 5) newErrors.licenseNumber = 'License number must be at least 5 characters';
        else delete newErrors.licenseNumber;
        break;
      case 'specialty':
        if (!value) newErrors.specialty = 'Please select your specialty';
        else delete newErrors.specialty;
        break;
      case 'password':
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!value) newErrors.password = 'Password is required';
        else if (value.length < 8) newErrors.password = 'Password must be at least 8 characters';
        else if (!passwordRegex.test(value)) newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        else delete newErrors.password;
        break;
      case 'confirmPassword':
        if (!value) newErrors.confirmPassword = 'Please confirm your password';
        else if (value !== formData.password) newErrors.confirmPassword = 'Passwords must match';
        else delete newErrors.confirmPassword;
        break;
      case 'agreeToTerms':
        if (!value) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        else delete newErrors.agreeToTerms;
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    validateField(name, fieldValue);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== 'role') {
        validateField(key, formData[key]);
      }
    });

    if (Object.keys(errors).length === 0) {
      const { confirmPassword, agreeToTerms, ...submitData } = formData;

      try {
        // Replace with your actual API call
        const verifiedUser = await register(submitData);
        if (verifiedUser) {
          navigate('/login');
        }
      } catch (err) {
        console.error('Registration error:', err);
      }
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  const getFieldStyles = (fieldName) => {
    const hasError = getFieldError(fieldName);
    return `w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
      hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
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
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-2xl">
              <Stethoscope className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Registration</h1>
          <p className="text-gray-600">Create your medical professional account</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldStyles('name')}
                      placeholder="Dr. John Smith"
                      required
                    />
                  </div>
                  {getFieldError('name') && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldStyles('email')}
                      placeholder="doctor@hospital.com"
                      required
                    />
                  </div>
                  {getFieldError('email') && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldStyles('phone')}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {getFieldError('phone') && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
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
                      value={formData.dob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldStyles('dob')}
                      required
                    />
                  </div>
                  {getFieldError('dob') && (
                    <p className="text-sm text-red-600 mt-1">{errors.dob}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="lg:col-span-2">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldStyles('gender')}
                      required
                    >
                      <option value="">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  {getFieldError('gender') && (
                    <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Professional Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* License Number */}
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Medical License Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldStyles('licenseNumber')}
                      placeholder="MD123456789"
                      required
                    />
                  </div>
                  {getFieldError('licenseNumber') && (
                    <p className="text-sm text-red-600 mt-1">{errors.licenseNumber}</p>
                  )}
                </div>

                {/* Specialty */}
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Specialty *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldStyles('specialty')}
                      required
                    >
                      <option value="">Select your specialty</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  {getFieldError('specialty') && (
                    <p className="text-sm text-red-600 mt-1">{errors.specialty}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Information Section */}
            <div className="pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Security Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${getFieldStyles('password')} pr-12`}
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {getFieldError('password') && (
                    <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                  )}
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">
                      Password must contain:
                    </div>
                    <ul className="text-xs text-gray-500 mt-1 space-y-1">
                      <li className={`${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                        ✓ At least 8 characters
                      </li>
                      <li className={`${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                        ✓ One uppercase letter
                      </li>
                      <li className={`${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                        ✓ One lowercase letter
                      </li>
                      <li className={`${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
                        ✓ One number
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
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
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${getFieldStyles('confirmPassword')} pr-12`}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {getFieldError('confirmPassword') && (
                    <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                  )}
                  {formData.confirmPassword && formData.password && formData.confirmPassword === formData.password && (
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Passwords match
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 flex-shrink-0"
                />
                <label htmlFor="agreeToTerms" className="ml-3 block text-sm text-gray-700">
                  I agree to the{" "}
                  <button type="button" className="text-green-600 hover:text-green-700 font-medium underline">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-green-600 hover:text-green-700 font-medium underline">
                    Privacy Policy
                  </button>
                  , and I confirm that I am a licensed medical professional with valid credentials.
                </label>
              </div>
              {getFieldError('agreeToTerms') && (
                <p className="text-sm text-red-600 mt-2 ml-7">{errors.agreeToTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={Object.keys(errors).length > 0 || !formData.agreeToTerms}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
            >
              <div className="flex items-center justify-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Create Doctor Account
              </div>
            </button>

          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Already have a doctor account?{" "}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-green-600 hover:text-green-700 font-medium underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-green-700 font-medium">
              Your medical data is protected with enterprise-grade encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}