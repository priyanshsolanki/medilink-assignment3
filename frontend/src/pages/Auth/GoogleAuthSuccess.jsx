// src/pages/GoogleAuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function GoogleAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setVerifiedAuthUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Decode if needed or fetch user data from backend using token
      const payload = JSON.parse(atob(token.split('.')[1])); // simple JWT decode
      const user = {
        jwtToken: token,
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      };

      setVerifiedAuthUser(user);
      toast.success('Google login successful!');
      navigate(`/${user.role}/dashboard`);
    } else {
      toast.error('Google login failed!');
      navigate('/login');
    }
  }, []);

  return <p className="text-center mt-10 text-gray-600">Signing you in via Google...</p>;
}
