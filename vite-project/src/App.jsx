import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { ToastContainer } from "react-toastify";
import Login from "./Components/Login";
import Sidebar from "./Components/Sidebar";
import DashboardStats from "./Pages/Dashboard";
import Create from "./Pages/Create";

const PlaceholderPage = ({ title }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p className="text-gray-600">This page is under construction.</p>
  </div>
);

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.clear();
      navigate("/");
    }
  }, [token, navigate]);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <>
      <ToastContainer />
      <Navbar setToken={setToken} />
      <hr />
      <div className="flex w-full">
        <Sidebar />
        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-800 text-base">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<DashboardStats />} />

            <Route
              path="/create-roles"
              element={<Create title="Create Roles" />}
            />
            <Route
              path="/delete-roles"
              element={<PlaceholderPage title="Delete Roles" />}
            />
            <Route
              path="/tables"
              element={<PlaceholderPage title="Responsive Tables" />}
            />
            <Route path="/forms" element={<PlaceholderPage title="Forms" />} />
            <Route
              path="/dropdown"
              element={<PlaceholderPage title="Multi-Level Dropdown" />}
            />
            <Route
              path="/empty"
              element={<PlaceholderPage title="Empty Page" />}
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
