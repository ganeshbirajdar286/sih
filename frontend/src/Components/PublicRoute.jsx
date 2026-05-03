import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {

  const { isAuthenticated, isDoctor } =
    useSelector((state) => state.user);


  //  Already logged in → block
  if (isAuthenticated) {
    return isDoctor ? (
      <Navigate
        to="/doctor-dashboard"
        replace
      />
    ) : (
      <Navigate
        to="/patient-dashboard"
        replace
      />
    );
  }

  return children;
};

export default PublicRoute;
