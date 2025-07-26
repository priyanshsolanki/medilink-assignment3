// src/routes/ProtectedRoutes.js
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Roles } from "../constants/AccessConstants";
import PrivateRoute from "../components/PrivateRoute";

// lazy imports of each page
const Dashboard           = lazy(() => import("../pages/Dashboard"));
const DoctorAppointment   = lazy(() => import("../pages/Doctor/DoctorAppointment"));
const Availability        = lazy(() => import("../pages/Doctor/Availability"));
const PatientDirectory    = lazy(() => import("../pages/Doctor/Patientdirectory"));
const Settings            = lazy(() => import("../pages/Doctor/Settings"));
const PharmacyLocator     = lazy(() => import("../pages/Patient/PharmacyLocator"));
const MedicalHistory      = lazy(() => import("../pages/Patient/MedicalHistory"));
const PatientProfile      = lazy(() => import("../pages/Patient/PatientProfile"));
const PatientDashboard    = lazy(() => import("../pages/Patient/Patientdashboard"));
const MyAppointments      = lazy(() => import("../pages/Patient/BookAppointments"));
const DoctorChatPage      = lazy(() => import("../pages/Doctor/doctorchatpage"));
const PatientChatPage     = lazy(() => import("../pages/Patient/patientchatpage"));

export default function ProtectedRoutes() {
  return (
    // wrap all routes in Suspense so lazy imports show a fallback while loading
    <Suspense fallback={<div>Loading…</div>}>
      <Routes>
        {/* public chat endpoints */}
        <Route path="/doctor/chat/:patientId" element={<DoctorChatPage />} />
        <Route path="/patient/chat" element={<PatientChatPage />} />

        {/* shared-access wrapper */}
        <Route element={<PrivateRoute allowedRoles={[Roles.DOCTOR, Roles.USER]} />}>
          {/* put any shared routes here */}
        </Route>

        {/* doctor-only */}
        <Route element={<PrivateRoute allowedRoles={[Roles.DOCTOR]} />}>
          <Route path="/doctor/dashboard"    element={<Dashboard />} />
          <Route path="/doctor/appointment"  element={<DoctorAppointment />} />
          <Route path="/availability"        element={<Availability />} />
          <Route path="/patient-directory"   element={<PatientDirectory />} />
          <Route path="/settings"            element={<Settings />} />
        </Route>

        {/* patient-only */}
        <Route element={<PrivateRoute allowedRoles={[Roles.USER]} />}>
          <Route path="/patient/dashboard"        element={<PatientDashboard />} />
          <Route path="/patient/book-appointment" element={<MyAppointments />} />
          <Route path="/pharmacy-locator"         element={<PharmacyLocator />} />
          <Route path="/patient/medical-history"  element={<MedicalHistory />} />
          <Route path="/patient/profile"          element={<PatientProfile />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
