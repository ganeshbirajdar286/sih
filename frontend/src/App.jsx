import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";
import CallModal from "./Components/CallModal.jsx";


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
import AppointmentsTab from "./Components/DoctorComponents/AppointmentsTab.jsx";
import PatientProfile from "./Components/DoctorComponents/PatientProfile.jsx";
import CreateDietChart from "./Components/DoctorComponents/Createdietchart.jsx";
import EditDietChart from "./Components/DoctorComponents/Editdietchart.jsx";
import DietChartsTab from "./Components/DoctorComponents/DietChartsTab.jsx";

import { getSocket } from "./services/socket_init.js";
import { setIncomingCall, setCallEnded,setOnlineUsers } from "./feature/video_call/call.slice.js";
import { useWebRTC } from "./hook/useWebRTC";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isDoctor, userProfile } = useSelector(
    (state) => state.user,
  );

 const { addIceCandidate, answerCall, endCall, callPatient, localRef, remoteRef } = useWebRTC(); // ✅ single instance
  const callerInfo = useSelector((s) => s.call.callerInfo);


  useEffect(() => {
    if (!userProfile?._id) return; 
    console.log("Registering socket for user:", userProfile._id);

    const socket = getSocket();
    socket.emit("register", { userId: userProfile._id });

    socket.on("incoming-call", (data) => dispatch(setIncomingCall(data)));
    socket.on("ice-candidate", ({ candidate }) => addIceCandidate(candidate));
    socket.on("call-ended", () => dispatch(setCallEnded()));
    socket.on("online-users", (onlineUsers) => {
  dispatch(setOnlineUsers(onlineUsers));
});
    return () => {
      socket.off("incoming-call");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, [userProfile?._id]);

  return (
    <>
<CallModal
        localRef={localRef}
        remoteRef={remoteRef}
        onAnswer={() => answerCall(callerInfo)}
        onEnd={endCall}
      />

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
              <DoctorDashboard callPatient={callPatient} /> 
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
              <PrakritiVikritiForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute>
              <DoctorsTab />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/patient/:id"
          element={
            <ProtectedRoute doctorOnly={true}>
              <PatientProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="EditDietChart/:id"
          element={
            <ProtectedRoute doctorOnly={true}>
              <EditDietChart />
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
          path="/doctor/createDietChart"
          element={
            <ProtectedRoute doctorOnly={true}>
              <CreateDietChart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/profile/:id"
          element={
            <ProtectedRoute>
              <PatientProfile />
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
              <Appointments />
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
