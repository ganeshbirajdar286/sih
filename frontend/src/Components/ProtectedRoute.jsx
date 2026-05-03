import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  doctorOnly = false,
}) => {

  const userState = useSelector(
    (state) => state.user
  );

  if (!userState) {
    return <Navigate to="/signin" replace />;
  }

  const {
    isAuthenticated,
    isDoctor,
    screenLoading,
  } = userState;



  if (screenLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }


  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }


  if (doctorOnly && !isDoctor) {
    return (
      <Navigate
        to="/patient-dashboard"
        replace
      />
    );
  }



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
