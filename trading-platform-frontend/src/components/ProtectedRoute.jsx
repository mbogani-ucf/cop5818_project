import { Navigate } from 'react-router-dom';

// A simple ProtectedRoute component that checks if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Assuming token is stored in localStorage after login

  if (!isAuthenticated) {
    // Redirect them to the login page if they are not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
