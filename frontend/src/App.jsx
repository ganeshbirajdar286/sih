import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import HomePage from "./Pages/HomePage.jsx";
import SignIn from "./Pages/SignIn.jsx";
import SignUp from "./Pages/SignUp.jsx";
import DoctorDashboard from "./Pages/DoctorDashboard";
import PatientDashboard from "./Pages/PatientDashboard";

import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import PublicRoute from "./Components/PublicRoute.jsx";
import DoctorProfile from "./Components/PatientComponents/DoctorProfile.jsx";
import BookAppointment from "./Components/PatientComponents/BookAppointment.jsx";

import { Toaster } from "react-hot-toast";
import "./index.css";
import DoctorsTab from "./Components/PatientComponents/DoctorsTab.jsx";
import RescheduleAppointment from "./Components/PatientComponents/RescheduleAppointment.jsx";
import Appointments from "./Components/PatientDashboard/Appointment.jsx";
import PrakritiVikritiForm from "./Components/PatientDashboard/DoshaPatientForm.jsx";

function App() {
  const { isAuthenticated, isDoctor } = useSelector((state) => state.user);

  return (
    <>
      <Routes>
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

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute doctorOnly>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/:id"
          element={
            <ProtectedRoute>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dosha-assessment"
          element={
            <ProtectedRoute>
              < PrakritiVikritiForm/>
            </ProtectedRoute>
          }
        
        />
     <Route
     path="/doctor"
     element={
      <ProtectedRoute>
        <DoctorsTab/>
      </ProtectedRoute>
     }
     />

        <Route
  path="/book-appointment/:id"
  element={
    <ProtectedRoute>
      <BookAppointment />
    </ProtectedRoute>
  }
/>


        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

<Route
path="/appointments"
element={

  <ProtectedRoute>
    <Appointments/>
  </ProtectedRoute>
}
/>
        <Route
          path="/RescheduleAppointment/:id"
          element={
            <ProtectedRoute>
              <RescheduleAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            !isAuthenticated ? (
              <Navigate to="/signin" replace />
            ) : isDoctor ? (
              <Navigate to="/doctor-dashboard" replace />
            ) : (
              <Navigate to="/patient-dashboard" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
