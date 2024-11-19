import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Welcome to the Trading Platform</h1>
        <p className="text-lg max-w-xl mx-auto">
          Discover the latest stock prices, create discussions, and join a community of traders. Get started by logging in or signing up.
        </p>
        <div className="space-x-4">
          <Link to="/login">
            <button className="px-6 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-all">Login</button>
          </Link>
          <Link to="/register">
            <button className="px-6 py-2 bg-green-600 rounded-md text-white hover:bg-green-700 transition-all">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
