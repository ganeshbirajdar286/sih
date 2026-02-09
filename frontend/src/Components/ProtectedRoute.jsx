import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  doctorOnly = false,
}) => {

  const userState = useSelector(
    (state) => state.user
  );

  // Safety guard
  if (!userState) {
    return <Navigate to="/signin" replace />;
  }

  const {
    isAuthenticated,
    isDoctor,
    screenLoading,
  } = userState;


  // ⏳ Loading screen (optional)
  if (screenLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }


  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }


  // 👨‍⚕️ Doctor-only route
  if (doctorOnly && !isDoctor) {
    return (
      <Navigate
        to="/patient-dashboard"
        replace
      />
    );
  }


  // 🧑 Patient-only route
  if (!doctorOnly && isDoctor) {
    return (
      <Navigate
        to="/doctor-dashboard"
        replace
      />
    );
  }


  return children;
};

export default ProtectedRoute;
