import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import SignIn from "./Pages/SignIn.jsx";
import SignUp from "./Pages/SignUp.jsx";
import AyurvedicDashboard from "./Pages/DoctorDashboard"; 
import PatientDashboard from "./Pages/PatientDashboard"; 
import {Toaster} from "react-hot-toast";

import "./index.css";

function App() {
  // Example: role hardcoded (later you can use Context/Redux/Auth)
  const role = "patient"; // or "doctor"

  return (

    <>
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<HomePage />} />

      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Dashboards */}
      <Route path="/patient-dashboard" element={<PatientDashboard />} />
      <Route path="/doctor-dashboard" element={<AyurvedicDashboard />} />

      {/* Agar login ke baad role ke basis pe redirect karna ho */}
      <Route
        path="/dashboard"
        element={
          role === "patient" ? (
            <Navigate to="/patient-dashboard" replace />
          ) : (
            <Navigate to="/doctor-dashboard" replace />
          )
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

    
    <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
    
    
  );
}

export default App;
