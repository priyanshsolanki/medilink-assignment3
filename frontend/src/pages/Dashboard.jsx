import React from "react";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  const { authUser } = useAuth();
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <main
        style={{ maxHeight: "100vh", overflow: "scroll" }}
        className="flex-1 p-6"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {authUser.name}!
        </h1>
      </main>
    </div>
  );
};
