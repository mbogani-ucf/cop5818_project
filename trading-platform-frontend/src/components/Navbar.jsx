/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication status in localStorage
  const loggedInStatus = localStorage.getItem("isAuthenticated") === "true";
  useEffect(() => {
    setIsAuthenticated(loggedInStatus);
  }, [loggedInStatus]);

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    localStorage.setItem("isAuthenticated", "false");
    setIsAuthenticated(false)
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link to="/">Social Trading</Link>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/"
            className="text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition duration-150"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition duration-150"
              >
                Dashboard
              </Link>
              <Link
                to="/posts"
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition duration-150"
              >
                Posts
              </Link>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 transition duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-lg transition duration-150"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
