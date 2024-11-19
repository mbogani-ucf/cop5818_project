// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateThread from "./components/CreateThread";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import PostDetail from "./components/PostDetail";
import PostsList from "./components/PostsList";
import CreatePost from "./components/CreatePost";

function App() {
  
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-thread"
          element={
            <ProtectedRoute>
              <CreateThread />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <PostsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/detail"
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
