import { Route, Routes } from "react-router-dom";
import { Roles } from "../constants/AccessConstants";
import PrivateRoute from "../components/PrivateRoute";
import { Dashboard } from "../pages/Dashboard";


import DoctorAppointment from "../pages/Doctor/DoctorAppointment";
import Availability from "../pages/Doctor/Availability";
import PatientDirectory from "../pages/Doctor/Patientdirectory";
import Settings from "../pages/Doctor/Settings";
import PharmacyLocator from "../pages/Patient/PharmacyLocator";
import MedicalHistory from "../pages/Patient/MedicalHistory";
import PatientProfile from "../pages/Patient/PatientProfile";
import PatientDashboard from "../pages/Patient/Patientdashboard";
import MyAppointments from "../pages/Patient/BookAppointments";
import DoctorChatPage from "../pages/Doctor/doctorchatpage";
import PatientChatPage from "../pages/Patient/patientchatpage";
const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route path="/doctor/chat/:patientId" element={<DoctorChatPage />} />
      <Route path="/patient/chat" element={<PatientChatPage />} />
      <Route path="/patient-directory" element={<PatientDirectory />} />
      <Route path="/pharmacy-locator" element={<PharmacyLocator />} />

      <Route element={<PrivateRoute allowedRoles={[Roles.DOCTOR,Roles.USER]} />}>
       {/* Add routes that both users have access */}
      </Route>
      <Route element={<PrivateRoute allowedRoles={[Roles.DOCTOR]} />}>
       {/* Add routes that only doctors have access */}
       <Route path="/doctor/dashboard" element={<Dashboard />} />
       <Route path="/doctor/appointment" element={<DoctorAppointment />} />
      <Route path="/availability" element={<Availability />} />
      <Route path="/patient-directory" element={<PatientDirectory />} />
      <Route path="/settings" element={<Settings />} />

      </Route>
      <Route element={<PrivateRoute allowedRoles={[Roles.USER]} />}>
       {/* Add routes that only patients have access */}
       <Route path="/patient/dashboard" element={<PatientDashboard />} />
       <Route path="/patient/book-appointment" element={<MyAppointments />} />
      <Route path="/pharmacy-locator" element={<PharmacyLocator />} />
      <Route path="/patient/medical-history" element={<MedicalHistory />} />
      <Route path="/patient/profile" element={<PatientProfile />} />


      </Route>
    </Routes>
  );
};

export default ProtectedRoutes;
