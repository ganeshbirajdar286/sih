import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import HomePage from "./Pages/HomePage.jsx";
import SignIn from "./Pages/SignIn.jsx";
import SignUp from "./Pages/SignUp.jsx";
import DoctorDashboard from "./Pages/DoctorDashboard";
import PatientDashboard from "./Pages/PatientDashboard";

import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import PublicRoute from "./Components/PublicRoute.jsx";

import { Toaster } from "react-hot-toast";
import "./index.css";

function App() {

  const { isAuthenticated, isDoctor } =
    useSelector((state) => state.user);

  return (
    <>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route path="/" element={<HomePage />} />

        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />


        {/* ================= DOCTOR ================= */}

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute doctorOnly>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />


        {/* ================= PATIENT ================= */}

        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />


        {/* ================= ROLE REDIRECT ================= */}

        <Route
          path="/dashboard"
          element={
            !isAuthenticated ? (
              <Navigate to="/signin" replace />
            ) : isDoctor ? (
              <Navigate
                to="/doctor-dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/patient-dashboard"
                replace
              />
            )
          }
        />


        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>


      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  );
}

export default App;
