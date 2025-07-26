import React from "react";
import { BrowserRouter } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoutes from "./routes/ProtectedRoutes";


function AppWrapper() {
  return (
    <>
      <PublicRoutes />
      <ProtectedRoutes/>
    </>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppWrapper />
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer/>
    </>
  );
}

export default App;
