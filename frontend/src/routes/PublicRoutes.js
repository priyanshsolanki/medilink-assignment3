import React from "react";
import { Route, Routes } from "react-router-dom";

import Analytics from "../pages/Analytics";
import Home from "../pages/HomePage/Home";
import LoginPage from "../pages/Auth/LoginPage";
import PatientRegister from "../pages/Auth/PatientRegister";
import DoctorRegister from "../pages/Auth/DoctorRegister";
import GoogleAuthSuccess from "../pages/Auth/GoogleAuthSuccess";
import EmailVerification from "../pages/Auth/EmailVerification";
import UnauthorizedPage from "../pages/Auth/UnauthorizedPage";
import Notifications from "../pages/Notifications";
import Appointments from "../pages/Appointments";
import HelpCenter from "../pages/HelpCenter";


const PublicRoutes = () => {
  return (
    <Routes>
 
      <Route path="/analytics" element={<Analytics />} />

      {/* Add more public routes here as needed */}
      {/* Example: <Route path="/about" element={<About />} /> */}
       <Route exact path="/" element={<Home />} /> 
       <Route exact path="/login" element={<LoginPage />} /> 
       <Route exact path="/verify-email" element={<EmailVerification/>} /> 

       <Route exact path="/patient-register" element={<PatientRegister />} /> 
       <Route exact path="/doctor-register" element={<DoctorRegister />} /> 
       <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />

       <Route exact path="/unauthorized" element={<UnauthorizedPage/>} /> 
       <Route exact path="/notifications" element={<Notifications />} />
        <Route exact path="/appointments" element={<Appointments />} />
        <Route exact path="/help-center" element={<HelpCenter />} />

    </Routes>
  );
};

export default PublicRoutes;
